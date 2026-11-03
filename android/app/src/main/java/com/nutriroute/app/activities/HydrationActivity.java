package com.nutriroute.app.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.nutriroute.app.R;
import com.nutriroute.app.models.WaterLog;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HydrationActivity extends AppCompatActivity {

    private TextView tvCurrent, tvTarget, tvPercent;
    private ProgressBar progressWater;
    private Button btn250, btn500, btnReset;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hydration);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Hydration Tracker");
        }

        tvCurrent = findViewById(R.id.tv_water_current);
        tvTarget = findViewById(R.id.tv_water_target);
        tvPercent = findViewById(R.id.tv_water_percent);
        progressWater = findViewById(R.id.progress_water);
        btn250 = findViewById(R.id.btn_add_250);
        btn500 = findViewById(R.id.btn_add_500);
        btnReset = findViewById(R.id.btn_reset_water);

        apiService = RetrofitClient.getApiService(this);
        loadHydration();

        btn250.setOnClickListener(v -> addWater(250));
        btn500.setOnClickListener(v -> addWater(500));
        btnReset.setOnClickListener(v -> resetWater());
    }

    private void loadHydration() {
        apiService.getHydration().enqueue(new Callback<WaterLog>() {
            @Override
            public void onResponse(Call<WaterLog> call, Response<WaterLog> response) {
                if (response.isSuccessful() && response.body() != null) {
                    updateUI(response.body());
                }
            }
            @Override
            public void onFailure(Call<WaterLog> call, Throwable t) {
                Toast.makeText(HydrationActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void addWater(int ml) {
        apiService.addWater(ml).enqueue(new Callback<WaterLog>() {
            @Override
            public void onResponse(Call<WaterLog> call, Response<WaterLog> response) {
                if (response.isSuccessful() && response.body() != null) {
                    updateUI(response.body());
                    Toast.makeText(HydrationActivity.this, "+" + ml + "ml added!", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<WaterLog> call, Throwable t) {
                Toast.makeText(HydrationActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void resetWater() {
        apiService.resetWater().enqueue(new Callback<WaterLog>() {
            @Override
            public void onResponse(Call<WaterLog> call, Response<WaterLog> response) {
                if (response.isSuccessful() && response.body() != null) {
                    updateUI(response.body());
                    Toast.makeText(HydrationActivity.this, "Water log reset", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<WaterLog> call, Throwable t) {
                Toast.makeText(HydrationActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateUI(WaterLog log) {
        tvCurrent.setText(String.format("%.1f L", log.getCurrentLiters()));
        tvTarget.setText(String.format("/ %.1f L", log.getTargetLiters()));
        tvPercent.setText(log.getPercentage() + "%");
        progressWater.setProgress(log.getPercentage());
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
