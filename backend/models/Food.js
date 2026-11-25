const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Healthy' },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    glycemic_index: { type: Number, default: 50 },
    diet_tags: [{ type: String }],
    allergens: [{ type: String }],
    price: { type: Number, default: 150 },
    rating: { type: Number, default: 4.8 },
    image: { type: String },
    description: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);
