package com.nutriroute.app.models;

import java.io.Serializable;

public class WaterLog implements Serializable {
    private double currentLiters;
    private double targetLiters;
    private int percentage;

    public WaterLog() {
        this.currentLiters = 1.8;
        this.targetLiters = 2.5;
        this.percentage = 72;
    }

    public WaterLog(double currentLiters, double targetLiters) {
        this.currentLiters = currentLiters;
        this.targetLiters = targetLiters;
        this.percentage = (int) Math.round((currentLiters / targetLiters) * 100);
    }

    public double getCurrentLiters() { return currentLiters; }
    public void setCurrentLiters(double currentLiters) { this.currentLiters = currentLiters; }

    public double getTargetLiters() { return targetLiters; }
    public void setTargetLiters(double targetLiters) { this.targetLiters = targetLiters; }

    public int getPercentage() {
        return (int) Math.min(100, Math.round((currentLiters / targetLiters) * 100));
    }
}
