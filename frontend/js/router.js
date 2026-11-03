/**
 * NutriRoute Single Page Router
 * Manages hash routing, view switching, protected route enforcement,
 * active link highlighting, and browser history state.
 */

const Router = {
    routes: [
        'landing',
        'register',
        'login',
        'dashboard',
        'profile',
        'bmi',
        'recommendations',
        'meal-planner',
        'nutrition',
        'calories',
        'water',
        'fitness',
        'search',
        'favorites',
        'progress',
        'weekly-progress',
        'grocery-list',
        'pantry-ai',
        'settings',
        'help',
        'logout'
    ],

    protectedRoutes: [
        'dashboard',
        'profile',
        'bmi',
        'recommendations',
        'meal-planner',
        'nutrition',
        'calories',
        'water',
        'fitness',
        'search',
        'favorites',
        'progress',
        'weekly-progress',
        'grocery-list',
        'pantry-ai',
        'settings'
    ],

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Handle initial page load route
        this.handleRoute();
    },

    navigate(route) {
        window.location.hash = `#${route}`;
    },

    getCurrentRoute() {
        const hash = window.location.hash.replace('#', '').trim();
        return hash || 'landing';
    },

    handleRoute() {
        let route = this.getCurrentRoute();
        
        // Handle logout route special case
        if (route === 'logout') {
            AuthService.logout();
            ToastService.show('You have logged out successfully.', 'info');
            this.navigate('landing');
            return;
        }

        // Route Guard for Protected Routes
        if (this.protectedRoutes.includes(route) && !AuthService.isLoggedIn()) {
            ToastService.show('Please log in to access NutriRoute dashboard features.', 'warning');
            this.navigate('login');
            return;
        }

        // Redirect logged-in users away from Login/Register to Dashboard
        if ((route === 'login' || route === 'register') && AuthService.isLoggedIn()) {
            this.navigate('dashboard');
            return;
        }

        // Hide all view containers
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.add('hidden');
        });

        // Determine target view element
        let targetView = document.getElementById(`view-${route}`);
        if (!targetView) {
            targetView = document.getElementById('view-landing');
            route = 'landing';
        }

        // Show target view
        targetView.classList.remove('hidden');

        // Toggle layout shell (Navbar vs Sidebar layout)
        const isAuthOrLanding = ['landing', 'login', 'register'].includes(route);
        const appShell = document.getElementById('app-shell');
        const landingHeader = document.getElementById('landing-header');

        if (isAuthOrLanding) {
            if (appShell) appShell.classList.add('is-landing-mode');
            if (landingHeader) landingHeader.classList.remove('hidden');
        } else {
            if (appShell) appShell.classList.remove('is-landing-mode');
            if (landingHeader) landingHeader.classList.add('hidden');
        }

        // Update navigation active states
        document.querySelectorAll('[data-nav]').forEach(link => {
            const navRoute = link.getAttribute('data-nav');
            if (navRoute === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger view rendering logic in main app controller
        if (window.App && typeof window.App.renderView === 'function') {
            window.App.renderView(route);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
