/**
 * NutriRoute Meal Planner Page Runtime
 * Manages daily meal plans (Breakfast, Lunch, Snack, Dinner) via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    setupMealPlannerDate();
    await loadMealPlan();
});

let currentMealPlan = {
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: []
};

function setupMealPlannerDate() {
    const dateInput = document.getElementById('meal-plan-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', () => loadMealPlan());
    }
}

async function loadMealPlan() {
    const dateInput = document.getElementById('meal-plan-date');
    const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

    const res = await NutriCommon.apiFetch(`/meals?date=${selectedDate}`);

    if (res.success && res.mealPlan) {
        currentMealPlan = res.mealPlan;
        renderMealPlanUI();
    }
}

function renderMealPlanUI() {
    renderMealSection('breakfast', currentMealPlan.breakfast || []);
    renderMealSection('lunch', currentMealPlan.lunch || []);
    renderMealSection('snack', currentMealPlan.snack || []);
    renderMealSection('dinner', currentMealPlan.dinner || []);

    // Summary Totals
    const calEl = document.getElementById('mp-total-calories');
    const proEl = document.getElementById('mp-total-protein');
    const carbEl = document.getElementById('mp-total-carbs');
    const fatEl = document.getElementById('mp-total-fat');

    if (calEl) calEl.textContent = `${currentMealPlan.total_calories || 0} kcal`;
    if (proEl) proEl.textContent = `${currentMealPlan.total_protein || 0}g`;
    if (carbEl) carbEl.textContent = `${currentMealPlan.total_carbohydrates || 0}g`;
    if (fatEl) fatEl.textContent = `${currentMealPlan.total_fat || 0}g`;
}

function renderMealSection(mealType, items) {
    const container = document.getElementById(`meal-${mealType}-list`);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem; border:1px dashed var(--border-color); border-radius:8px;">
                No ${mealType} items added yet.
            </div>
        `;
        return;
    }

    container.innerHTML = items.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border-color); padding:0.75rem 1rem; border-radius:8px; margin-bottom:0.5rem;">
            <div>
                <strong style="font-size:0.9rem; display:block;">${item.name}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">🔥 ${item.calories} kcal | Protein: ${item.protein || 0}g</span>
            </div>
            <button onclick="removeMealItem('${mealType}', ${idx})" class="btn btn-outline btn-sm" style="color:#ef4444; border-color:#ef4444;" title="Remove Item">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

async function removeMealItem(mealType, index) {
    if (!currentMealPlan[mealType]) return;
    currentMealPlan[mealType].splice(index, 1);
    await saveCurrentMealPlan();
}

async function saveCurrentMealPlan() {
    const dateInput = document.getElementById('meal-plan-date');
    const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

    const payload = {
        date: selectedDate,
        breakfast: currentMealPlan.breakfast || [],
        lunch: currentMealPlan.lunch || [],
        snack: currentMealPlan.snack || [],
        dinner: currentMealPlan.dinner || []
    };

    const res = await NutriCommon.apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (res.success && res.mealPlan) {
        currentMealPlan = res.mealPlan;
        renderMealPlanUI();
        NutriCommon.showToast('Meal plan updated!', 'success');
    } else {
        NutriCommon.showToast(res.message || 'Failed to update meal plan.', 'danger');
    }
}
