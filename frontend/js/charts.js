/**
 * NutriRoute Chart.js Visualizations
 * Renders macro doughnut, nutrition bar chart, weekly trends, and hydration bar graphs.
 */

const ChartManager = {
    instances: {},

    // Destroy existing chart on canvas if re-rendering
    destroyChart(id) {
        if (this.instances[id]) {
            this.instances[id].destroy();
            delete this.instances[id];
        }
    },

    // 1. Dashboard Macro Doughnut Chart
    renderMacroDoughnut(canvasId, protein = 85, carbs = 210, fat = 55) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        this.destroyChart(canvasId);

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#F8FAFC' : '#0F172A';

        this.instances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Protein (g)', 'Carbohydrates (g)', 'Fats (g)'],
                datasets: [{
                    data: [protein, carbs, fat],
                    backgroundColor: ['#10B981', '#0EA5E9', '#F59E0B'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: { family: 'Poppins', size: 12, weight: '500' },
                            padding: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}g`;
                            }
                        }
                    }
                },
                cutout: '72%'
            }
        });
    },

    // 2. Nutrition Breakdown Bar Chart
    renderNutritionBar(canvasId, cal = 1850, protein = 85, carbs = 210, fat = 55, fiber = 32) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        this.destroyChart(canvasId);

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#94A3B8' : '#64748B';

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)'],
                datasets: [{
                    label: 'Daily Intake vs Target',
                    data: [cal, protein, carbs, fat, fiber],
                    backgroundColor: ['#10B981', '#0EA5E9', '#3B82F6', '#F59E0B', '#8B5CF6'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Poppins' } }
                    },
                    y: {
                        grid: { color: isDark ? '#1E293B' : '#E2E8F0' },
                        ticks: { color: textColor, font: { family: 'Poppins' } }
                    }
                }
            }
        });
    },

    // 3. Weekly Nutrition Line Trend Chart
    renderWeeklyTrend(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        this.destroyChart(canvasId);

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#94A3B8' : '#64748B';

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Calories (kcal)',
                        data: [1750, 1820, 1900, 1850, 1920, 2050, 1850],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 3
                    },
                    {
                        label: 'Protein (g)',
                        data: [72, 80, 85, 82, 88, 92, 85],
                        borderColor: '#0EA5E9',
                        backgroundColor: 'transparent',
                        tension: 0.35,
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: textColor, font: { family: 'Poppins' } }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: isDark ? '#1E293B' : '#E2E8F0' },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    },

    // 4. Hydration Weekly History Bar Chart
    renderHydrationChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        this.destroyChart(canvasId);

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#94A3B8' : '#64748B';

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Water Intake (Liters)',
                    data: [2.2, 2.5, 1.8, 2.4, 2.0, 2.6, 1.8],
                    backgroundColor: '#0EA5E9',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: textColor } },
                    y: {
                        grid: { color: isDark ? '#1E293B' : '#E2E8F0' },
                        ticks: { color: textColor },
                        suggestedMax: 3.0
                    }
                }
            }
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChartManager };
}
