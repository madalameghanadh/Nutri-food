const supabase = require('../config/supabase');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const mealController = {
    // GET /api/meals?date=YYYY-MM-DD
    async getMealPlan(req, res, next) {
        try {
            const planDate = req.query.date || getTodayDateStr();

            const { data: plan, error } = await supabase
                .from('meal_plans')
                .select('*')
                .eq('user_id', req.user.id)
                .eq('plan_date', planDate)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching meal plan:', error);
            }

            return res.status(200).json({
                success: true,
                mealPlan: plan || {
                    user_id: req.user.id,
                    plan_date: planDate,
                    breakfast: [],
                    lunch: [],
                    snack: [],
                    dinner: [],
                    total_calories: 0,
                    total_protein: 0,
                    total_carbohydrates: 0,
                    total_fat: 0
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/meals (Create or update meal plan for date)
    async saveMealPlan(req, res, next) {
        try {
            const { date, breakfast, lunch, snack, dinner } = req.body;
            const planDate = date || getTodayDateStr();

            const bList = Array.isArray(breakfast) ? breakfast : [];
            const lList = Array.isArray(lunch) ? lunch : [];
            const sList = Array.isArray(snack) ? snack : [];
            const dList = Array.isArray(dinner) ? dinner : [];

            const allItems = [...bList, ...lList, ...sList, ...dList];

            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            for (const item of allItems) {
                totalCalories += parseInt(item.calories || 0);
                totalProtein += parseFloat(item.protein || 0);
                totalCarbs += parseFloat(item.carbohydrates || item.carbs || 0);
                totalFat += parseFloat(item.fat || 0);
            }

            const payload = {
                user_id: req.user.id,
                plan_date: planDate,
                breakfast: bList,
                lunch: lList,
                snack: sList,
                dinner: dList,
                total_calories: totalCalories,
                total_protein: parseFloat(totalProtein.toFixed(1)),
                total_carbohydrates: parseFloat(totalCarbs.toFixed(1)),
                total_fat: parseFloat(totalFat.toFixed(1)),
                updated_at: new Date().toISOString()
            };

            const { data: updated, error } = await supabase
                .from('meal_plans')
                .upsert(payload, { onConflict: 'user_id,plan_date' })
                .select()
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Meal plan saved successfully.',
                mealPlan: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/meals/:id
    async updateMealPlan(req, res, next) {
        return mealController.saveMealPlan(req, res, next);
    },

    // DELETE /api/meals/:id
    async deleteMealPlan(req, res, next) {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('meal_plans')
                .delete()
                .eq('id', id)
                .eq('user_id', req.user.id);

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({ success: true, message: 'Meal plan deleted.' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = mealController;
