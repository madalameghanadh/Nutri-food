const supabase = require('../config/supabase');
const RecommendationEngine = require('../services/recommendationEngine');

const recommendationController = {
    // GET /api/recommendations
    async getRecommendations(req, res, next) {
        try {
            // Fetch user's health profile
            const { data: healthProfile } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            // Fetch all foods
            const { data: foods, error: foodErr } = await supabase
                .from('foods')
                .select('*');

            if (foodErr) {
                return res.status(500).json({ success: false, message: 'Failed to fetch foods dataset.' });
            }

            const scoredRecommendations = RecommendationEngine.generateRecommendations(foods || [], healthProfile || {});

            return res.status(200).json({
                success: true,
                count: scoredRecommendations.length,
                recommendations: scoredRecommendations
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/recommendations/generate
    async generateRecommendations(req, res, next) {
        try {
            // 1. Fetch user health profile
            const { data: healthProfile } = await supabase
                .from('health_profiles')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            if (!healthProfile) {
                return res.status(400).json({
                    success: false,
                    message: 'Health profile required to generate recommendations. Please update your profile first.'
                });
            }

            // 2. Fetch all foods from Supabase
            const { data: foods, error: foodErr } = await supabase
                .from('foods')
                .select('*');

            if (foodErr || !foods) {
                return res.status(500).json({ success: false, message: 'Failed to fetch foods dataset.' });
            }

            // 3. Run Recommendation Engine
            const scoredResults = RecommendationEngine.generateRecommendations(foods, healthProfile);

            // 4. Save top 10 generated recommendations into recommendation_history
            const top10 = scoredResults.slice(0, 10);
            const historyInserts = top10.map(item => ({
                user_id: req.user.id,
                food_id: item.food.id,
                score: item.score,
                reason: item.reason,
                created_at: new Date().toISOString()
            }));

            if (historyInserts.length > 0) {
                await supabase.from('recommendation_history').insert(historyInserts);
            }

            return res.status(200).json({
                success: true,
                message: `Successfully generated ${scoredResults.length} personalized food recommendations!`,
                recommendations: scoredResults
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = recommendationController;
