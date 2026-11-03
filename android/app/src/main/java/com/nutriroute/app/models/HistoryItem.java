package com.nutriroute.app.models;

import java.io.Serializable;

public class HistoryItem implements Serializable {
    private String date;
    private String foodName;
    private String category;
    private int matchScore;
    private String reason;

    public HistoryItem() {}

    public HistoryItem(String date, String foodName, String category, int matchScore, String reason) {
        this.date = date;
        this.foodName = foodName;
        this.category = category;
        this.matchScore = matchScore;
        this.reason = reason;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
