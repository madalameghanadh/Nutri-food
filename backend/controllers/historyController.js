const supabase = require('../config/supabase');

const historyController = {
    // GET /api/history
    async getHistory(req, res, next) {
        try {
            const { data: history, error } = await supabase
                .from('recommendation_history')
                .select('id, score, reason, created_at, foods(*)')
                .eq('user_id', req.user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            const formatted = (history || []).map(h => ({
                id: h.id,
                date: h.created_at ? new Date(h.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
                createdAt: h.created_at,
                score: h.score,
                reason: h.reason,
                food: h.foods
            }));

            return res.status(200).json({
                success: true,
                count: formatted.length,
                history: formatted
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = historyController;
