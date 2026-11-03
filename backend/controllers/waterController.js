const supabase = require('../config/supabase');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const waterController = {
    // GET /api/water/today
    async getTodayWater(req, res, next) {
        try {
            const today = getTodayDateStr();

            const { data: record, error } = await supabase
                .from('water_tracking')
                .select('*')
                .eq('user_id', req.user.id)
                .eq('tracking_date', today)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching water tracking:', error);
            }

            return res.status(200).json({
                success: true,
                water: record || {
                    user_id: req.user.id,
                    tracking_date: today,
                    glasses: 0,
                    target: 8
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/water/weekly
    async getWeeklyWater(req, res, next) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const { data: records, error } = await supabase
                .from('water_tracking')
                .select('*')
                .eq('user_id', req.user.id)
                .gte('tracking_date', startStr)
                .lte('tracking_date', endStr)
                .order('tracking_date', { ascending: true });

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            // Fill missing days with 0 glasses for clean chart render
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
                    glasses: match ? match.glasses : 0,
                    target: match ? match.target : 8
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

    // POST /api/water or PUT /api/water
    async updateWater(req, res, next) {
        try {
            const { glasses, target, date } = req.body;
            const trackingDate = date || getTodayDateStr();
            const newGlasses = glasses !== undefined ? Math.max(0, parseInt(glasses)) : 0;
            const waterTarget = target ? parseInt(target) : 8;

            const { data: updated, error } = await supabase
                .from('water_tracking')
                .upsert({
                    user_id: req.user.id,
                    tracking_date: trackingDate,
                    glasses: newGlasses,
                    target: waterTarget,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,tracking_date' })
                .select()
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Water log updated successfully.',
                water: updated
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = waterController;
