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

        const toast = document.createElement('div');
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

        // Mobile sidebar toggle button & backdrop
        const toggleBtn = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (toggleBtn && sidebar) {
            // Create or reuse backdrop overlay
            let backdrop = document.querySelector('.sidebar-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'sidebar-backdrop';
                document.body.appendChild(backdrop);
            }

            const openDrawer = () => {
                sidebar.classList.add('show', 'open');
                backdrop.classList.add('active');
            };

            const closeDrawer = () => {
                sidebar.classList.remove('show', 'open');
                backdrop.classList.remove('active');
            };

            const toggleDrawer = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (sidebar.classList.contains('show') || sidebar.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            };

            toggleBtn.addEventListener('click', toggleDrawer);
            backdrop.addEventListener('click', closeDrawer);

            // Close drawer when clicking any sidebar link on mobile
            sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 992) {
                        closeDrawer();
                    }
                });
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeDrawer();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    NutriCommon.initLayout();
});
