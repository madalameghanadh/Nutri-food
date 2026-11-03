/**
 * NutriRoute Storage Layer
 * Manages LocalStorage operations for user profiles, session authentication,
 * tracker logs (water, fitness), favorites, recommendation history, and settings.
 */

const STORAGE_KEYS = {
    USERS: 'nr_users',
    CURRENT_USER: 'loggedInUser',
    WATER_LOG: 'nr_water_log',
    FITNESS_LOG: 'nr_fitness_log',
    MEAL_PLAN: 'nr_meal_plan',
    FAVORITES: 'nr_favorites',
    HISTORY: 'nr_history',
    THEME: 'nr_theme'
};

const StorageService = {
    init() {
        // Seed default demo user if no users exist
        const users = this.getUsers();
        if (users.length === 0) {
            const demoUser = {
                fullName: 'Demo User',
                email: 'demo@nutriroute.com',
                password: 'Demo@123',
                age: 26,
                gender: 'male',
                height: 172, // cm
                weight: 68,  // kg
                activityLevel: 'Moderately Active',
                dietaryPreference: 'Vegetarian',
                fitnessGoal: 'Healthy Lifestyle',
                allergies: [],
                dislikes: [],
                favoriteCuisine: 'South Indian',
                createdAt: new Date().toISOString()
            };
            this.saveUser(demoUser);
        }

        // Apply saved theme
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        this.setTheme(savedTheme);
    },

    // Users Database in LocalStorage
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveUser(user) {
        const users = this.getUsers();
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx >= 0) {
            users[existingIdx] = { ...users[existingIdx], ...user };
        } else {
            users.push(user);
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // If updating current user, sync session
        const current = this.getCurrentUser();
        if (current && current.email.toLowerCase() === user.email.toLowerCase()) {
            this.setCurrentUser(users[existingIdx >= 0 ? existingIdx : users.length - 1]);
        }
    },

    getUserByEmail(email) {
        if (!email) return null;
        const users = this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    // Active User Session
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
        } catch (e) {
            return null;
        }
    },

    setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } else {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // Favorites Management
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        } catch (e) {
            return [];
        }
    },

    isFavorite(foodId) {
        const favs = this.getFavorites();
        return favs.includes(foodId);
    },

    toggleFavorite(foodId) {
        let favs = this.getFavorites();
        if (favs.includes(foodId)) {
            favs = favs.filter(id => id !== foodId);
        } else {
            favs.push(foodId);
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        return favs.includes(foodId);
    },

    // Water Tracker Logs
    getTodayStr() {
        return new Date().toISOString().split('T')[0];
    },

    getWaterLogs() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.WATER_LOG)) || {};
        } catch (e) {
            return {};
        }
    },

    getTodayWater() {
        const logs = this.getWaterLogs();
        const today = this.getTodayStr();
        return logs[today] || 1.8; // Default 1.8L for demo
    },

    addWater(mlAmount) {
        const logs = this.getWaterLogs();
        const today = this.getTodayStr();
        const currentLiters = logs[today] || 1.8;
        const newLiters = Math.min(5.0, Math.max(0, parseFloat((currentLiters + mlAmount / 1000).toFixed(2))));
        logs[today] = newLiters;
        localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(logs));
        return newLiters;
    },

    resetWater() {
        const logs = this.getWaterLogs();
        const today = this.getTodayStr();
        logs[today] = 0;
        localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(logs));
        return 0;
    },

    // Fitness Logs
    getFitnessLogs() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.FITNESS_LOG)) || {
                steps: 6420,
                caloriesBurned: 380,
                activeMinutes: 45,
                sessions: 1
            };
        } catch (e) {
            return { steps: 6420, caloriesBurned: 380, activeMinutes: 45, sessions: 1 };
        }
    },

    saveFitnessLog(data) {
        localStorage.setItem(STORAGE_KEYS.FITNESS_LOG, JSON.stringify(data));
    },

    // History Log
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [
                { date: "27 Aug 2026", foodName: "Vegetable Upma", category: "Breakfast", matchScore: 94, reason: "Vegetarian + High Fiber Match" },
                { date: "26 Aug 2026", foodName: "Punjabi Rajma Chawal", category: "Lunch", matchScore: 91, reason: "Goal Match + Legume Protein" },
                { date: "25 Aug 2026", foodName: "Sprouted Moong Salad", category: "Snack", matchScore: 96, reason: "Low Fat + High Fiber Match" }
            ];
        } catch (e) {
            return [];
        }
    },

    addHistory(record) {
        const history = this.getHistory();
        history.unshift(record);
        if (history.length > 50) history.pop();
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    },

    // Theme Management
    getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    clearData() {
        const theme = this.getTheme();
        localStorage.clear();
        this.setTheme(theme);
        this.init();
    }
};

// Auto initialize storage service
StorageService.init();
