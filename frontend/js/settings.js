/**
 * NutriRoute Settings Page Runtime
 * Manages security settings, password change, and permanent account deletion via Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    setupPasswordForm();
    setupDeleteAccount();
});

function setupPasswordForm() {
    const form = document.getElementById('change-password-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPass = document.getElementById('new-password')?.value;
        const confirmPass = document.getElementById('confirm-password')?.value;

        if (newPass !== confirmPass) {
            NutriCommon.showToast('New passwords do not match.', 'danger');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        NutriCommon.setLoading(submitBtn, true, 'Updating password...');

        const res = await NutriCommon.apiFetch('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ newPassword: newPass })
        });

        NutriCommon.setLoading(submitBtn, false);

        if (res.success) {
            NutriCommon.showToast('Password changed successfully!', 'success');
            form.reset();
        } else {
            NutriCommon.showToast(res.message || 'Failed to change password.', 'danger');
        }
    });
}

function setupDeleteAccount() {
    const deleteBtn = document.getElementById('delete-account-btn');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', async () => {
        const confirmed = confirm('⚠️ ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?\n\nThis will permanently delete your profile, health data, favorites, water logs, fitness logs, meal plans, and recommendation history. This action cannot be undone.');

        if (!confirmed) return;

        NutriCommon.setLoading(deleteBtn, true, 'Deleting account...');

        const res = await NutriCommon.apiFetch('/user/account', {
            method: 'DELETE'
        });

        if (res.success) {
            NutriCommon.setToken(null);
            alert('Your account has been deleted successfully.');
            window.location.href = 'register.html';
        } else {
            NutriCommon.setLoading(deleteBtn, false);
            NutriCommon.showToast(res.message || 'Failed to delete account.', 'danger');
        }
    });
}
