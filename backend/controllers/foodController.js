const supabase = require('../config/supabase');

const foodController = {
    // GET /api/foods
    async getAllFoods(req, res, next) {
        try {
            const { category, diet, search, tag } = req.query;

            let query = supabase.from('foods').select('*');

            if (category && category !== 'All') {
                query = query.eq('category', category);
            }
            if (diet && diet !== 'All') {
                query = query.ilike('diet_type', `%${diet}%`);
            }
            if (search) {
                query = query.ilike('name', `%${search.trim()}%`);
            }
            if (tag) {
                query = query.contains('tags', [tag]);
            }

            const { data: foods, error } = await query.order('name', { ascending: true });

            if (error) {
                return res.status(400).json({ success: false, message: error.message });
            }

            return res.status(200).json({
                success: true,
                count: foods ? foods.length : 0,
                foods: foods || []
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/foods/:id
    async getFoodById(req, res, next) {
        try {
            const { id } = req.params;

            const { data: food, error } = await supabase
                .from('foods')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !food) {
                return res.status(404).json({ success: false, message: 'Food item not found.' });
            }

            return res.status(200).json({
                success: true,
                food
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = foodController;
