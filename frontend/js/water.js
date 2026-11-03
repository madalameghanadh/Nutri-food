/**
 * NutriRoute Water Tracker Page Runtime
 * Manages daily water intake logs via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadWaterLog();
    setupWaterButtons();
});

let currentWaterRecord = { glasses: 0, target: 8 };

async function loadWaterLog() {
    const res = await NutriCommon.apiFetch('/water/today');
    if (res.success && res.water) {
        currentWaterRecord = res.water;
        updateWaterUI();
    }
    await loadWaterChart();
}

function updateWaterUI() {
    const displayVal = document.getElementById('water-display-val');
    if (displayVal) {
        displayVal.textContent = `${currentWaterRecord.glasses} / ${currentWaterRecord.target} glasses`;
    }

    // Update SVG progress ring if available
    const circle = document.getElementById('water-svg-circle');
    if (circle) {
        const pct = Math.min(1, currentWaterRecord.glasses / currentWaterRecord.target);
        const circumference = 534;
        const offset = circumference - (pct * circumference);
        circle.style.strokeDashoffset = offset;
    }
}

function setupWaterButtons() {
    const add1Btn = document.getElementById('add-1-btn') || document.getElementById('add-250-btn');
    const add2Btn = document.getElementById('add-2-btn') || document.getElementById('add-500-btn');
    const resetBtn = document.getElementById('reset-water-btn');

    if (add1Btn) {
        add1Btn.addEventListener('click', () => updateWaterAmount(currentWaterRecord.glasses + 1));
    }
    if (add2Btn) {
        add2Btn.addEventListener('click', () => updateWaterAmount(currentWaterRecord.glasses + 2));
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => updateWaterAmount(0));
    }
}

async function updateWaterAmount(newGlasses) {
    const payload = {
        glasses: Math.max(0, newGlasses),
        target: currentWaterRecord.target || 8
    };

    const res = await NutriCommon.apiFetch('/water', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (res.success && res.water) {
        currentWaterRecord = res.water;
        updateWaterUI();
        NutriCommon.showToast(res.message || 'Water log updated!', 'success');
        await loadWaterChart();
    } else {
        NutriCommon.showToast(res.message || 'Failed to update water log.', 'danger');
    }
}

async function loadWaterChart() {
    const canvas = document.getElementById('hydrationHistoryChart') || document.getElementById('waterChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const res = await NutriCommon.apiFetch('/water/weekly');
    if (res.success && Array.isArray(res.weekly)) {
        const labels = res.weekly.map(w => w.day);
        const data = res.weekly.map(w => w.glasses);

        if (window.waterChartInstance) {
            window.waterChartInstance.destroy();
        }

        window.waterChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Glasses Drunk',
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
