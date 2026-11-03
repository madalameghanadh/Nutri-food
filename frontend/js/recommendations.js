/**
 * NutriRoute Recommendations Page Runtime
 * Fetches and filters personalized food recommendations from Express + Supabase API.
 */

let allRecommendations = [];
let currentCategoryFilter = 'All';
let currentDietFilter = 'All';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    setupFilterListeners();
    await loadRecommendations();
});

async function loadRecommendations() {
    const container = document.getElementById('recommendations-grid');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:3rem;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:2.5rem; color:var(--primary); margin-bottom:1rem;"></i>
                <p style="font-weight:500;">Analyzing your health profile & generating recommendations...</p>
            </div>
        `;
    }

    const res = await NutriCommon.apiFetch('/recommendations/generate', { method: 'POST' });

    if (res.success && Array.isArray(res.recommendations)) {
        allRecommendations = res.recommendations;
        renderRecommendations();
    } else {
        // Fallback fetch
        const getRes = await NutriCommon.apiFetch('/recommendations');
        if (getRes.success && Array.isArray(getRes.recommendations)) {
            allRecommendations = getRes.recommendations;
            renderRecommendations();
        } else if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:3rem;" class="card">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem; color:var(--warning); margin-bottom:1rem;"></i>
                    <p>${res.message || 'Failed to load recommendations.'}</p>
                    <button onclick="loadRecommendations()" class="btn btn-primary" style="margin-top:1rem;">Retry</button>
                </div>
            `;
        }
    }
}

function filterRecommendations() {
    return allRecommendations.filter(item => {
        const food = item.food;

        // Category check
        if (currentCategoryFilter !== 'All' && food.category !== currentCategoryFilter) {
            return false;
        }

        // Diet check
        if (currentDietFilter !== 'All') {
            const foodDiet = (food.diet_type || food.diet || '').toLowerCase();
            if (!foodDiet.includes(currentDietFilter.toLowerCase())) {
                return false;
            }
        }

        // Search query check
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const nameMatch = food.name.toLowerCase().includes(q);
            const descMatch = (food.description || '').toLowerCase().includes(q);
            const tagMatch = Array.isArray(food.tags) && food.tags.some(t => t.toLowerCase().includes(q));
            if (!nameMatch && !descMatch && !tagMatch) return false;
        }

        return true;
    });
}

function renderRecommendations() {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    const filtered = filterRecommendations();

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:3rem;" class="card">
                <i class="fa-solid fa-filter-circle-xmark" style="font-size:2.5rem; color:var(--text-muted); margin-bottom:1rem;"></i>
                <h3>No Matching Foods Found</h3>
                <p style="color:var(--text-muted);">Try adjusting your category, diet preference, or search filter.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const food = item.food;
        const score = item.score || 50;

        return `
            <div class="card food-card" style="display:flex; flex-direction:column; overflow:hidden; padding:0;">
                <div style="position:relative; height:180px;">
                    <img src="${food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}" alt="${food.name}" style="width:100%; height:100%; object-fit:cover;">
                    <span class="badge badge-success" style="position:absolute; top:12px; right:12px; font-weight:700; box-shadow:0 4px 6px rgba(0,0,0,0.15);">
                        <i class="fa-solid fa-sparkles"></i> ${score}% Match
                    </span>
                    <span class="badge badge-secondary" style="position:absolute; top:12px; left:12px; text-transform:capitalize;">
                        ${food.category || 'Food'}
                    </span>
                </div>
                <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column;">
                    <h3 style="font-size:1.1rem; margin-bottom:0.4rem;">${food.name}</h3>
                    <p style="font-size:0.825rem; color:var(--text-muted); margin-bottom:1rem; flex:1;">${item.reason || food.description || ''}</p>
                    
                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.4rem; background:var(--bg-input, #f3f4f6); padding:0.6rem; border-radius:8px; text-align:center; font-size:0.75rem; font-weight:600; margin-bottom:1rem;">
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">CALORIES</span> ${food.calories}</div>
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">PROTEIN</span> ${food.protein}g</div>
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">CARBS</span> ${food.carbohydrates || food.carbs || 0}g</div>
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">FAT</span> ${food.fat}g</div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                        <span style="font-size:1.15rem; font-weight:700; color:var(--primary);">₹${food.price || 150}</span>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${food.serving_size || '1 serving'}</span>
                    </div>

                    <div style="display:flex; gap:0.5rem;">
                        <button onclick="handleAddToCart('${food.id}')" class="btn btn-primary btn-sm" style="flex:1; text-align:center;">
                            <i class="fa-solid fa-cart-plus"></i> Order / Add
                        </button>
                        <a href="food-details.html?id=${food.id}" class="btn btn-outline btn-sm" title="View Details">
                            <i class="fa-solid fa-info-circle"></i>
                        </a>
                        <button onclick="toggleFavorite('${food.id}', this)" class="btn btn-secondary btn-sm" title="Add Favorite">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleAddToCart(foodId) {
    const item = allRecommendations.find(r => r.food && r.food.id === foodId);
    if (item && item.food) {
        CartService.addItem(item.food, 1);
    }
}

function setupFilterListeners() {
    // Search bar
    const searchInput = document.getElementById('rec-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderRecommendations();
        });
    }

    // Category Buttons
    const catChips = document.querySelectorAll('.category-chip');
    catChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            catChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategoryFilter = chip.dataset.category || 'All';
            renderRecommendations();
        });
    });

    // Diet Filter Select
    const dietSelect = document.getElementById('rec-diet-filter');
    if (dietSelect) {
        dietSelect.addEventListener('change', (e) => {
            currentDietFilter = e.target.value;
            renderRecommendations();
        });
    }
}

async function toggleFavorite(foodId, btnEl) {
    NutriCommon.setLoading(btnEl, true, '');
    const res = await NutriCommon.apiFetch(`/favorites/${foodId}`, { method: 'POST' });
    NutriCommon.setLoading(btnEl, false);

    if (res.success) {
        NutriCommon.showToast(res.message || 'Added to favorites!', 'success');
        if (btnEl) btnEl.style.color = '#ef4444';
    } else {
        NutriCommon.showToast(res.message || 'Could not add favorite.', 'danger');
    }
}
