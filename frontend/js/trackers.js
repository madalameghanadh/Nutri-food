/**
 * NutriRoute Trackers Logic
 * Handles Calorie, Water, Fitness, and Nutrition metrics.
 */

const TrackerService = {
    // Water Intake Logic
    addWater(amountL) {
        const log = StorageService.getWaterLog();
        log.consumed = parseFloat((log.consumed + amountL).toFixed(2));
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        log.logs.unshift({ time: timeStr, amount: amountL });
        StorageService.saveWaterLog(log);
        return log;
    },

    setWaterTarget(targetL) {
        const log = StorageService.getWaterLog();
        log.target = targetL;
        StorageService.saveWaterLog(log);
        return log;
    },

    resetWater() {
        const log = {
            date: StorageService.getTodayStr(),
            consumed: 0,
            target: 2.5,
            logs: []
        };
        StorageService.saveWaterLog(log);
        return log;
    },

    // Fitness Log Logic
    updateFitness(data) {
        const log = StorageService.getFitnessLog();
        if (data.steps !== undefined) log.steps = Math.max(0, parseInt(data.steps, 10));
        if (data.exerciseMinutes !== undefined) log.exerciseMinutes = Math.max(0, parseInt(data.exerciseMinutes, 10));
        if (data.caloriesBurned !== undefined) log.caloriesBurned = Math.max(0, parseInt(data.caloriesBurned, 10));
        if (data.sleepHours !== undefined) log.sleepHours = Math.max(0, parseFloat(data.sleepHours));
        
        StorageService.saveFitnessLog(log);
        return log;
    },

    addSteps(count) {
        const log = StorageService.getFitnessLog();
        log.steps += count;
        // Approximate calories burned (40 kcal per 1000 steps)
        log.caloriesBurned += Math.round((count / 1000) * 40);
        StorageService.saveFitnessLog(log);
        return log;
    }
};
