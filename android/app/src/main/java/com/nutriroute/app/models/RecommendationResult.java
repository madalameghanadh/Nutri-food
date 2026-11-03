package com.nutriroute.app.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class RecommendationResult implements Serializable {
    private Food food;
    private int matchScore;
    private List<String> whyRecommended;
    private String warning;

    public RecommendationResult() {
        this.whyRecommended = new ArrayList<>();
    }

    public RecommendationResult(Food food, int matchScore, List<String> whyRecommended, String warning) {
        this.food = food;
        this.matchScore = matchScore;
        this.whyRecommended = whyRecommended;
        this.warning = warning;
    }

    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public List<String> getWhyRecommended() { return whyRecommended; }
    public void setWhyRecommended(List<String> whyRecommended) { this.whyRecommended = whyRecommended; }

    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
}
