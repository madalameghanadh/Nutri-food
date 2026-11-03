/**
 * NutriRoute Fitness Tracker Page Runtime
 * Manages steps, exercise minutes, and calories burned via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadFitnessLog();
    setupFitnessForm();
});

let currentFitnessRecord = { steps: 0, exercise_minutes: 0, calories_burned: 0 };

async function loadFitnessLog() {
    const res = await NutriCommon.apiFetch('/fitness/today');
    if (res.success && res.fitness) {
        currentFitnessRecord = res.fitness;
        updateFitnessUI();
    }
    await loadFitnessChart();
}

function updateFitnessUI() {
    const stepsEl = document.getElementById('fitness-steps-val');
    const minsEl = document.getElementById('fitness-mins-val');
    const calsEl = document.getElementById('fitness-cals-val');

    if (stepsEl) stepsEl.textContent = (currentFitnessRecord.steps || 0).toLocaleString();
    if (minsEl) minsEl.textContent = `${currentFitnessRecord.exercise_minutes || 0} mins`;
    if (calsEl) calsEl.textContent = `${currentFitnessRecord.calories_burned || 0} kcal`;

    // Populate inputs if form active
    const stepsInput = document.getElementById('input-steps');
    const minsInput = document.getElementById('input-mins');
    const calsInput = document.getElementById('input-cals');

    if (stepsInput) stepsInput.value = currentFitnessRecord.steps || '';
    if (minsInput) minsInput.value = currentFitnessRecord.exercise_minutes || '';
    if (calsInput) calsInput.value = currentFitnessRecord.calories_burned || '';
}

function setupFitnessForm() {
    const form = document.getElementById('fitness-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        NutriCommon.setLoading(submitBtn, true, 'Saving activity...');

        const payload = {
            steps: document.getElementById('input-steps')?.value || 0,
            exerciseMinutes: document.getElementById('input-mins')?.value || 0,
            caloriesBurned: document.getElementById('input-cals')?.value || 0
        };

        const res = await NutriCommon.apiFetch('/fitness', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        NutriCommon.setLoading(submitBtn, false);

        if (res.success && res.fitness) {
            currentFitnessRecord = res.fitness;
            updateFitnessUI();
            NutriCommon.showToast('Fitness activity saved!', 'success');
            await loadFitnessChart();
        } else {
            NutriCommon.showToast(res.message || 'Failed to save fitness activity.', 'danger');
        }
    });
}

async function loadFitnessChart() {
    const canvas = document.getElementById('fitnessHistoryChart') || document.getElementById('fitnessChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const res = await NutriCommon.apiFetch('/fitness/weekly');
    if (res.success && Array.isArray(res.weekly)) {
        const labels = res.weekly.map(f => f.day);
        const stepsData = res.weekly.map(f => f.steps);

        if (window.fitnessChartInstance) {
            window.fitnessChartInstance.destroy();
        }

        window.fitnessChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Steps',
                    data: stepsData,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5
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
