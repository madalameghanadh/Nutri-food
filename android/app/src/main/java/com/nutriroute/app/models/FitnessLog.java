package com.nutriroute.app.models;

import java.io.Serializable;

public class FitnessLog implements Serializable {
    private int steps;
    private int caloriesBurned;
    private int activeMinutes;
    private int sessions;

    public FitnessLog() {
        this.steps = 6420;
        this.caloriesBurned = 380;
        this.activeMinutes = 45;
        this.sessions = 1;
    }

    public FitnessLog(int steps, int caloriesBurned, int activeMinutes, int sessions) {
        this.steps = steps;
        this.caloriesBurned = caloriesBurned;
        this.activeMinutes = activeMinutes;
        this.sessions = sessions;
    }

    public int getSteps() { return steps; }
    public void setSteps(int steps) { this.steps = steps; }

    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public int getActiveMinutes() { return activeMinutes; }
    public void setActiveMinutes(int activeMinutes) { this.activeMinutes = activeMinutes; }

    public int getSessions() { return sessions; }
    public void setSessions(int sessions) { this.sessions = sessions; }
}
