package com.nutriroute.app.activities;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.bumptech.glide.Glide;
import com.nutriroute.app.R;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;
import com.nutriroute.app.models.ApiResponse;
import com.nutriroute.app.utils.Constants;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FoodDetailsActivity extends AppCompatActivity {

    private Food food;
    private boolean isFav = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_food_details);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        food = (Food) getIntent().getSerializableExtra(Constants.EXTRA_FOOD_ITEM);
        if (food == null) { finish(); return; }

        ImageView imgFood = findViewById(R.id.img_food_detail);
        TextView tvName = findViewById(R.id.tv_detail_name);
        TextView tvCuisine = findViewById(R.id.tv_detail_cuisine);
        TextView tvDiet = findViewById(R.id.tv_detail_diet);
        TextView tvCalories = findViewById(R.id.tv_detail_calories);
        TextView tvProtein = findViewById(R.id.tv_detail_protein);
        TextView tvCarbs = findViewById(R.id.tv_detail_carbs);
        TextView tvFat = findViewById(R.id.tv_detail_fat);
        TextView tvFiber = findViewById(R.id.tv_detail_fiber);
        TextView tvSugar = findViewById(R.id.tv_detail_sugar);
        TextView tvSodium = findViewById(R.id.tv_detail_sodium);
        TextView tvIngredients = findViewById(R.id.tv_detail_ingredients);
        TextView tvBenefits = findViewById(R.id.tv_detail_benefits);

        Glide.with(this).load(food.getImage()).into(imgFood);
        tvName.setText(food.getName());
        tvCuisine.setText(food.getCuisine());
        tvDiet.setText(food.getDiet());
        tvCalories.setText(food.getCalories() + " kcal");
        tvProtein.setText(food.getProtein() + "g");
        tvCarbs.setText(food.getCarbs() + "g");
        tvFat.setText(food.getFat() + "g");
        tvFiber.setText(food.getFiber() + "g");
        tvSugar.setText(food.getSugar() + "g");
        tvSodium.setText(food.getSodium() + "mg");

        if (food.getIngredients() != null) {
            tvIngredients.setText("• " + String.join("\n• ", food.getIngredients()));
        }
        if (food.getBenefits() != null) {
            tvBenefits.setText("✓ " + String.join("\n✓ ", food.getBenefits()));
        }

        if (getSupportActionBar() != null) getSupportActionBar().setTitle(food.getName());

        // FAB toggle favorite
        com.google.android.material.floatingactionbutton.FloatingActionButton fabFav = findViewById(R.id.fab_fav);
        fabFav.setOnClickListener(v -> toggleFavorite());
    }

    private void toggleFavorite() {
        ApiService api = RetrofitClient.getApiService(this);
        api.toggleFavorite(food.getId()).enqueue(new Callback<ApiResponse<Boolean>>() {
            @Override
            public void onResponse(Call<ApiResponse<Boolean>> call, Response<ApiResponse<Boolean>> response) {
                isFav = !isFav;
                Toast.makeText(FoodDetailsActivity.this,
                        isFav ? "Added to Favorites!" : "Removed from Favorites",
                        Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onFailure(Call<ApiResponse<Boolean>> call, Throwable t) {
                Toast.makeText(FoodDetailsActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
