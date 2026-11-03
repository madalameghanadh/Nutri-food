const supabase = require('../config/supabase');

const FOODS_SEED = [
    {
        name: "Steamed Idli with Sambar",
        category: "Breakfast",
        description: "Fermented steamed rice and pulse cakes served with hot lentil vegetable soup.",
        price: 90,
        calories: 220,
        protein: 8,
        carbohydrates: 42,
        fat: 2,
        fiber: 5,
        sugar: 3,
        serving_size: "2 Idlis + Sambar",
        diet_type: "Vegetarian",
        allergens: [],
        health_benefits: ["Probiotic properties supporting gut health", "Easily digestible complex carbs"],
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        tags: ["breakfast", "vegetarian", "vegan", "south-indian", "high-fiber"]
    },
    {
        name: "Crispy Masala Dosa",
        category: "Breakfast",
        description: "Golden rice crepe filled with spiced potato masala.",
        price: 120,
        calories: 320,
        protein: 7,
        carbohydrates: 48,
        fat: 11,
        fiber: 4,
        sugar: 4,
        serving_size: "1 Dosa",
        diet_type: "Vegetarian",
        allergens: ["dairy"],
        health_benefits: ["Sustained energy release", "Rich in traditional spices"],
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
        tags: ["breakfast", "vegetarian", "south-indian"]
    },
    {
        name: "Vegetable Oats Upma",
        category: "Breakfast",
        description: "Wholesome oats cooked with mixed vegetables, mustard seeds, and curry leaves.",
        price: 110,
        calories: 240,
        protein: 9,
        carbohydrates: 38,
        fat: 6,
        fiber: 7,
        sugar: 3,
        serving_size: "1 Bowl (250g)",
        diet_type: "Vegetarian",
        allergens: ["gluten"],
        health_benefits: ["Beta-glucans help reduce cholesterol", "High satiety score"],
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        tags: ["breakfast", "vegetarian", "high-fiber", "low-calorie"]
    },
    {
        name: "Ven Pongal",
        category: "Breakfast",
        description: "Comforting South Indian rice and moong dal dish tempered with black pepper and ghee.",
        price: 100,
        calories: 310,
        protein: 8,
        carbohydrates: 44,
        fat: 10,
        fiber: 4,
        sugar: 1,
        serving_size: "1 Bowl",
        diet_type: "Vegetarian",
        allergens: ["dairy", "nuts"],
        health_benefits: ["Balanced carb to protein ratio", "Gentle on stomach"],
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
        tags: ["breakfast", "vegetarian", "south-indian"]
    },
    {
        name: "Poha with Roasted Peanuts",
        category: "Breakfast",
        description: "Flattened rice tempered with turmeric, onions, green chilies, and peanuts.",
        price: 80,
        calories: 260,
        protein: 6,
        carbohydrates: 42,
        fat: 8,
        fiber: 3,
        sugar: 2,
        serving_size: "1 Plate",
        diet_type: "Vegetarian",
        allergens: ["peanuts"],
        health_benefits: ["Iron-rich flattened rice", "Quick healthy energy"],
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        tags: ["breakfast", "vegetarian", "vegan", "quick"]
    },
    {
        name: "Sprouted Moong Salad",
        category: "Snacks",
        description: "Fresh mung bean sprouts tossed with tomatoes, cucumber, lemon juice, and chaat masala.",
        price: 95,
        calories: 140,
        protein: 10,
        carbohydrates: 22,
        fat: 1,
        fiber: 6,
        sugar: 4,
        serving_size: "1 Bowl (150g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Enzyme-rich raw sprouts", "High plant protein, ultra low fat"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
        tags: ["snack", "vegan", "high-protein", "low-calorie"]
    },
    {
        name: "Punjabi Rajma Masala with Brown Rice",
        category: "Lunch",
        description: "Red kidney beans cooked in aromatic tomato-onion gravy served over brown rice.",
        price: 180,
        calories: 420,
        protein: 16,
        carbohydrates: 68,
        fat: 8,
        fiber: 12,
        sugar: 5,
        serving_size: "1 Plate",
        diet_type: "Vegetarian",
        allergens: [],
        health_benefits: ["Complete amino acid profile when paired with rice", "Low glycemic index"],
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        tags: ["lunch", "dinner", "vegetarian", "high-protein", "high-fiber"]
    },
    {
        name: "Classic Chana Masala with Whole Wheat Chapati",
        category: "Lunch",
        description: "Chickpeas simmered in spiced onion gravy with 2 whole wheat rotis.",
        price: 160,
        calories: 380,
        protein: 14,
        carbohydrates: 58,
        fat: 9,
        fiber: 11,
        sugar: 4,
        serving_size: "1 Bowl Chana + 2 Roti",
        diet_type: "Vegan",
        allergens: ["gluten"],
        health_benefits: ["Rich in folate and plant iron", "Excellent blood sugar management"],
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
        tags: ["lunch", "dinner", "vegan", "high-fiber"]
    },
    {
        name: "Palak Paneer with Whole Wheat Roti",
        category: "Dinner",
        description: "Cottage cheese cubes cooked in smooth spinach gravy with garlic and Indian spices.",
        price: 210,
        calories: 390,
        protein: 18,
        carbohydrates: 30,
        fat: 20,
        fiber: 6,
        sugar: 3,
        serving_size: "1 Bowl + 2 Roti",
        diet_type: "Vegetarian",
        allergens: ["dairy", "gluten"],
        health_benefits: ["High calcium and bioavailable iron", "Muscle recovery booster"],
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        tags: ["dinner", "vegetarian", "high-protein"]
    },
    {
        name: "Tofu Vegetable Stir Fry",
        category: "Dinner",
        description: "Pan-seared tofu tossed with bell peppers, broccoli, and light soy ginger sauce.",
        price: 230,
        calories: 280,
        protein: 19,
        carbohydrates: 18,
        fat: 14,
        fiber: 5,
        sugar: 4,
        serving_size: "1 Plate (300g)",
        diet_type: "Vegan",
        allergens: ["soy"],
        health_benefits: ["Lean plant-based protein", "Rich in antioxidants"],
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        tags: ["dinner", "vegan", "high-protein", "low-carb"]
    },
    {
        name: "Grilled Chicken Breast with Quinoa",
        category: "Dinner",
        description: "Herb-marinated grilled chicken breast served over fluffy quinoa and steamed asparagus.",
        price: 290,
        calories: 450,
        protein: 42,
        carbohydrates: 32,
        fat: 12,
        fiber: 5,
        sugar: 2,
        serving_size: "1 Plate",
        diet_type: "Non-Vegetarian",
        allergens: [],
        health_benefits: ["Ultra high protein density", "Complete essential amino acids"],
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80",
        tags: ["dinner", "non-vegetarian", "high-protein"]
    },
    {
        name: "Steamed Fish Curry with Brown Rice",
        category: "Lunch",
        description: "Fresh fish fillet simmered in light coconut turmeric curry served with brown rice.",
        price: 270,
        calories: 390,
        protein: 30,
        carbohydrates: 40,
        fat: 11,
        fiber: 4,
        sugar: 2,
        serving_size: "1 Bowl Curry + Rice",
        diet_type: "Non-Vegetarian",
        allergens: ["fish"],
        health_benefits: ["Rich in Omega-3 fatty acids for heart and brain health"],
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
        tags: ["lunch", "dinner", "non-vegetarian", "high-protein"]
    },
    {
        name: "Boiled Eggs (2 whole eggs)",
        category: "Snacks",
        description: "Hard-boiled free-range eggs seasoned with black pepper and sea salt.",
        price: 60,
        calories: 140,
        protein: 12,
        carbohydrates: 1,
        fat: 10,
        fiber: 0,
        sugar: 0,
        serving_size: "2 Eggs",
        diet_type: "Non-Vegetarian",
        allergens: ["egg"],
        health_benefits: ["Choline for brain function", "High bioavailability protein"],
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
        tags: ["snack", "breakfast", "non-vegetarian", "high-protein", "keto-friendly"]
    },
    {
        name: "Greek Yogurt Berry Parfait",
        category: "Snacks",
        description: "Unsweetened Greek yogurt layered with fresh strawberries, blueberries, and raw honey.",
        price: 150,
        calories: 210,
        protein: 15,
        carbohydrates: 24,
        fat: 4,
        fiber: 4,
        sugar: 14,
        serving_size: "1 Cup (200g)",
        diet_type: "Vegetarian",
        allergens: ["dairy"],
        health_benefits: ["High probiotic content for gut flora", "Antioxidant booster"],
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
        tags: ["snack", "breakfast", "vegetarian", "high-protein"]
    },
    {
        name: "Fresh Crisp Apple",
        category: "Fruits",
        description: "Crispy red apple rich in natural dietary fiber and vitamin C.",
        price: 50,
        calories: 95,
        protein: 0.5,
        carbohydrates: 25,
        fat: 0.3,
        fiber: 4.4,
        sugar: 19,
        serving_size: "1 Medium Apple (180g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Pectin fiber aids digestion", "Supports heart health"],
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
        tags: ["fruits", "vegan", "low-calorie", "high-fiber"]
    },
    {
        name: "Ripe Yellow Banana",
        category: "Fruits",
        description: "Potassium-rich banana offering quick sustained energy for active lifestyles.",
        price: 30,
        calories: 105,
        protein: 1.3,
        carbohydrates: 27,
        fat: 0.3,
        fiber: 3.1,
        sugar: 14,
        serving_size: "1 Medium Banana (120g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Prevents muscle cramping", "Essential potassium source"],
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
        tags: ["fruits", "vegan", "energy"]
    },
    {
        name: "Fresh Papaya Cubes",
        category: "Fruits",
        description: "Sweet tropical papaya loaded with papain digestive enzymes.",
        price: 70,
        calories: 60,
        protein: 1,
        carbohydrates: 15,
        fat: 0.4,
        fiber: 2.5,
        sugar: 11,
        serving_size: "1 Bowl (150g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Papain aids protein digestion", "High Vitamin A and C"],
        image: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=600&auto=format&fit=crop&q=80",
        tags: ["fruits", "vegan", "low-calorie"]
    },
    {
        name: "Steamed Broccoli Florets",
        category: "Vegetables",
        description: "Lightly steamed broccoli seasoned with olive oil and garlic powder.",
        price: 130,
        calories: 55,
        protein: 4,
        carbohydrates: 11,
        fat: 1,
        fiber: 5,
        sugar: 2,
        serving_size: "1 Cup (150g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Sulforaphane compound with powerful antioxidant benefits"],
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80",
        tags: ["vegetables", "vegan", "low-calorie", "high-fiber"]
    },
    {
        name: "Fresh Spinach Salad with Flaxseeds",
        category: "Vegetables",
        description: "Baby spinach leaves topped with toasted flaxseeds, lemon vinaigrette, and cucumber.",
        price: 140,
        calories: 120,
        protein: 4,
        carbohydrates: 8,
        fat: 9,
        fiber: 4,
        sugar: 2,
        serving_size: "1 Large Salad Bowl",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Plant-based Omega-3 ALA", "Rich in lutein and folate"],
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        tags: ["vegetables", "vegan", "high-fiber", "low-carb"]
    },
    {
        name: "Roasted Chickpeas (Chana)",
        category: "Snacks",
        description: "Crunchy oven-roasted chickpeas seasoned with cumin, chili, and sea salt.",
        price: 75,
        calories: 180,
        protein: 9,
        carbohydrates: 28,
        fat: 4,
        fiber: 7,
        sugar: 2,
        serving_size: "1 Handful (50g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Crunchy low-fat snack replacing fried chips"],
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        tags: ["snack", "vegan", "high-fiber"]
    },
    {
        name: "Mixed Almonds and Walnuts",
        category: "Snacks",
        description: "Raw un-salted almonds and walnuts packed with healthy fats.",
        price: 160,
        calories: 200,
        protein: 6,
        carbohydrates: 6,
        fat: 18,
        fiber: 4,
        sugar: 1,
        serving_size: "30g",
        diet_type: "Vegan",
        allergens: ["tree-nuts"],
        health_benefits: ["Brain food rich in Vitamin E and Omega-3"],
        image: "https://images.unsplash.com/photo-1508061252971-70529d8165cf?w=600&auto=format&fit=crop&q=80",
        tags: ["snack", "vegan", "keto-friendly"]
    },
    {
        name: "Dal Tadka with Steamed Basmati Rice",
        category: "Lunch",
        description: "Yellow arhar dal tempered with cumin, garlic, ghee, and fresh coriander.",
        price: 150,
        calories: 360,
        protein: 12,
        carbohydrates: 60,
        fat: 8,
        fiber: 7,
        sugar: 2,
        serving_size: "1 Bowl Dal + Rice",
        diet_type: "Vegetarian",
        allergens: ["dairy"],
        health_benefits: ["Traditional Indian comforting balanced staple"],
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        tags: ["lunch", "dinner", "vegetarian"]
    },
    {
        name: "Vegetable Pulav with Cucumber Raita",
        category: "Lunch",
        description: "Fragrant basmati rice cooked with peas, carrots, beans, served with chilled yogurt raita.",
        price: 170,
        calories: 340,
        protein: 9,
        carbohydrates: 54,
        fat: 10,
        fiber: 5,
        sugar: 4,
        serving_size: "1 Plate",
        diet_type: "Vegetarian",
        allergens: ["dairy"],
        health_benefits: ["Cooling yogurt aids digestion during warm meals"],
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        tags: ["lunch", "vegetarian"]
    },
    {
        name: "Juicy Sweet Orange",
        category: "Fruits",
        description: "Sun-ripened orange rich in natural Vitamin C and hydrating electrolytes.",
        price: 45,
        calories: 62,
        protein: 1.2,
        carbohydrates: 15,
        fat: 0.2,
        fiber: 3.1,
        sugar: 12,
        serving_size: "1 Medium Fruit",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["Boosts immunity with 100% daily Vitamin C"],
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop&q=80",
        tags: ["fruits", "vegan", "low-calorie"]
    },
    {
        name: "Crispy Cucumber Salad",
        category: "Vegetables",
        description: "Sliced cucumber topped with pepper, mint, and lemon juice.",
        price: 40,
        calories: 30,
        protein: 1,
        carbohydrates: 6,
        fat: 0.2,
        fiber: 2,
        sugar: 3,
        serving_size: "1 Plate (200g)",
        diet_type: "Vegan",
        allergens: [],
        health_benefits: ["95% water content for ultra hydration"],
        image: "https://images.unsplash.com/photo-1447175008436-08417189295a?w=600&auto=format&fit=crop&q=80",
        tags: ["vegetables", "vegan", "low-calorie", "keto-friendly"]
    }
];

async function seedFoods() {
    console.log('🌱 Starting Food Database Seeding with Delivery Prices...');
    try {
        let seededCount = 0;

        for (const foodItem of FOODS_SEED) {
            const { data: existing } = await supabase
                .from('foods')
                .select('id')
                .eq('name', foodItem.name)
                .maybeSingle();

            if (existing) {
                const { error: updateErr } = await supabase
                    .from('foods')
                    .update(foodItem)
                    .eq('id', existing.id);

                if (updateErr) {
                    console.error(`❌ Error updating "${foodItem.name}":`, updateErr.message);
                } else {
                    seededCount++;
                }
            } else {
                const { error: insertErr } = await supabase
                    .from('foods')
                    .insert([foodItem]);

                if (insertErr) {
                    console.error(`❌ Error inserting "${foodItem.name}":`, insertErr.message);
                } else {
                    seededCount++;
                }
            }
        }

        console.log(`✅ Successfully seeded ${seededCount} / ${FOODS_SEED.length} food items into Supabase!`);
        process.exit(0);
    } catch (err) {
        console.error('Fatal seed error:', err);
        process.exit(1);
    }
}

seedFoods();
