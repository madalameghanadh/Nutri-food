package com.nutriroute.app.repository;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.nutriroute.app.models.AuthResponse;
import com.nutriroute.app.models.FitnessLog;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.HistoryItem;
import com.nutriroute.app.models.LoginRequest;
import com.nutriroute.app.models.MealPlan;
import com.nutriroute.app.models.RecommendationResult;
import com.nutriroute.app.models.User;
import com.nutriroute.app.models.WaterLog;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NutriRepository {
    private final ApiService apiService;

    public NutriRepository(Context context) {
        this.apiService = RetrofitClient.getApiService(context);
    }

    // Login Call
    public LiveData<AuthResponse> login(String email, String password) {
        MutableLiveData<AuthResponse> result = new MutableLiveData<>();
        apiService.login(new LoginRequest(email, password)).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body());
                } else {
                    AuthResponse err = new AuthResponse();
                    err.setSuccess(false);
                    err.setMessage("Invalid email or password.");
                    result.setValue(err);
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                AuthResponse err = new AuthResponse();
                err.setSuccess(false);
                err.setMessage("Unable to connect to server: " + t.getLocalizedMessage());
                result.setValue(err);
            }
        });
        return result;
    }

    // Register Call
    public LiveData<AuthResponse> register(User user) {
        MutableLiveData<AuthResponse> result = new MutableLiveData<>();
        apiService.register(user).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    result.setValue(response.body());
                } else {
                    AuthResponse err = new AuthResponse();
                    err.setSuccess(false);
                    err.setMessage("Registration failed. Please check details.");
                    result.setValue(err);
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                AuthResponse err = new AuthResponse();
                err.setSuccess(false);
                err.setMessage("Network error: " + t.getLocalizedMessage());
                result.setValue(err);
            }
        });
        return result;
    }

    // Get Recommendations
    public LiveData<List<RecommendationResult>> getRecommendations(String category, String tag, String sortBy) {
        MutableLiveData<List<RecommendationResult>> data = new MutableLiveData<>();
        apiService.getRecommendations(category, tag, sortBy).enqueue(new Callback<List<RecommendationResult>>() {
            @Override
            public void onResponse(Call<List<RecommendationResult>> call, Response<List<RecommendationResult>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<RecommendationResult>> call, Throwable t) {
                data.setValue(null);
            }
        });
        return data;
    }

    // Get Foods List
    public LiveData<List<Food>> getFoods(String category, String query) {
        MutableLiveData<List<Food>> data = new MutableLiveData<>();
        apiService.getFoods(category, query).enqueue(new Callback<List<Food>>() {
            @Override
            public void onResponse(Call<List<Food>> call, Response<List<Food>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    data.setValue(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Food>> call, Throwable t) {
                data.setValue(null);
            }
        });
        return data;
    }
}
