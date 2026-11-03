package com.nutriroute.app.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Food implements Serializable {
    private String id;
    private String name;
    private String category;
    private String cuisine;
    private String diet;
    private int calories;
    private int protein;
    private int carbs;
    private int fat;
    private int fiber;
    private int sugar;
    private int sodium;
    private List<String> tags;
    private List<String> allergens;
    private List<String> dislikes;
    private List<String> ingredients;
    private List<String> benefits;
    private String image;

    public Food() {
        this.tags = new ArrayList<>();
        this.allergens = new ArrayList<>();
        this.dislikes = new ArrayList<>();
        this.ingredients = new ArrayList<>();
        this.benefits = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public int getProtein() { return protein; }
    public void setProtein(int protein) { this.protein = protein; }

    public int getCarbs() { return carbs; }
    public void setCarbs(int carbs) { this.carbs = carbs; }

    public int getFat() { return fat; }
    public void setFat(int fat) { this.fat = fat; }

    public int getFiber() { return fiber; }
    public void setFiber(int fiber) { this.fiber = fiber; }

    public int getSugar() { return sugar; }
    public void setSugar(int sugar) { this.sugar = sugar; }

    public int getSodium() { return sodium; }
    public void setSodium(int sodium) { this.sodium = sodium; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<String> getAllergens() { return allergens; }
    public void setAllergens(List<String> allergens) { this.allergens = allergens; }

    public List<String> getDislikes() { return dislikes; }
    public void setDislikes(List<String> dislikes) { this.dislikes = dislikes; }

    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }

    public List<String> getBenefits() { return benefits; }
    public void setBenefits(List<String> benefits) { this.benefits = benefits; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
