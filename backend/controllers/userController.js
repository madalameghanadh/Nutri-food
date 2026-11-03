const supabase = require('../config/supabase');

const userController = {
    // GET /api/user/profile
    async getProfile(req, res, next) {
        try {
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', req.user.id)
                .single();

            if (userError || !user) {
                return res.status(404).json({ success: false, message: 'User profile not found.' });
            }

            const { data: healthProfile } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            return res.status(200).json({
                success: true,
                user,
                healthProfile: healthProfile || null
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/user/profile
    async updateProfile(req, res, next) {
        try {
            const { name, phone, age, gender, height, weight, activityLevel, dietPreference, allergies, healthConditions } = req.body;

            // 1. Update basic user fields
            const updateUserData = {};
            if (name) updateUserData.name = name.trim();
            if (phone !== undefined) updateUserData.phone = phone ? String(phone).trim() : null;
            updateUserData.updated_at = new Date().toISOString();

            const { data: updatedUser, error: userError } = await supabase
                .from('users')
                .update(updateUserData)
                .eq('id', req.user.id)
                .select()
                .single();

            if (userError) {
                return res.status(400).json({ success: false, message: userError.message });
            }

            // 2. Update health profile if health fields sent
            let updatedHealth = null;
            if (age || gender || height || weight || activityLevel || dietPreference || allergies || healthConditions) {
                const { data: existingHealth } = await supabase
                    .from('health_profiles')
                    .select('*')
                    .eq('user_id', req.user.id)
                    .single();

                const h = parseFloat(height || existingHealth?.height || 170);
                const w = parseFloat(weight || existingHealth?.weight || 65);
                const a = parseInt(age || existingHealth?.age || 25);
                const g = gender || existingHealth?.gender || 'other';

                const heightM = h / 100;
                const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
                let category = 'Normal range';
                if (bmi < 18.5) category = 'Underweight';
                else if (bmi >= 25 && bmi < 30) category = 'Overweight';
                else if (bmi >= 30) category = 'Obesity';

                const healthPayload = {
                    age: a,
                    gender: g,
                    height: h,
                    weight: w,
                    bmi,
                    bmi_category: category,
                    activity_level: activityLevel || existingHealth?.activity_level || 'Moderately Active',
                    diet_preference: dietPreference || existingHealth?.diet_preference || 'Vegetarian',
                    allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : existingHealth?.allergies || []),
                    health_conditions: Array.isArray(healthConditions) ? healthConditions : (healthConditions ? healthConditions.split(',').map(s => s.trim()) : existingHealth?.health_conditions || []),
                    updated_at: new Date().toISOString()
                };

                const { data: hRes } = await supabase
                    .from('health_profiles')
                    .upsert({ user_id: req.user.id, ...healthPayload })
                    .select()
                    .single();

                updatedHealth = hRes;
            }

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully.',
                user: updatedUser,
                healthProfile: updatedHealth
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/user/account
    async deleteAccount(req, res, next) {
        try {
            const authUserId = req.authUser.id;
            const userId = req.user.id;

            // Delete user-related records
            await supabase.from('recommendation_history').delete().eq('user_id', userId);
            await supabase.from('meal_plans').delete().eq('user_id', userId);
            await supabase.from('fitness_tracking').delete().eq('user_id', userId);
            await supabase.from('water_tracking').delete().eq('user_id', userId);
            await supabase.from('favorites').delete().eq('user_id', userId);
            await supabase.from('health_profiles').delete().eq('user_id', userId);
            await supabase.from('users').delete().eq('id', userId);

            // Delete from Supabase Auth admin if available
            try {
                if (supabase.auth.admin && supabase.auth.admin.deleteUser) {
                    await supabase.auth.admin.deleteUser(authUserId);
                }
            } catch (e) {
                console.warn('Note: Admin user deletion skipped:', e.message);
            }

            return res.status(200).json({
                success: true,
                message: 'Your account and all associated data have been permanently deleted.'
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = userController;
