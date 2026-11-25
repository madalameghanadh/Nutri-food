const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: null },
    healthProfile: {
        age: { type: Number, default: 25 },
        gender: { type: String, default: 'other' },
        height_cm: { type: Number, default: 170 },
        weight_kg: { type: Number, default: 65 },
        bmi: { type: Number, default: 22.5 },
        bmi_category: { type: String, default: 'Normal range' },
        daily_calorie_target: { type: Number, default: 2000 },
        daily_water_target_glasses: { type: Number, default: 8 },
        activity_level: { type: String, default: 'Moderately Active' },
        diet_preference: { type: String, default: 'Vegetarian' },
        allergies: [{ type: String }],
        health_conditions: [{ type: String }]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
