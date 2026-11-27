/**
 * NutriRoute Global Application Runtime (js/app.js)
 * Manages UI interactivity, navigation highlights, chatbot interactions,
 * notification popups, search, theme toggles, and shared component rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    NutriApp.init();
});

const NutriApp = {
    init() {
        this.highlightActiveNav();
        this.setupSidebarToggle();
        this.setupThemeToggle();
        this.setupNotifications();
        this.setupGlobalSearch();
        this.setupChatbot();
        this.renderUserAvatar();
    },

    // 1. Highlight Active Sidebar Nav Link
    highlightActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // 2. Sidebar Mobile Drawer Toggle
    setupSidebarToggle() {
        // Delegated to NutriCommon in common.js to avoid duplicate event dispatch
        const toggleBtn = document.querySelector('.sidebar-toggle');
        if (toggleBtn && typeof NutriCommon !== 'undefined') {
            toggleBtn.onclick = (e) => NutriCommon.toggleSidebar(e);
        }
    },

    // 3. Theme Toggle Switcher
    setupThemeToggle() {
        const themeBtns = document.querySelectorAll('.theme-toggle-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const current = StorageService.getTheme();
                const next = current === 'dark' ? 'light' : 'dark';
                StorageService.setTheme(next);
                this.showToast(`Switched to ${next} theme`, 'info');
            });
        });
    },

    // 4. Notification Dropdown Toggle
    setupNotifications() {
        const notifBtn = document.querySelector('.notif-btn');
        const notifDropdown = document.querySelector('.notif-dropdown');
        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifDropdown.classList.toggle('show');
            });
            document.addEventListener('click', () => {
                notifDropdown.classList.remove('show');
            });
        }
    },

    // 5. Global Search Modal
    setupGlobalSearch() {
        const searchInput = document.getElementById('global-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 1) {
                const results = NUTRIRoute_FOODS.filter(f => 
                    f.name.toLowerCase().includes(query) ||
                    f.category.toLowerCase().includes(query) ||
                    f.cuisine.toLowerCase().includes(query) ||
                    f.diet.toLowerCase().includes(query)
                );
                this.displaySearchResults(results);
            } else {
                this.hideSearchResults();
            }
        });
    },

    displaySearchResults(results) {
        let container = document.getElementById('search-results-dropdown');
        if (!container) {
            container = document.createElement('div');
            container.id = 'search-results-dropdown';
            container.className = 'search-dropdown-menu';
            const searchBox = document.querySelector('.topbar-search');
            if (searchBox) searchBox.appendChild(container);
        }

        if (results.length === 0) {
            container.innerHTML = `<div class="p-3 text-muted text-center" style="font-size:0.85rem;">No matching foods found</div>`;
        } else {
            container.innerHTML = results.slice(0, 6).map(f => `
                <a href="food-details.html?id=${f.id}" class="search-result-item" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 1rem; border-bottom:1px solid var(--border-color); color:var(--text-main);">
                    <img src="${f.image}" style="width:36px; height:36px; border-radius:6px; object-fit:cover;">
                    <div>
                        <div style="font-weight:600; font-size:0.85rem;">${f.name}</div>
                        <div style="font-size:0.725rem; color:var(--text-muted);">${f.category} • ${f.calories} kcal</div>
                    </div>
                </a>
            `).join('');
        }
        container.style.display = 'block';
    },

    hideSearchResults() {
        const container = document.getElementById('search-results-dropdown');
        if (container) container.style.display = 'none';
    },

    // 6. NutriAI Chatbot Floating Assistant
    setupChatbot() {
        const chatBtn = document.querySelector('.chat-widget-btn');
        const chatWindow = document.querySelector('.chat-window');
        const closeBtn = document.querySelector('.chat-close-btn');
        const sendBtn = document.querySelector('.chat-send-btn');
        const chatInput = document.getElementById('chat-input');
        const messagesBox = document.querySelector('.chat-messages');

        if (chatBtn && chatWindow) {
            chatBtn.addEventListener('click', () => {
                chatWindow.classList.toggle('open');
            });
            if (closeBtn) {
                closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
            }
        }

        if (sendBtn && chatInput && messagesBox) {
            const handleSend = () => {
                const text = chatInput.value.trim();
                if (!text) return;
                this.addChatMessage(text, 'user');
                chatInput.value = '';
                
                // Simulate AI response delay
                setTimeout(() => {
                    const response = this.generateBotResponse(text);
                    this.addChatMessage(response, 'bot');
                }, 600);
            };

            sendBtn.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });

            // Quick Question Chips
            document.querySelectorAll('.chip-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const q = btn.textContent.trim();
                    this.addChatMessage(q, 'user');
                    setTimeout(() => {
                        const response = this.generateBotResponse(q);
                        this.addChatMessage(response, 'bot');
                    }, 500);
                });
            });
        }
    },

    addChatMessage(msg, sender) {
        const box = document.querySelector('.chat-messages');
        if (!box) return;
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        div.innerHTML = msg;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    },

    generateBotResponse(userMsg) {
        const msg = userMsg.toLowerCase();
        const user = StorageService.getCurrentUser();
        const userDiet = user ? user.dietaryPreference : 'Vegetarian';

        if (msg.includes('breakfast')) {
            return `For breakfast, I recommend <strong>Steamed Idli with Sambar</strong> (220 kcal) or <strong>Vegetable Oats Upma</strong> (210 kcal) for high fiber and easy digestion!`;
        } else if (msg.includes('high-protein') || msg.includes('protein')) {
            return `Top high-protein picks: <strong>Herbed Grilled Chicken Bowl</strong> (38g protein), <strong>Paneer Tikka Protein Bowl</strong> (22g protein), or <strong>Sprouted Moong Salad</strong> (10g protein).`;
        } else if (msg.includes('south indian')) {
            return `Recommended South Indian options: <strong>Ragi Dosa</strong>, <strong>Ven Pongal</strong>, <strong>Lemon Rice</strong>, and <strong>Soothing Curd Rice</strong>!`;
        } else if (msg.includes('vegetarian')) {
            return `We have 35+ delicious vegetarian options like <strong>Punjabi Rajma Chawal</strong>, <strong>Palak Paneer</strong>, and <strong>Millet Power Bowl</strong>.`;
        } else if (msg.includes('recommended') || msg.includes('my foods')) {
            return `Based on your ${userDiet} profile and ${user?.fitnessGoal || 'wellness'} goals, your top AI match is <strong>Steamed Idli with Sambar</strong> (94% AI match)!`;
        } else {
            return `NutriAI is here to help! Try asking: <em>"What should I eat for breakfast?"</em> or <em>"Show high-protein foods"</em>.`;
        }
    },

    // 7. Render User Avatar in Topbar
    renderUserAvatar() {
        const user = StorageService.getCurrentUser();
        const userNameEls = document.querySelectorAll('.current-user-name');
        const userAvatarEls = document.querySelectorAll('.current-user-avatar');

        if (user) {
            userNameEls.forEach(el => el.textContent = user.fullName || 'User');
            userAvatarEls.forEach(el => {
                const initials = (user.fullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                el.textContent = initials;
            });
        }
    },

    // 8. Toast Notification System
    showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icon = type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle';
        const color = type === 'success' ? '#10B981' : type === 'danger' ? '#EF4444' : '#0EA5E9';

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderLeftColor = color;
        toast.innerHTML = `<i class="fa-solid ${icon}" style="color:${color}; font-size:1.1rem;"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // 9. Reusable Food Card Generator
    createFoodCardHTML(item) {
        const food = item.food || item;
        const matchScore = item.matchScore !== undefined ? item.matchScore : 90;
        const isFav = StorageService.isFavorite(food.id);
        const reasons = item.whyRecommended || ['Nutritious balanced meal'];

        return `
        <div class="food-card" data-id="${food.id}">
            <div class="food-img-wrapper">
                <img src="${food.image}" alt="${food.name}" loading="lazy">
                <div class="ai-match-badge"><i class="fa-solid fa-sparkles"></i> ${matchScore}% AI Match</div>
                <button class="food-fav-btn ${isFav ? 'active' : ''}" onclick="NutriApp.handleToggleFav('${food.id}', this)" title="Add to Favorites">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="food-card-body">
                <h3 class="food-card-title">${food.name}</h3>
                <div class="food-tags">
                    <span class="badge badge-primary">${food.diet}</span>
                    <span class="badge badge-secondary">${food.cuisine}</span>
                    <span class="badge badge-outline">${food.category}</span>
                </div>
                <div class="macro-badges">
                    <div class="macro-item"><span class="macro-val">${food.calories}</span><span class="macro-lbl">kcal</span></div>
                    <div class="macro-item"><span class="macro-val">${food.protein}g</span><span class="macro-lbl">Protein</span></div>
                    <div class="macro-item"><span class="macro-val">${food.carbs}g</span><span class="macro-lbl">Carbs</span></div>
                    <div class="macro-item"><span class="macro-val">${food.fat}g</span><span class="macro-lbl">Fat</span></div>
                </div>
                <div class="ai-reason-box">
                    <strong><i class="fa-solid fa-brain"></i> Why this food?</strong>
                    <ul>
                        ${reasons.slice(0, 2).map(r => `<li><i class="fa-solid fa-check"></i> ${r}</li>`).join('')}
                    </ul>
                </div>
                <div style="margin-top:auto; display:flex; gap:0.5rem;">
                    <a href="food-details.html?id=${food.id}" class="btn btn-outline btn-sm" style="flex:1;"><i class="fa-solid fa-circle-info"></i> Details</a>
                </div>
            </div>
        </div>
        `;
    },

    handleToggleFav(foodId, btn) {
        const isFavNow = StorageService.toggleFavorite(foodId);
        btn.classList.toggle('active', isFavNow);
        const icon = btn.querySelector('i');
        icon.className = `fa-${isFavNow ? 'solid' : 'regular'} fa-heart`;
        this.showToast(isFavNow ? 'Saved to Favorites' : 'Removed from Favorites', isFavNow ? 'success' : 'info');
    }
};
