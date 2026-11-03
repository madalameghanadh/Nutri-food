package com.nutriroute.app.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class User implements Serializable {
    private String fullName;
    private String email;
    private String password;
    private int age;
    private String gender;
    private double height; // cm
    private double weight; // kg
    private String activityLevel;
    private String dietaryPreference;
    private String fitnessGoal;
    private String favoriteCuisine;
    private List<String> allergies;
    private List<String> dislikes;

    public User() {
        this.allergies = new ArrayList<>();
        this.dislikes = new ArrayList<>();
    }

    public User(String fullName, String email, String password, int age, String gender, double height, double weight, String activityLevel, String dietaryPreference, String fitnessGoal, String favoriteCuisine) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.activityLevel = activityLevel;
        this.dietaryPreference = dietaryPreference;
        this.fitnessGoal = fitnessGoal;
        this.favoriteCuisine = favoriteCuisine;
        this.allergies = new ArrayList<>();
        this.dislikes = new ArrayList<>();
    }

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public String getFavoriteCuisine() { return favoriteCuisine; }
    public void setFavoriteCuisine(String favoriteCuisine) { this.favoriteCuisine = favoriteCuisine; }

    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }

    public List<String> getDislikes() { return dislikes; }
    public void setDislikes(List<String> dislikes) { this.dislikes = dislikes; }

    public double getBmi() {
        if (height <= 0) return 0;
        double hMeters = height / 100.0;
        return Math.round((weight / (hMeters * hMeters)) * 10.0) / 10.0;
    }
}
