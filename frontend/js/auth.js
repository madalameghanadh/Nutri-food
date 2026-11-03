/**
 * NutriRoute Authentication System
 * Connects frontend auth logic to Express + Supabase API endpoints.
 */

const PROTECTED_PAGES = [
    'dashboard.html',
    'recommendations.html',
    'food-details.html',
    'meal-planner.html',
    'bmi.html',
    'water.html',
    'hydration.html',
    'fitness.html',
    'health.html',
    'nutrition.html',
    'favorites.html',
    'history.html',
    'profile.html',
    'settings.html'
];

const AuthService = {
    // Check user authentication status with backend
    async checkAuth() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isProtected = PROTECTED_PAGES.includes(currentPage);
        const isLoginPage = (currentPage === 'login.html');
        const token = NutriCommon.getToken();

        if (isProtected && !token) {
            window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
            return false;
        }

        if (token) {
            const res = await NutriCommon.apiFetch('/auth/me');
            if (res.success && res.user) {
                // Populate global user avatar if element exists
                const userAvatars = document.querySelectorAll('.current-user-avatar');
                const initials = res.user.name ? res.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'US';
                userAvatars.forEach(av => av.textContent = initials);

                if (isLoginPage) {
                    window.location.href = 'dashboard.html';
                }
                return true;
            } else if (isProtected) {
                NutriCommon.setToken(null);
                window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
                return false;
            }
        }

        return false;
    },

    // Login user
    async login(email, password) {
        const res = await NutriCommon.apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (res.success && res.token) {
            NutriCommon.setToken(res.token);
            if (res.user) {
                localStorage.setItem('nutri_user', JSON.stringify(res.user));
            }
        }

        return res;
    },

    // Register user
    async register(userData) {
        // Clear any old active session first
        NutriCommon.setToken(null);
        localStorage.removeItem('nutri_user');

        const res = await NutriCommon.apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (res.success && res.token) {
            NutriCommon.setToken(res.token);
            if (res.user) {
                localStorage.setItem('nutri_user', JSON.stringify(res.user));
            }
        }

        return res;
    },

    // Logout user
    async logout() {
        await NutriCommon.apiFetch('/auth/logout', { method: 'POST' });
        NutriCommon.setToken(null);
        localStorage.removeItem('nutri_user');
        window.location.href = 'login.html';
    }
};

// Check route protection on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    AuthService.checkAuth();
});
