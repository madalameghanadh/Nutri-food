const supabase = require('../config/supabase');

const healthController = {
    // GET /api/health
    async getHealthProfile(req, res, next) {
        try {
            const { data: healthProfile, error } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                healthProfile: healthProfile || null
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/health
    async updateHealthProfile(req, res, next) {
        try {
            const {
                age, gender, height, weight, activityLevel, dietPreference,
                allergies, healthConditions, dailyCalorieTarget, waterTarget
            } = req.body;

            const { data: existing } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            const h = parseFloat(height || existing?.height || 170);
            const w = parseFloat(weight || existing?.weight || 65);
            const a = parseInt(age || existing?.age || 25);
            const g = gender || existing?.gender || 'other';

            const heightM = h / 100;
            const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
            let category = 'Normal range';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi >= 25 && bmi < 30) category = 'Overweight';
            else if (bmi >= 30) category = 'Obesity';

            // Calculate calorie target if not explicitly passed
            let calTarget = dailyCalorieTarget ? parseInt(dailyCalorieTarget) : (existing?.daily_calorie_target || 2000);
            if (!dailyCalorieTarget && (height || weight || age || gender || activityLevel)) {
                let bmr = 10 * w + 6.25 * h - 5 * a;
                bmr += (g.toLowerCase() === 'male' || g.toLowerCase() === 'm') ? 5 : -161;
                const act = (activityLevel || existing?.activity_level || 'Moderately Active').toLowerCase();
                let multiplier = 1.2;
                if (act.includes('light')) multiplier = 1.375;
                else if (act.includes('moderate')) multiplier = 1.55;
                else if (act.includes('very') || act.includes('active')) multiplier = 1.725;
                calTarget = Math.round(bmr * multiplier);
            }

            const allergiesList = Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : existing?.allergies || []);
            const conditionsList = Array.isArray(healthConditions) ? healthConditions : (healthConditions ? healthConditions.split(',').map(s => s.trim()) : existing?.health_conditions || []);

            const payload = {
                user_id: req.user.id,
                age: a,
                gender: g,
                height: h,
                weight: w,
                bmi,
                bmi_category: category,
                activity_level: activityLevel || existing?.activity_level || 'Moderately Active',
                diet_preference: dietPreference || existing?.diet_preference || 'Vegetarian',
                allergies: allergiesList,
                health_conditions: conditionsList,
                daily_calorie_target: calTarget,
                water_target: waterTarget ? parseInt(waterTarget) : (existing?.water_target || 8),
                updated_at: new Date().toISOString()
            };

            const { data: updated, error } = await supabase
                .from('health_profiles')
                .upsert(payload)
                .select()
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Health profile updated successfully.',
                healthProfile: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/health/bmi
    async saveBmi(req, res, next) {
        try {
            const { height, weight } = req.body;

            if (!height || !weight) {
                return res.status(400).json({ success: false, message: 'Height and weight are required.' });
            }

            const h = parseFloat(height);
            const w = parseFloat(weight);

            const heightM = h / 100;
            const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
            let category = 'Normal range';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi >= 25 && bmi < 30) category = 'Overweight';
            else if (bmi >= 30) category = 'Obesity';

            const { data: updated, error } = await supabase
                .from('health_profiles')
                .upsert({
                    user_id: req.user.id,
                    height: h,
                    weight: w,
                    bmi,
                    bmi_category: category,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: `BMI calculated: ${bmi} (${category})`,
                bmi,
                category,
                healthProfile: updated
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = healthController;
