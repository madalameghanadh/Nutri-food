/**
 * NutriRoute Progress & Data Visualization Service
 * Renders SVG and CSS charts for Daily & Weekly health metrics.
 */

const ProgressService = {
    // Generate realistic 7-day weekly historical data based on current user stats
    getWeeklyData(user) {
        const energyNeeds = BMICalculator.calculateEnergyNeeds(user);
        const calTarget = energyNeeds.dailyCalories;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Historical variance factors
        const calVariances = [0.92, 0.98, 1.05, 0.88, 0.95, 1.10, 0.96];
        const waterVariances = [2.2, 2.5, 2.8, 2.0, 2.5, 2.7, 2.4];
        const stepVariances = [7200, 8500, 6400, 9100, 7800, 10200, 8000];
        const exerciseVariances = [30, 45, 60, 25, 40, 55, 50];

        return days.map((day, idx) => ({
            day,
            calories: Math.round(calTarget * calVariances[idx]),
            targetCalories: calTarget,
            water: waterVariances[idx],
            targetWater: 2.5,
            steps: stepVariances[idx],
            targetSteps: 8000,
            exercise: exerciseVariances[idx],
            targetExercise: 45
        }));
    },

    // Render SVG Bar Chart for Weekly Progress
    renderSVGBarChart(data, key, targetKey, unit, colorHex = '#10B981') {
        const width = 500;
        const height = 220;
        const padding = 35;
        const barWidth = 32;

        const maxVal = Math.max(...data.map(d => Math.max(d[key], d[targetKey]))) * 1.15;
        const chartHeight = height - padding * 2;

        let barsHTML = '';
        const numItems = data.length;
        const stepX = (width - padding * 2) / numItems;

        data.forEach((d, i) => {
            const val = d[key];
            const x = padding + i * stepX + (stepX - barWidth) / 2;
            const h = (val / maxVal) * chartHeight;
            const y = height - padding - h;

            // Target line indicator for each bar
            const targetY = height - padding - ((d[targetKey] / maxVal) * chartHeight);

            barsHTML += `
                <g class="chart-bar-group" data-tip="${d.day}: ${val} ${unit}">
                    <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="6" fill="${colorHex}" opacity="0.88">
                        <animate attributeName="height" from="0" to="${h}" dur="0.6s" fill="freeze"/>
                        <animate attributeName="y" from="${height - padding}" to="${y}" dur="0.6s" fill="freeze"/>
                    </rect>
                    <!-- Target marker -->
                    <line x1="${x - 4}" y1="${targetY}" x2="${x + barWidth + 4}" y2="${targetY}" stroke="#64748B" stroke-dasharray="3,3" stroke-width="2"/>
                    <!-- Value text -->
                    <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">${val}</text>
                    <!-- Day label -->
                    <text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" fill="#64748B" font-size="12" font-weight="500">${d.day}</text>
                </g>
            `;
        });

        return `
            <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto overflow-visible">
                <!-- Background Grid Lines -->
                <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="${padding}" y1="${padding + chartHeight/2}" x2="${width - padding}" y2="${padding + chartHeight/2}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4,4"/>
                <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#CBD5E1" stroke-width="1.5"/>
                ${barsHTML}
            </svg>
        `;
    }
};
