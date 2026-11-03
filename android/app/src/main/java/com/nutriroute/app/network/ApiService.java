package com.nutriroute.app.network;

import com.nutriroute.app.models.ApiResponse;
import com.nutriroute.app.models.AuthResponse;
import com.nutriroute.app.models.ChatRequest;
import com.nutriroute.app.models.FitnessLog;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.HistoryItem;
import com.nutriroute.app.models.LoginRequest;
import com.nutriroute.app.models.MealPlan;
import com.nutriroute.app.models.RecommendationResult;
import com.nutriroute.app.models.User;
import com.nutriroute.app.models.WaterLog;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    // Authentication Endpoints
    @POST("auth/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    @POST("auth/register")
    Call<AuthResponse> register(@Body User user);

    // Profile Endpoints
    @GET("user/profile")
    Call<User> getProfile();

    @PUT("user/profile")
    Call<ApiResponse<User>> updateProfile(@Body User user);

    // Food Database Endpoints
    @GET("foods")
    Call<List<Food>> getFoods(@Query("category") String category, @Query("query") String query);

    @GET("foods/{id}")
    Call<Food> getFoodById(@Path("id") String id);

    // AI Recommendation Endpoints
    @GET("recommendations")
    Call<List<RecommendationResult>> getRecommendations(
            @Query("category") String category,
            @Query("tag") String tag,
            @Query("sortBy") String sortBy
    );

    // Meal Planner Endpoints
    @GET("meal-plan/generate")
    Call<MealPlan> generateMealPlan();

    // Favorites Endpoints
    @GET("favorites")
    Call<List<Food>> getFavorites();

    @POST("favorites/toggle/{id}")
    Call<ApiResponse<Boolean>> toggleFavorite(@Path("id") String id);

    // Recommendation History Endpoints
    @GET("history")
    Call<List<HistoryItem>> getHistory();

    // Hydration Endpoints
    @GET("hydration")
    Call<WaterLog> getHydration();

    @POST("hydration/add")
    Call<WaterLog> addWater(@Query("ml") int ml);

    @POST("hydration/reset")
    Call<WaterLog> resetWater();

    // Fitness Endpoints
    @GET("fitness")
    Call<FitnessLog> getFitness();

    @POST("fitness/log")
    Call<FitnessLog> saveFitnessLog(@Body FitnessLog log);

    // NutriAI Chatbot Assistant Endpoint
    @POST("chatbot/ask")
    Call<ApiResponse<String>> askChatbot(@Body ChatRequest request);
}
