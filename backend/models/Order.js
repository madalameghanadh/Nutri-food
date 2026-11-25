const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    food_id: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    calories: { type: Number, default: 200 },
    image: { type: String }
});

const OrderSchema = new mongoose.Schema({
    order_number: { type: String, required: true, unique: true },
    user_email: { type: String, required: true },
    items: [OrderItemSchema],
    total_amount: { type: Number, required: true },
    delivery_fee: { type: Number, default: 40 },
    total_calories: { type: Number, default: 0 },
    delivery_address: { type: String, required: true },
    contact_phone: { type: String, required: true },
    payment_method: { type: String, default: 'Cash on Delivery' },
    payment_status: { type: String, default: 'Pending' },
    order_status: { type: String, default: 'Preparing' },
    rider_name: { type: String, default: 'Suresh Kumar' },
    rider_phone: { type: String, default: '+91 98450 12345' },
    estimated_delivery_minutes: { type: Number, default: 30 },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
