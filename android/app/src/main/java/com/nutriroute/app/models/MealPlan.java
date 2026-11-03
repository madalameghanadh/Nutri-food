package com.nutriroute.app.models;

import java.io.Serializable;

public class MealPlan implements Serializable {
    private Food breakfast;
    private Food morningSnack;
    private Food lunch;
    private Food eveningSnack;
    private Food dinner;

    public MealPlan() {}

    public Food getBreakfast() { return breakfast; }
    public void setBreakfast(Food breakfast) { this.breakfast = breakfast; }

    public Food getMorningSnack() { return morningSnack; }
    public void setMorningSnack(Food morningSnack) { this.morningSnack = morningSnack; }

    public Food getLunch() { return lunch; }
    public void setLunch(Food lunch) { this.lunch = lunch; }

    public Food getEveningSnack() { return eveningSnack; }
    public void setEveningSnack(Food eveningSnack) { this.eveningSnack = eveningSnack; }

    public Food getDinner() { return dinner; }
    public void setDinner(Food dinner) { this.dinner = dinner; }

    public int getTotalCalories() {
        return (breakfast != null ? breakfast.getCalories() : 0) +
               (morningSnack != null ? morningSnack.getCalories() : 0) +
               (lunch != null ? lunch.getCalories() : 0) +
               (eveningSnack != null ? eveningSnack.getCalories() : 0) +
               (dinner != null ? dinner.getCalories() : 0);
    }

    public int getTotalProtein() {
        return (breakfast != null ? breakfast.getProtein() : 0) +
               (morningSnack != null ? morningSnack.getProtein() : 0) +
               (lunch != null ? lunch.getProtein() : 0) +
               (eveningSnack != null ? eveningSnack.getProtein() : 0) +
               (dinner != null ? dinner.getProtein() : 0);
    }

    public int getTotalCarbs() {
        return (breakfast != null ? breakfast.getCarbs() : 0) +
               (morningSnack != null ? morningSnack.getCarbs() : 0) +
               (lunch != null ? lunch.getCarbs() : 0) +
               (eveningSnack != null ? eveningSnack.getCarbs() : 0) +
               (dinner != null ? dinner.getCarbs() : 0);
    }

    public int getTotalFat() {
        return (breakfast != null ? breakfast.getFat() : 0) +
               (morningSnack != null ? morningSnack.getFat() : 0) +
               (lunch != null ? lunch.getFat() : 0) +
               (eveningSnack != null ? eveningSnack.getFat() : 0) +
               (dinner != null ? dinner.getFat() : 0);
    }

    public int getTotalFiber() {
        return (breakfast != null ? breakfast.getFiber() : 0) +
               (morningSnack != null ? morningSnack.getFiber() : 0) +
               (lunch != null ? lunch.getFiber() : 0) +
               (eveningSnack != null ? eveningSnack.getFiber() : 0) +
               (dinner != null ? dinner.getFiber() : 0);
    }
}
