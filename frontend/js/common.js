/**
 * NutriRoute Frontend Common Utilities & API Fetch Wrapper
 */

const API_BASE = '/api';

const NutriCommon = {
    // Get stored Supabase Access Token
    getToken() {
        return localStorage.getItem('sb_access_token');
    },

    // Set Supabase Access Token
    setToken(token) {
        if (token) {
            localStorage.setItem('sb_access_token', token);
        } else {
            localStorage.removeItem('sb_access_token');
        }
    },

    // Global fetch API wrapper with automatic Auth header
    async apiFetch(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json().catch(() => ({}));

            if (response.status === 401) {
                // Token expired or unauthorized -> logout and redirect
                this.setToken(null);
                const currentPath = window.location.pathname.split('/').pop();
                if (currentPath !== 'login.html' && currentPath !== 'register.html' && currentPath !== 'index.html' && currentPath !== '') {
                    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
                }
                return { success: false, message: data.message || 'Unauthorized session.' };
            }

            return data;
        } catch (err) {
            console.error('API Fetch Error:', err);
            return {
                success: false,
                message: 'Network error or server unavailable. Please try again.'
            };
        }
    },

    // Toast notification UI
    showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                bottom: 1.5rem;
                right: 1.5rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const bgColors = {
            success: 'var(--primary, #10b981)',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const icons = {
            success: 'fa-circle-check',
            danger: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${bgColors[type] || bgColors.success};
            color: #ffffff;
            padding: 0.85rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            min-width: 250px;
            max-width: 380px;
            pointer-events: auto;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // Remove after 3.5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    // Loading state helper for form submit buttons
    setLoading(buttonEl, isLoading, loadingText = 'Processing...') {
        if (!buttonEl) return;
        if (isLoading) {
            buttonEl.dataset.originalHtml = buttonEl.innerHTML;
            buttonEl.disabled = true;
            buttonEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
        } else {
            buttonEl.disabled = false;
            if (buttonEl.dataset.originalHtml) {
                buttonEl.innerHTML = buttonEl.dataset.originalHtml;
            }
        }
    },

    _lastSidebarToggle: 0,

    // Mobile sidebar drawer controllers
    toggleSidebar(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const now = Date.now();
        if (now - NutriCommon._lastSidebarToggle < 400) {
            return; // Ignore duplicate rapid/synthetic events
        }
        NutriCommon._lastSidebarToggle = now;

        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        let backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => NutriCommon.closeSidebar());
            backdrop.addEventListener('touchend', () => NutriCommon.closeSidebar());
        }

        const isOpen = sidebar.classList.contains('show') || sidebar.classList.contains('open');
        if (isOpen) {
            NutriCommon.closeSidebar();
        } else {
            NutriCommon.openSidebar();
        }
    },

    openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        let backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => NutriCommon.closeSidebar());
            backdrop.addEventListener('touchend', () => NutriCommon.closeSidebar());
        }
        if (sidebar) {
            sidebar.classList.add('show', 'open');
            sidebar.style.setProperty('transform', 'translateX(0)', 'important');
            sidebar.style.setProperty('display', 'flex', 'important');
            sidebar.style.setProperty('visibility', 'visible', 'important');
        }
        if (backdrop) {
            backdrop.classList.add('active');
            backdrop.style.setProperty('opacity', '1', 'important');
            backdrop.style.setProperty('visibility', 'visible', 'important');
            backdrop.style.setProperty('pointer-events', 'auto', 'important');
        }
        document.body.classList.add('sidebar-open');
    },

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebar) {
            sidebar.classList.remove('show', 'open');
            if (window.innerWidth <= 992) {
                sidebar.style.setProperty('transform', 'translateX(-100%)', 'important');
            }
        }
        if (backdrop) {
            backdrop.classList.remove('active');
            backdrop.style.setProperty('opacity', '0', 'important');
            backdrop.style.setProperty('visibility', 'hidden', 'important');
            backdrop.style.setProperty('pointer-events', 'none', 'important');
        }
        document.body.classList.remove('sidebar-open');
    },

    // Initialize layout scripts (sidebar active link, theme toggle, mobile drawer)
    initLayout() {
        // Highlight active link in sidebar
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Ensure backdrop exists
        let backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => NutriCommon.closeSidebar());
            backdrop.addEventListener('touchend', () => NutriCommon.closeSidebar());
        }

        // Attach to all toggle buttons (single listener with debouncing)
        const toggleBtns = document.querySelectorAll('.sidebar-toggle');
        toggleBtns.forEach(btn => {
            btn.onclick = (e) => NutriCommon.toggleSidebar(e);
        });

        // Close drawer when clicking any sidebar link on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 992) {
                        NutriCommon.closeSidebar();
                    }
                });
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') NutriCommon.closeSidebar();
        });
    }
};

// Global convenience bindings
window.toggleSidebar = (e) => NutriCommon.toggleSidebar(e);
window.closeSidebar = () => NutriCommon.closeSidebar();

// Execute immediately if DOM already loaded, or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NutriCommon.initLayout();
    });
} else {
    NutriCommon.initLayout();
}
