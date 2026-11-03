const supabase = require('../config/supabase');

// Calculate BMI & BMI Category helper
const calculateBmiDetails = (heightCm, weightKg) => {
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    let category = 'Normal range';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obesity';
    return { bmi, category };
};

// Calculate Calorie Target helper
const calculateCalorieTarget = (gender, weight, height, age, activity) => {
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') ? 5 : -161;

    let multiplier = 1.2;
    if (activity.toLowerCase().includes('light')) multiplier = 1.375;
    else if (activity.toLowerCase().includes('moderate')) multiplier = 1.55;
    else if (activity.toLowerCase().includes('very') || activity.toLowerCase().includes('active')) multiplier = 1.725;

    return Math.round(bmr * multiplier);
};

const authController = {
    // POST /api/auth/register
    async register(req, res, next) {
        try {
            const {
                name, email, password, phone,
                age, gender, height, weight, activityLevel, dietPreference,
                allergies, healthConditions
            } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
            }
            const cleanEmail = email.trim().toLowerCase();

            // 1. Sign up user via Supabase Auth with user metadata
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: cleanEmail,
                password: password,
                options: {
                    data: {
                        name: name.trim()
                    }
                }
            });

            if (authError || !authData.user) {
                return res.status(400).json({
                    success: false,
                    message: authError ? authError.message : 'Registration failed with Supabase Auth.'
                });
            }

            const authUser = authData.user;
            const session = authData.session;

            // 2. Create record in users table with dynamic values (id is generated automatically by PostgreSQL identity)
            const userPayload = {
                auth_user_id: authUser.id,
                name: name.trim(),
                email: cleanEmail,
                phone: phone ? String(phone).trim() : null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: userRecords, error: userError } = await supabase
                .from('users')
                .upsert([userPayload], { onConflict: 'auth_user_id' })
                .select();

            if (userError || !userRecords || userRecords.length === 0) {
                console.error('Error inserting into users table:', userError);
                return res.status(500).json({
                    success: false,
                    message: userError 
                        ? `User profile setup error: ${userError.message}` 
                        : 'User record creation failed.'
                });
            }

            const userRecord = userRecords[0];

            // 3. Calculate BMI & Calorie/Water Targets
            const h = parseFloat(height) || 170;
            const w = parseFloat(weight) || 65;
            const a = parseInt(age) || 25;
            const g = gender || 'other';
            const act = activityLevel || 'Moderately Active';
            const diet = dietPreference || 'Vegetarian';

            const { bmi, category } = calculateBmiDetails(h, w);
            const calorieTarget = calculateCalorieTarget(g, w, h, a, act);

            // Parse array strings if sent as comma-separated text
            const allergiesList = Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : []);
            const conditionsList = Array.isArray(healthConditions) ? healthConditions : (healthConditions ? healthConditions.split(',').map(s => s.trim()) : []);

            // 4. Create record in health_profiles table
            const { error: healthError } = await supabase
                .from('health_profiles')
                .insert([{
                    user_id: userRecord.id,
                    age: a,
                    gender: g,
                    height: h,
                    weight: w,
                    bmi: bmi,
                    bmi_category: category,
                    activity_level: act,
                    diet_preference: diet,
                    allergies: allergiesList,
                    health_conditions: conditionsList,
                    daily_calorie_target: calorieTarget,
                    water_target: 8
                }]);

            if (healthError) {
                console.error('Error creating health profile:', healthError);
            }

            // 5. Auto-login newly registered user so new JWT token is returned immediately
            let token = session ? session.access_token : null;
            if (!token) {
                try {
                    const { data: loginData } = await supabase.auth.signInWithPassword({
                        email: cleanEmail,
                        password: password
                    });
                    if (loginData && loginData.session) {
                        token = loginData.session.access_token;
                    }
                } catch (e) {
                    console.warn('Auto-login on register notice:', e.message);
                }
            }

            return res.status(201).json({
                success: true,
                message: 'Registration successful! Welcome to NutriRoute.',
                token,
                user: {
                    id: userRecord.id,
                    name: userRecord.name,
                    email: userRecord.email
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
            }

            const cleanEmail = email.trim().toLowerCase();

            // Sign in with Supabase Auth
            let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: password
            });

            if (authError || !authData || !authData.session) {
                const errMsg = authError ? authError.message : 'Invalid email or password.';
                
                // Auto-confirm fallback for existing accounts if unconfirmed
                if (errMsg.toLowerCase().includes('email not confirmed')) {
                    try {
                        if (supabase.auth.admin && typeof supabase.auth.admin.listUsers === 'function') {
                            const { data: listData } = await supabase.auth.admin.listUsers();
                            const targetUser = listData?.users?.find(u => u.email && u.email.toLowerCase() === cleanEmail);
                            if (targetUser) {
                                await supabase.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
                                const retryRes = await supabase.auth.signInWithPassword({
                                    email: cleanEmail,
                                    password: password
                                });
                                if (retryRes.data && retryRes.data.session) {
                                    authData = retryRes.data;
                                    authError = null;
                                }
                            }
                        }
                    } catch (e) {
                        console.warn('Auto-confirm retry notice:', e.message);
                    }
                }
            }

            if (authError || !authData || !authData.session) {
                return res.status(401).json({
                    success: false,
                    message: authError ? authError.message : 'Invalid email or password.'
                });
            }

            const token = authData.session.access_token;

            // Fetch internal user profile
            const { data: userProfile } = await supabase
                .from('users')
                .select('*')
                .eq('auth_user_id', authData.user.id)
                .single();

            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                token,
                user: userProfile || { name: authData.user.email.split('@')[0], email: authData.user.email }
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/logout
    async logout(req, res, next) {
        try {
            if (req.token) {
                await supabase.auth.signOut(req.token);
            }
            return res.status(200).json({ success: true, message: 'Logged out successfully.' });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/auth/me
    async me(req, res, next) {
        try {
            // req.user is attached by requireAuth middleware
            const { data: healthProfile } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            return res.status(200).json({
                success: true,
                user: req.user,
                healthProfile: healthProfile || null
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/auth/change-password
    async changePassword(req, res, next) {
        try {
            const { newPassword } = req.body;

            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
            }

            // Update user password in Supabase Auth
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({ success: true, message: 'Password changed successfully.' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = authController;
