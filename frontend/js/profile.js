/**
 * NutriRoute Profile Page Runtime
 * Manages user profile & health preferences via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadUserProfile();
    setupProfileForm();
});

async function loadUserProfile() {
    const res = await NutriCommon.apiFetch('/user/profile');

    if (res.success && res.user) {
        const u = res.user;
        const hp = res.healthProfile || {};

        setVal('prof-name', u.name);
        setVal('prof-email', u.email);
        setVal('prof-phone', u.phone);

        setVal('prof-age', hp.age);
        setVal('prof-gender', hp.gender);
        setVal('prof-height', hp.height);
        setVal('prof-weight', hp.weight);
        setVal('prof-activity', hp.activity_level);
        setVal('prof-diet', hp.diet_preference);
        setVal('prof-allergies', Array.isArray(hp.allergies) ? hp.allergies.join(', ') : (hp.allergies || ''));
        setVal('prof-conditions', Array.isArray(hp.health_conditions) ? hp.health_conditions.join(', ') : (hp.health_conditions || ''));

        // Display Header Text
        setText('user-display-name', u.name || 'User Profile');
        setText('user-display-email', u.email || '');
    }
}

function setupProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        NutriCommon.setLoading(submitBtn, true, 'Updating profile...');

        const payload = {
            name: getVal('prof-name'),
            phone: getVal('prof-phone'),
            age: getVal('prof-age'),
            gender: getVal('prof-gender'),
            height: getVal('prof-height'),
            weight: getVal('prof-weight'),
            activityLevel: getVal('prof-activity'),
            dietPreference: getVal('prof-diet'),
            allergies: getVal('prof-allergies'),
            healthConditions: getVal('prof-conditions')
        };

        const res = await NutriCommon.apiFetch('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        NutriCommon.setLoading(submitBtn, false);

        if (res.success) {
            NutriCommon.showToast('Profile updated successfully!', 'success');
            await loadUserProfile();
        } else {
            NutriCommon.showToast(res.message || 'Failed to update profile.', 'danger');
        }
    });
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) el.textContent = text;
}
