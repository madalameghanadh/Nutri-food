/**
 * NutriRoute Dashboard Page Runtime
 * Fetches and displays real user stats, water intake, fitness logs, and recommendations from Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Ensure user authenticated
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // 1. Fetch User & Health Profile
        const userRes = await NutriCommon.apiFetch('/auth/me');
        if (userRes.success && userRes.user) {
            const user = userRes.user;
            const health = userRes.healthProfile || {};

            // Greeting
            const greetingEl = document.getElementById('user-greeting-name');
            if (greetingEl) greetingEl.textContent = user.name || 'Health Enthusiast';

            // BMI Card
            const bmiVal = document.getElementById('dash-bmi-value');
            const bmiCat = document.getElementById('dash-bmi-category');
            if (bmiVal) bmiVal.textContent = health.bmi || '22.5';
            if (bmiCat) bmiCat.textContent = health.bmi_category || 'Normal range';

            // Calorie Card
            const calVal = document.getElementById('dash-calorie-value');
            if (calVal) calVal.textContent = `${health.daily_calorie_target || 2000} kcal`;
        }

        // 2. Fetch Today's Water
        const waterRes = await NutriCommon.apiFetch('/water/today');
        if (waterRes.success && waterRes.water) {
            const waterVal = document.getElementById('dash-water-value');
            if (waterVal) {
                const glasses = waterRes.water.glasses || 0;
                const target = waterRes.water.target || 8;
                waterVal.textContent = `${glasses} / ${target} glasses`;
            }
        }

        // 3. Fetch Today's Fitness
        const fitnessRes = await NutriCommon.apiFetch('/fitness/today');
        if (fitnessRes.success && fitnessRes.fitness) {
            const stepsVal = document.getElementById('dash-steps-value');
            if (stepsVal) {
                const steps = fitnessRes.fitness.steps || 0;
                stepsVal.textContent = `${steps.toLocaleString()} steps`;
            }
        }

        // 4. Fetch Top AI Food Recommendations
        const recRes = await NutriCommon.apiFetch('/recommendations');
        if (recRes.success && Array.isArray(recRes.recommendations)) {
            renderDashboardRecommendations(recRes.recommendations.slice(0, 3));
        }

        // 5. Render Charts
        loadDashboardCharts();

    } catch (err) {
        console.error('Error loading dashboard data:', err);
    }
}

function renderDashboardRecommendations(recs) {
    const container = document.getElementById('dashboard-recommendations-list');
    if (!container) return;

    if (!recs || recs.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted" style="padding:2rem;">
                <i class="fa-solid fa-utensils" style="font-size:2rem; margin-bottom:0.5rem; opacity:0.5;"></i>
                <p>No recommendations generated yet. Go to AI Recommendations to generate!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recs.map(r => {
        const food = r.food;
        return `
            <div class="card food-card" style="margin-bottom:1rem; display:flex; flex-direction:row; align-items:center; gap:1rem; padding:1rem;">
                <img src="${food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}" alt="${food.name}" style="width:80px; height:80px; object-fit:cover; border-radius:12px;">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <h4 style="margin:0 0 0.3rem 0; font-size:1rem;">${food.name}</h4>
                        <span class="badge badge-success" style="font-size:0.75rem;"><i class="fa-solid fa-sparkles"></i> ${r.score}% Match</span>
                    </div>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin:0 0 0.4rem 0;">${r.reason || 'Matches your dietary profile.'}</p>
                    <div style="display:flex; gap:0.75rem; font-size:0.75rem; color:var(--text-main); font-weight:500;">
                        <span>🔥 ${food.calories} kcal</span>
                        <span>💪 ${food.protein}g Protein</span>
                        <span>🌾 ${food.fiber || 0}g Fiber</span>
                    </div>
                </div>
                <div>
                    <a href="food-details.html?id=${food.id}" class="btn btn-outline btn-sm">Details</a>
                </div>
            </div>
        `;
    }).join('');
}

async function loadDashboardCharts() {
    const waterCtx = document.getElementById('dashWaterChart');
    const fitnessCtx = document.getElementById('dashFitnessChart');

    if (waterCtx && typeof Chart !== 'undefined') {
        const waterWeeklyRes = await NutriCommon.apiFetch('/water/weekly');
        if (waterWeeklyRes.success && waterWeeklyRes.weekly) {
            const labels = waterWeeklyRes.weekly.map(w => w.day);
            const data = waterWeeklyRes.weekly.map(w => w.glasses);

            new Chart(waterCtx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Glasses of Water',
                        data,
                        backgroundColor: 'rgba(14, 165, 233, 0.75)',
                        borderColor: 'rgb(14, 165, 233)',
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 12 }
                    }
                }
            });
        }
    }

    if (fitnessCtx && typeof Chart !== 'undefined') {
        const fitnessWeeklyRes = await NutriCommon.apiFetch('/fitness/weekly');
        if (fitnessWeeklyRes.success && fitnessWeeklyRes.weekly) {
            const labels = fitnessWeeklyRes.weekly.map(f => f.day);
            const data = fitnessWeeklyRes.weekly.map(f => f.steps);

            new Chart(fitnessCtx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Daily Steps',
                        data,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }
}
