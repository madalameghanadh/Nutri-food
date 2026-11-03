/**
 * NutriRoute Favorites Page Runtime
 * Displays and manages user's saved favorite foods from Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadFavorites();
});

async function loadFavorites() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size:2.5rem; color:var(--primary); margin-bottom:1rem;"></i>
            <p>Loading your favorite foods...</p>
        </div>
    `;

    const res = await NutriCommon.apiFetch('/favorites');

    if (res.success && Array.isArray(res.favorites)) {
        renderFavorites(res.favorites);
    } else {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:3rem;" class="card">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem; color:var(--warning); margin-bottom:1rem;"></i>
                <p>${res.message || 'Failed to load favorite foods.'}</p>
            </div>
        `;
    }
}

function renderFavorites(favoritesList) {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    if (favoritesList.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:3.5rem;" class="card">
                <i class="fa-solid fa-heart-crack" style="font-size:3rem; color:var(--text-muted); margin-bottom:1rem; opacity:0.6;"></i>
                <h3>No Favorite Foods Saved Yet</h3>
                <p style="color:var(--text-muted); margin-bottom:1.5rem;">Explore AI recommendations and click the heart icon to save your top foods!</p>
                <a href="recommendations.html" class="btn btn-primary"><i class="fa-solid fa-wand-magic-sparkles"></i> Browse Recommendations</a>
            </div>
        `;
        return;
    }

    container.innerHTML = favoritesList.map(fav => {
        const food = fav.food;
        if (!food) return '';

        return `
            <div class="card food-card" style="display:flex; flex-direction:column; overflow:hidden; padding:0;">
                <div style="position:relative; height:170px;">
                    <img src="${food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}" alt="${food.name}" style="width:100%; height:100%; object-fit:cover;">
                    <span class="badge badge-secondary" style="position:absolute; top:12px; left:12px; text-transform:capitalize;">
                        ${food.category || 'Food'}
                    </span>
                    <button onclick="removeFavorite('${food.id}')" style="position:absolute; top:12px; right:12px; background:rgba(239,68,68,0.9); color:#fff; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer;" title="Remove from Favorites">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column;">
                    <h3 style="font-size:1.05rem; margin-bottom:0.4rem;">${food.name}</h3>
                    <p style="font-size:0.825rem; color:var(--text-muted); margin-bottom:1rem; flex:1;">${food.description || ''}</p>
                    
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.4rem; background:var(--bg-input, #f3f4f6); padding:0.6rem; border-radius:8px; text-align:center; font-size:0.75rem; font-weight:600; margin-bottom:1rem;">
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">CALORIES</span> ${food.calories}</div>
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">PROTEIN</span> ${food.protein}g</div>
                        <div><span style="color:var(--text-muted); display:block; font-size:0.65rem;">FIBER</span> ${food.fiber || 0}g</div>
                    </div>

                    <a href="food-details.html?id=${food.id}" class="btn btn-outline btn-sm" style="text-align:center; width:100%;">
                        <i class="fa-solid fa-info-circle"></i> View Details
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

async function removeFavorite(foodId) {
    const res = await NutriCommon.apiFetch(`/favorites/${foodId}`, { method: 'DELETE' });
    if (res.success) {
        NutriCommon.showToast('Removed from favorites.', 'info');
        await loadFavorites();
    } else {
        NutriCommon.showToast(res.message || 'Failed to remove favorite.', 'danger');
    }
}
