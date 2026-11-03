const supabase = require('../config/supabase');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const fitnessController = {
    // GET /api/fitness/today
    async getTodayFitness(req, res, next) {
        try {
            const today = getTodayDateStr();

            const { data: record, error } = await supabase
                .from('fitness_tracking')
                .select('*')
                .eq('user_id', req.user.id)
                .eq('tracking_date', today)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching fitness record:', error);
            }

            return res.status(200).json({
                success: true,
                fitness: record || {
                    user_id: req.user.id,
                    tracking_date: today,
                    steps: 0,
                    exercise_minutes: 0,
                    calories_burned: 0
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/fitness/weekly
    async getWeeklyFitness(req, res, next) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const { data: records, error } = await supabase
                .from('fitness_tracking')
                .select('*')
                .eq('user_id', req.user.id)
                .gte('tracking_date', startStr)
                .lte('tracking_date', endStr)
                .order('tracking_date', { ascending: true });

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const weeklyData = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = dayLabels[d.getDay()];

                const match = (records || []).find(r => r.tracking_date === dateStr);
                weeklyData.push({
                    date: dateStr,
                    day: dayName,
                    steps: match ? match.steps : 0,
                    exercise_minutes: match ? match.exercise_minutes : 0,
                    calories_burned: match ? match.calories_burned : 0
                });
            }

            return res.status(200).json({
                success: true,
                weekly: weeklyData
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/fitness or PUT /api/fitness
    async updateFitness(req, res, next) {
        try {
            const { steps, exerciseMinutes, caloriesBurned, date } = req.body;
            const trackingDate = date || getTodayDateStr();

            const payload = {
                user_id: req.user.id,
                tracking_date: trackingDate,
                steps: steps !== undefined ? Math.max(0, parseInt(steps)) : 0,
                exercise_minutes: exerciseMinutes !== undefined ? Math.max(0, parseInt(exerciseMinutes)) : 0,
                calories_burned: caloriesBurned !== undefined ? Math.max(0, parseInt(caloriesBurned)) : 0,
                updated_at: new Date().toISOString()
            };

            const { data: updated, error } = await supabase
                .from('fitness_tracking')
                .upsert(payload, { onConflict: 'user_id,tracking_date' })
                .select()
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Fitness activity saved successfully.',
                fitness: updated
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = fitnessController;
