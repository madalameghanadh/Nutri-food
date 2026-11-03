/**
 * NutriRoute BMI Calculator Page Runtime
 * Calculates BMI & saves metrics to Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    setupBmiCalculator();
    await loadInitialBmi();
});

async function loadInitialBmi() {
    const res = await NutriCommon.apiFetch('/health');
    if (res.success && res.healthProfile) {
        const hp = res.healthProfile;
        if (hp.height) document.getElementById('bmi-height').value = hp.height;
        if (hp.weight) document.getElementById('bmi-weight').value = hp.weight;
        if (hp.bmi) {
            updateBmiDisplay(hp.bmi, hp.bmi_category);
        }
    }
}

function setupBmiCalculator() {
    const form = document.getElementById('bmi-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const height = parseFloat(document.getElementById('bmi-height')?.value);
        const weight = parseFloat(document.getElementById('bmi-weight')?.value);

        if (!height || !weight || height <= 0 || weight <= 0) {
            NutriCommon.showToast('Please enter valid positive height and weight values.', 'danger');
            return;
        }

        const heightM = height / 100;
        const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
        let category = 'Normal range';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 25 && bmi < 30) category = 'Overweight';
        else if (bmi >= 30) category = 'Obesity';

        updateBmiDisplay(bmi, category);

        // Save to backend
        const submitBtn = form.querySelector('button[type="submit"]');
        NutriCommon.setLoading(submitBtn, true, 'Saving BMI...');

        const res = await NutriCommon.apiFetch('/health/bmi', {
            method: 'POST',
            body: JSON.stringify({ height, weight })
        });

        NutriCommon.setLoading(submitBtn, false);

        if (res.success) {
            NutriCommon.showToast(`BMI ${bmi} (${category}) saved to your profile!`, 'success');
        } else {
            NutriCommon.showToast(res.message || 'Calculated BMI but failed to save to profile.', 'warning');
        }
    });
}

function updateBmiDisplay(bmi, category) {
    const valEl = document.getElementById('bmi-result-val');
    const catEl = document.getElementById('bmi-result-cat');

    if (valEl) valEl.textContent = bmi;
    if (catEl) catEl.textContent = category;
}
