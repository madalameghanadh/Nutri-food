/**
 * MongoDB Compass Data Seeder for NutriRoute
 * Populates sample foods, health profiles, and orders into MongoDB.
 * Run with: node backend/seed/seedMongoDB.js
 */

const mongoose = require('mongoose');
const Food = require('../models/Food');
const User = require('../models/User');
const Order = require('../models/Order');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutriroute';

const SAMPLE_FOODS = [
    {
        name: "Avocado & Quinoa Power Bowl",
        category: "Salads & Bowls",
        calories: 420,
        protein: 14,
        carbs: 48,
        fat: 18,
        fiber: 12,
        glycemic_index: 35,
        diet_tags: ["Vegetarian", "Vegan", "Gluten-Free", "High-Fiber"],
        allergens: [],
        price: 240,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
        description: "Nutrient-packed bowl with Hass avocado, organic tricolor quinoa, roasted chickpeas, and tahini drizzle."
    },
    {
        name: "Grilled Mediterranean Salmon",
        category: "High-Protein Meals",
        calories: 510,
        protein: 42,
        carbs: 18,
        fat: 26,
        fiber: 6,
        glycemic_index: 25,
        diet_tags: ["Non-Vegetarian", "Keto-Friendly", "High-Protein", "Omega-3"],
        allergens: ["Fish"],
        price: 380,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
        description: "Wild-caught salmon fillet grilled with herb infused olive oil, served with steamed asparagus and lemon wedges."
    },
    {
        name: "Spiced Green Moong Sprout Salad",
        category: "Detox & Light Meals",
        calories: 220,
        protein: 16,
        carbs: 32,
        fat: 3,
        fiber: 10,
        glycemic_index: 28,
        diet_tags: ["Vegetarian", "Vegan", "Low-Fat", "Diabetic-Friendly"],
        allergens: [],
        price: 140,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
        description: "Fresh sprouted moong beans tossed with pomegranate seeds, cucumber, mint, and cumin lime vinaigrette."
    },
    {
        name: "Keto Paneer Tikka Skewers",
        category: "Keto & Low-Carb",
        calories: 360,
        protein: 22,
        carbs: 8,
        fat: 26,
        fiber: 4,
        glycemic_index: 20,
        diet_tags: ["Vegetarian", "Keto-Friendly", "Low-Carb", "High-Calcium"],
        allergens: ["Dairy"],
        price: 220,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600",
        description: "Fresh cottage cheese cubes marinated in Greek yogurt and stone-ground Indian spices, tandoor grilled."
    },
    {
        name: "Chia Berry Antioxidant Pudding",
        category: "Healthy Desserts & Breakfast",
        calories: 260,
        protein: 8,
        carbs: 34,
        fat: 9,
        fiber: 14,
        glycemic_index: 30,
        diet_tags: ["Vegetarian", "Vegan", "Dairy-Free", "Superfood"],
        allergens: [],
        price: 160,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
        description: "Overnight chia seeds soaked in unsweetened almond milk, layered with wild blueberries and toasted almonds."
    }
];

const SAMPLE_USER = {
    name: "Siva",
    email: "siva@nutriroute.com",
    phone: "+91 98450 12345",
    healthProfile: {
        age: 26,
        gender: "Male",
        height_cm: 175,
        weight_kg: 70,
        bmi: 22.9,
        bmi_category: "Normal range",
        daily_calorie_target: 2350,
        daily_water_target_glasses: 8,
        activity_level: "Moderately Active",
        diet_preference: "Vegetarian",
        allergies: [],
        health_conditions: []
    }
};

async function seed() {
    console.log("====================================================");
    console.log("🍃 NutriRoute MongoDB Compass Seeder");
    console.log("====================================================");
    console.log(`Attempting connection to: ${MONGODB_URI} ...`);

    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 6000 });
        console.log("✅ Successfully connected to MongoDB!");

        // Clear existing
        await Food.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        // Insert Foods
        const insertedFoods = await Food.insertMany(SAMPLE_FOODS);
        console.log(`✅ Seeded ${insertedFoods.length} Healthy Food Items into collection 'foods'`);

        // Insert User
        const insertedUser = await User.create(SAMPLE_USER);
        console.log(`✅ Seeded User '${insertedUser.name}' into collection 'users'`);

        // Insert Sample Order
        const sampleOrder = {
            order_number: "NR-882910-101",
            user_email: insertedUser.email,
            items: [
                {
                    food_id: insertedFoods[0]._id.toString(),
                    name: insertedFoods[0].name,
                    price: insertedFoods[0].price,
                    quantity: 2,
                    calories: insertedFoods[0].calories * 2,
                    image: insertedFoods[0].image
                }
            ],
            total_amount: insertedFoods[0].price * 2,
            delivery_fee: 0,
            total_calories: insertedFoods[0].calories * 2,
            delivery_address: "Flat 402, Green Meadows Residency, Bengaluru",
            contact_phone: "+91 98450 12345",
            payment_method: "Cash on Delivery",
            payment_status: "Pending",
            order_status: "Preparing",
            rider_name: "Suresh Kumar",
            rider_phone: "+91 98450 12345",
            estimated_delivery_minutes: 25
        };
        await Order.create(sampleOrder);
        console.log(`✅ Seeded Sample Delivery Order into collection 'orders'`);

        console.log("\n====================================================");
        console.log("🎉 DATABASE SEEDED SUCCESSFULLY FOR MONGODB COMPASS!");
        console.log("====================================================");
        console.log("👉 HOW TO VIEW IN MONGODB COMPASS:");
        console.log(`1. Open MongoDB Compass`);
        console.log(`2. In the connection URI box, paste:`);
        console.log(`   ${MONGODB_URI}`);
        console.log(`3. Click 'Connect'`);
        console.log(`4. Click on database 'nutriroute' to explore your collections:`);
        console.log(`   - foods`);
        console.log(`   - users`);
        console.log(`   - orders`);
        console.log("====================================================\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Could not connect to local MongoDB server:", err.message);
        console.log("\n💡 TIP: If you are using MongoDB Atlas (Cloud Database):");
        console.log("1. Add your Atlas connection string to backend/.env:");
        console.log("   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nutriroute");
        console.log("2. Then re-run: node backend/seed/seedMongoDB.js\n");
        process.exit(1);
    }
}

seed();
