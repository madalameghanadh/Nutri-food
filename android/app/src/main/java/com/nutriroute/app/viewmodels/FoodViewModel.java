package com.nutriroute.app.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.RecommendationResult;
import com.nutriroute.app.repository.NutriRepository;

import java.util.List;

public class FoodViewModel extends AndroidViewModel {

    private final NutriRepository repository;
    private final MutableLiveData<List<RecommendationResult>> recommendations = new MutableLiveData<>();
    private final MutableLiveData<List<Food>> foods = new MutableLiveData<>();

    public FoodViewModel(@NonNull Application application) {
        super(application);
        repository = new NutriRepository(application);
    }

    public LiveData<List<RecommendationResult>> getRecommendations() {
        return recommendations;
    }

    public LiveData<List<Food>> getFoods() {
        return foods;
    }

    public void loadRecommendations(String category, String tag, String sortBy) {
        repository.getRecommendations(category, tag, sortBy).observeForever(data -> {
            recommendations.setValue(data);
        });
    }

    public void loadFoods(String category, String query) {
        repository.getFoods(category, query).observeForever(data -> {
            foods.setValue(data);
        });
    }
}
