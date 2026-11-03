/**
 * NutriRoute Food Search & Filter Engine
 * Performs dynamic search, multi-criteria filtering, and live grid updating.
 */

const FoodSearchService = {
    search(options = {}) {
        const {
            query = '',
            category = 'all',
            mealType = 'all',
            maxCalories = 600,
            minProtein = 0,
            vegetarianOnly = false,
            veganOnly = false,
            highProteinOnly = false,
            lowCalorieOnly = false,
            excludeAllergens = []
        } = options;

        const cleanQuery = query.toLowerCase().trim();
        const userExcludeAllergens = excludeAllergens.map(a => a.toLowerCase());

        return NUTRIRoute_FOODS.filter(food => {
            // 1. Text Search
            if (cleanQuery) {
                const matchesName = food.name.toLowerCase().includes(cleanQuery);
                const matchesCat = food.category.toLowerCase().includes(cleanQuery);
                const matchesIngr = (food.ingredients || []).some(ing => ing.toLowerCase().includes(cleanQuery));
                if (!matchesName && !matchesCat && !matchesIngr) return false;
            }

            // 2. Category Filter
            if (category !== 'all' && food.category !== category) {
                return false;
            }

            // 3. Meal Type Filter
            if (mealType !== 'all' && !food.mealType.includes(mealType)) {
                return false;
            }

            // 4. Calories Filter
            if (food.calories > maxCalories) {
                return false;
            }

            // 5. Protein Filter
            if (food.protein < minProtein) {
                return false;
            }

            // 6. High Protein Toggle (>= 15g)
            if (highProteinOnly && food.protein < 15) {
                return false;
            }

            // 7. Low Calorie Toggle (<= 250 kcal)
            if (lowCalorieOnly && food.calories > 250) {
                return false;
            }

            // 8. Vegan Filter
            if (veganOnly && !food.vegan) {
                return false;
            }

            // 9. Vegetarian Filter
            if (vegetarianOnly && !food.vegetarian) {
                return false;
            }

            // 10. Allergen Exclusion Filter
            if (userExcludeAllergens.length > 0) {
                const foodAllergens = (food.allergens || []).map(a => a.toLowerCase());
                const hasForbiddenAllergen = userExcludeAllergens.some(a => foodAllergens.includes(a));
                if (hasForbiddenAllergen) return false;
            }

            return true;
        });
    },

    getCategories() {
        const set = new Set(NUTRIRoute_FOODS.map(f => f.category));
        return Array.from(set);
    }
};
