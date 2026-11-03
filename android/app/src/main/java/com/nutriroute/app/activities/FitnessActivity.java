package com.nutriroute.app.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.nutriroute.app.R;
import com.nutriroute.app.models.FitnessLog;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FitnessActivity extends AppCompatActivity {

    private TextView tvSteps, tvCaloriesBurned, tvActiveMinutes, tvSessions;
    private EditText etSteps, etCalories, etMinutes;
    private Button btnSave;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fitness);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Fitness Tracker");
        }

        tvSteps = findViewById(R.id.tv_steps);
        tvCaloriesBurned = findViewById(R.id.tv_calories_burned);
        tvActiveMinutes = findViewById(R.id.tv_active_minutes);
        tvSessions = findViewById(R.id.tv_sessions);
        etSteps = findViewById(R.id.et_steps);
        etCalories = findViewById(R.id.et_calories);
        etMinutes = findViewById(R.id.et_minutes);
        btnSave = findViewById(R.id.btn_save_fitness);

        apiService = RetrofitClient.getApiService(this);
        loadFitness();

        btnSave.setOnClickListener(v -> saveFitness());
    }

    private void loadFitness() {
        apiService.getFitness().enqueue(new Callback<FitnessLog>() {
            @Override
            public void onResponse(Call<FitnessLog> call, Response<FitnessLog> response) {
                if (response.isSuccessful() && response.body() != null) {
                    updateUI(response.body());
                }
            }
            @Override
            public void onFailure(Call<FitnessLog> call, Throwable t) {
                Toast.makeText(FitnessActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void saveFitness() {
        String stepsStr = etSteps.getText().toString().trim();
        String calStr = etCalories.getText().toString().trim();
        String minStr = etMinutes.getText().toString().trim();

        if (stepsStr.isEmpty() || calStr.isEmpty() || minStr.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        FitnessLog log = new FitnessLog(
                Integer.parseInt(stepsStr),
                Integer.parseInt(calStr),
                Integer.parseInt(minStr),
                1
        );

        apiService.saveFitnessLog(log).enqueue(new Callback<FitnessLog>() {
            @Override
            public void onResponse(Call<FitnessLog> call, Response<FitnessLog> response) {
                if (response.isSuccessful() && response.body() != null) {
                    updateUI(response.body());
                    Toast.makeText(FitnessActivity.this, "Fitness log saved!", Toast.LENGTH_SHORT).show();
                    etSteps.setText("");
                    etCalories.setText("");
                    etMinutes.setText("");
                }
            }
            @Override
            public void onFailure(Call<FitnessLog> call, Throwable t) {
                Toast.makeText(FitnessActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateUI(FitnessLog log) {
        tvSteps.setText(String.format("%,d", log.getSteps()));
        tvCaloriesBurned.setText(log.getCaloriesBurned() + " kcal");
        tvActiveMinutes.setText(log.getActiveMinutes() + " min");
        tvSessions.setText(String.valueOf(log.getSessions()));
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
