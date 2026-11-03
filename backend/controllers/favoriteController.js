const supabase = require('../config/supabase');

const favoriteController = {
    // GET /api/favorites
    async getFavorites(req, res, next) {
        try {
            const { data: favorites, error } = await supabase
                .from('favorites')
                .select('id, created_at, foods(*)')
                .eq('user_id', req.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            const formatted = (favorites || []).map(f => ({
                favoriteId: f.id,
                createdAt: f.created_at,
                food: f.foods
            })).filter(f => f.food !== null);

            return res.status(200).json({
                success: true,
                count: formatted.length,
                favorites: formatted
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/favorites/:foodId
    async addFavorite(req, res, next) {
        try {
            const { foodId } = req.params;

            if (!foodId) {
                return res.status(400).json({ success: false, message: 'Food ID is required.' });
            }

            // Check duplicate
            const { data: existing } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', req.user.id)
                .eq('food_id', foodId)
                .single();

            if (existing) {
                return res.status(200).json({
                    success: true,
                    message: 'Item is already in your favorites.',
                    isFavorite: true
                });
            }

            const { data: inserted, error } = await supabase
                .from('favorites')
                .insert([{
                    user_id: req.user.id,
                    food_id: foodId
                }])
                .select('id, foods(*)')
                .single();

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(201).json({
                success: true,
                message: 'Added to favorites!',
                isFavorite: true,
                favorite: inserted
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/favorites/:foodId
    async removeFavorite(req, res, next) {
        try {
            const { foodId } = req.params;

            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', req.user.id)
                .eq('food_id', foodId);

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Removed from favorites.',
                isFavorite: false
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = favoriteController;
