/**
 * NutriRoute Recommendation History Page Runtime
 * Displays recommendation logs from Express + Supabase API.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const authenticated = await AuthService.checkAuth();
    if (!authenticated) return;

    await loadHistory();
});

async function loadHistory() {
    const container = document.getElementById('history-table-body') || document.getElementById('history-list');
    if (!container) return;

    const res = await NutriCommon.apiFetch('/history');

    if (res.success && Array.isArray(res.history)) {
        renderHistory(res.history);
    } else {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted" style="padding:2rem;">
                    ${res.message || 'Failed to load recommendation history.'}
                </td>
            </tr>
        `;
    }
}

function renderHistory(historyList) {
    const container = document.getElementById('history-table-body') || document.getElementById('history-list');
    if (!container) return;

    if (historyList.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted" style="padding:3rem;">
                    <i class="fa-solid fa-clock-rotate-left" style="font-size:2.5rem; margin-bottom:0.75rem; opacity:0.4;"></i>
                    <p>No recommendation history available yet. Generate recommendations to view history!</p>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = historyList.map(item => {
        const food = item.food || {};
        return `
            <tr style="border-bottom:1px solid var(--border-color, #e5e7eb);">
                <td style="padding:1rem; font-size:0.875rem; color:var(--text-muted);">${item.date || 'Recently'}</td>
                <td style="padding:1rem; font-weight:600;">
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                        <img src="${food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}" alt="${food.name || ''}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
                        <span>${food.name || 'Food item'}</span>
                    </div>
                </td>
                <td style="padding:1rem;">
                    <span class="badge badge-success" style="font-weight:700;"><i class="fa-solid fa-sparkles"></i> ${item.score}%</span>
                </td>
                <td style="padding:1rem; font-size:0.85rem; color:var(--text-main);">${item.reason || ''}</td>
                <td style="padding:1rem; text-align:right;">
                    ${food.id ? `<a href="food-details.html?id=${food.id}" class="btn btn-outline btn-sm">View</a>` : ''}
                </td>
            </tr>
        `;
    }).join('');
}
