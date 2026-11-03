/**
 * NutriRoute Local Intelligent Recommendation Engine
 * Evaluates food items against user health profile using rule-based scoring algorithms.
 * NO external AI API key required.
 */

const RecommendationEngine = {
    /**
     * Scores a single food item for a specific health profile
     * @param {Object} food - Food record
     * @param {Object} profile - User HealthProfile record
     * @returns {Object} { score: number, reason: string, isExcluded: boolean, excludeReason?: string }
     */
    evaluateFood(food, profile) {
        if (!food || !profile) {
            return { score: 50, reason: 'General health recommendation', isExcluded: false };
        }

        const userDiet = (profile.diet_preference || 'Vegetarian').toLowerCase();
        const foodDiet = (food.diet_type || food.diet || 'Vegetarian').toLowerCase();
        const userAllergies = Array.isArray(profile.allergies) ? profile.allergies.map(a => a.toLowerCase().trim()) : [];
        const foodAllergens = Array.isArray(food.allergens) ? food.allergens.map(a => a.toLowerCase().trim()) : [];
        const userConditions = Array.isArray(profile.health_conditions) ? profile.health_conditions.map(c => c.toLowerCase().trim()) : [];
        const activityLevel = (profile.activity_level || 'Moderately Active').toLowerCase();

        // 1. DIET CONFLICT CHECK (Strict Exclusion)
        if (userDiet === 'vegan' && foodDiet !== 'vegan') {
            return { score: 0, reason: 'Excluded due to vegan diet conflict.', isExcluded: true };
        }
        if (userDiet === 'vegetarian' && foodDiet === 'non-vegetarian') {
            return { score: 0, reason: 'Excluded due to vegetarian diet conflict.', isExcluded: true };
        }

        // 2. ALLERGY CONFLICT CHECK (Strict Exclusion)
        for (const allergen of foodAllergens) {
            if (userAllergies.includes(allergen)) {
                return {
                    score: 0,
                    reason: `Excluded because it contains allergen: ${allergen}.`,
                    isExcluded: true
                };
            }
        }

        let score = 50; // Base score
        const reasons = [];

        // 3. DIET COMPATIBILITY (+20)
        if (userDiet === foodDiet) {
            score += 20;
            reasons.push(`Matches your ${profile.diet_preference} dietary preference (+20)`);
        } else {
            score += 10;
            reasons.push(`Compatible with your diet (+10)`);
        }

        // 4. ACTIVITY & PROTEIN ALIGNMENT (+10)
        const isHighActivity = activityLevel.includes('active') || activityLevel.includes('athlete') || activityLevel.includes('very');
        if (isHighActivity && food.protein >= 12) {
            score += 10;
            reasons.push('High protein content supports your active lifestyle (+10)');
        } else if (!isHighActivity && food.calories <= 350) {
            score += 10;
            reasons.push('Moderate calorie density aligns well with your activity level (+10)');
        }

        // 5. NUTRITION & FIBER COMPATIBILITY (+10)
        if (food.fiber >= 4) {
            score += 10;
            reasons.push('Rich in dietary fiber aiding digestion and gut health (+10)');
        } else if (food.protein >= 8) {
            score += 5;
            reasons.push('Good protein source for muscle maintenance (+5)');
        }

        // 6. HEALTH CONDITION COMPATIBILITY (+10)
        let healthMatched = false;
        if (userConditions.includes('diabetes') || userConditions.includes('diabetic')) {
            if ((food.sugar || 0) <= 5 && food.fiber >= 3) {
                score += 10;
                healthMatched = true;
                reasons.push('Low glycemic profile suitable for blood sugar management (+10)');
            }
        }
        if (userConditions.includes('hypertension') || userConditions.includes('high blood pressure')) {
            if (food.category === 'Fruits' || food.category === 'Vegetables' || (food.fiber || 0) >= 3) {
                score += 10;
                healthMatched = true;
                reasons.push('Heart-healthy nutrient composition (+10)');
            }
        }
        if (!healthMatched && userConditions.length === 0) {
            score += 10;
            reasons.push('Nutrient-dense clean health profile (+10)');
        }

        // Clamp final score 0 - 100
        const finalScore = Math.min(100, Math.max(0, score));
        const summaryReason = reasons.length > 0
            ? reasons.join('. ') + '.'
            : `Recommended based on your health profile and nutritional needs.`;

        return {
            score: finalScore,
            reason: summaryReason,
            isExcluded: false
        };
    },

    /**
     * Generates scored recommendations for all available foods
     * @param {Array} foods - Array of food records
     * @param {Object} profile - User HealthProfile record
     * @returns {Array} List of scored foods sorted by score descending
     */
    generateRecommendations(foods, profile) {
        if (!Array.isArray(foods)) return [];

        const results = [];

        for (const food of foods) {
            const evalResult = this.evaluateFood(food, profile);
            if (!evalResult.isExcluded) {
                results.push({
                    food,
                    score: evalResult.score,
                    reason: evalResult.reason
                });
            }
        }

        // Sort by highest match score first
        return results.sort((a, b) => b.score - a.score);
    }
};

module.exports = RecommendationEngine;
