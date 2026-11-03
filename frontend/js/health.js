/**
 * NutriRoute Health & Nutrition Profile Page Runtime
 * Manages view & update of health profiles, BMI, calorie targets via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadHealthProfile();
    setupHealthForm();
});

async function loadHealthProfile() {
    const res = await NutriCommon.apiFetch('/health');

    if (res.success && res.healthProfile) {
        const hp = res.healthProfile;

        // Populate Form Fields if elements exist
        setFieldValue('hp-age', hp.age);
        setFieldValue('hp-gender', hp.gender);
        setFieldValue('hp-height', hp.height);
        setFieldValue('hp-weight', hp.weight);
        setFieldValue('hp-activity', hp.activity_level);
        setFieldValue('hp-diet', hp.diet_preference);
        setFieldValue('hp-allergies', Array.isArray(hp.allergies) ? hp.allergies.join(', ') : (hp.allergies || ''));
        setFieldValue('hp-conditions', Array.isArray(hp.health_conditions) ? hp.health_conditions.join(', ') : (hp.health_conditions || ''));

        // Display Cards
        setTextContent('disp-bmi-val', hp.bmi || '22.5');
        setTextContent('disp-bmi-cat', hp.bmi_category || 'Normal range');
        setTextContent('disp-calorie-target', `${hp.daily_calorie_target || 2000} kcal/day`);
        setTextContent('disp-water-target', `${hp.water_target || 8} glasses/day`);
    }
}

function setupHealthForm() {
    const form = document.getElementById('health-profile-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        NutriCommon.setLoading(submitBtn, true, 'Saving changes...');

        const payload = {
            age: document.getElementById('hp-age')?.value,
            gender: document.getElementById('hp-gender')?.value,
            height: document.getElementById('hp-height')?.value,
            weight: document.getElementById('hp-weight')?.value,
            activityLevel: document.getElementById('hp-activity')?.value,
            dietPreference: document.getElementById('hp-diet')?.value,
            allergies: document.getElementById('hp-allergies')?.value,
            healthConditions: document.getElementById('hp-conditions')?.value
        };

        const res = await NutriCommon.apiFetch('/health', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        NutriCommon.setLoading(submitBtn, false);

        if (res.success) {
            NutriCommon.showToast('Health profile updated successfully!', 'success');
            await loadHealthProfile();
        } else {
            NutriCommon.showToast(res.message || 'Failed to update health profile.', 'danger');
        }
    });
}

function setFieldValue(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
}

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) el.textContent = text;
}
