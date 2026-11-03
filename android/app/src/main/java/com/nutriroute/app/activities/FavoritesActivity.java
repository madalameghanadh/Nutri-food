package com.nutriroute.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriroute.app.R;
import com.nutriroute.app.adapters.FoodAdapter;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.RecommendationResult;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;
import com.nutriroute.app.utils.Constants;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FavoritesActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private FoodAdapter adapter;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_favorites);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("My Favorites");
        }

        recyclerView = findViewById(R.id.rv_favorites);
        progressBar = findViewById(R.id.progress_bar);

        adapter = new FoodAdapter(new FoodAdapter.OnFoodClickListener() {
            @Override
            public void onFoodClick(Food food) {
                Intent intent = new Intent(FavoritesActivity.this, FoodDetailsActivity.class);
                intent.putExtra(Constants.EXTRA_FOOD_ITEM, food);
                startActivity(intent);
            }
            @Override
            public void onFavClick(Food food) {}
        });
        recyclerView.setLayoutManager(new GridLayoutManager(this, 2));
        recyclerView.setAdapter(adapter);

        loadFavorites();
    }

    private void loadFavorites() {
        progressBar.setVisibility(View.VISIBLE);
        ApiService apiService = RetrofitClient.getApiService(this);
        apiService.getFavorites().enqueue(new Callback<List<Food>>() {
            @Override
            public void onResponse(Call<List<Food>> call, Response<List<Food>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    List<RecommendationResult> results = new ArrayList<>();
                    for (Food f : response.body()) {
                        RecommendationResult r = new RecommendationResult();
                        r.setFood(f);
                        r.setMatchScore(0);
                        results.add(r);
                    }
                    adapter.setItems(results);
                }
            }
            @Override
            public void onFailure(Call<List<Food>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(FavoritesActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
