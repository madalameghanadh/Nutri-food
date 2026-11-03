package com.nutriroute.app.activities;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.nutriroute.app.R;
import com.nutriroute.app.models.ApiResponse;
import com.nutriroute.app.models.User;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;
import com.nutriroute.app.storage.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileActivity extends AppCompatActivity {

    private EditText etFullName, etAge, etHeight, etWeight;
    private Spinner spinnerGender, spinnerActivity, spinnerDiet, spinnerGoal, spinnerCuisine;
    private Button btnSave;
    private ProgressBar progressBar;
    private SessionManager sessionManager;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Edit Profile");
        }

        sessionManager = new SessionManager(this);
        apiService = RetrofitClient.getApiService(this);

        etFullName = findViewById(R.id.et_full_name);
        etAge = findViewById(R.id.et_age);
        etHeight = findViewById(R.id.et_height);
        etWeight = findViewById(R.id.et_weight);
        spinnerGender = findViewById(R.id.spinner_gender);
        spinnerActivity = findViewById(R.id.spinner_activity);
        spinnerDiet = findViewById(R.id.spinner_diet);
        spinnerGoal = findViewById(R.id.spinner_goal);
        spinnerCuisine = findViewById(R.id.spinner_cuisine);
        btnSave = findViewById(R.id.btn_save_profile);
        progressBar = findViewById(R.id.progress_bar);

        setupSpinners();
        populateFields();

        btnSave.setOnClickListener(v -> saveProfile());
    }

    private void setupSpinners() {
        ArrayAdapter<CharSequence> genderAdapter = ArrayAdapter.createFromResource(this, R.array.genders, android.R.layout.simple_spinner_item);
        genderAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerGender.setAdapter(genderAdapter);

        ArrayAdapter<CharSequence> actAdapter = ArrayAdapter.createFromResource(this, R.array.activity_levels, android.R.layout.simple_spinner_item);
        actAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerActivity.setAdapter(actAdapter);

        ArrayAdapter<CharSequence> dietAdapter = ArrayAdapter.createFromResource(this, R.array.diet_types, android.R.layout.simple_spinner_item);
        dietAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerDiet.setAdapter(dietAdapter);

        ArrayAdapter<CharSequence> goalAdapter = ArrayAdapter.createFromResource(this, R.array.fitness_goals, android.R.layout.simple_spinner_item);
        goalAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerGoal.setAdapter(goalAdapter);

        ArrayAdapter<CharSequence> cuisineAdapter = ArrayAdapter.createFromResource(this, R.array.cuisines, android.R.layout.simple_spinner_item);
        cuisineAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCuisine.setAdapter(cuisineAdapter);
    }

    private void populateFields() {
        User user = sessionManager.getUserDetails();
        if (user != null) {
            etFullName.setText(user.getFullName());
            etAge.setText(String.valueOf(user.getAge()));
            etHeight.setText(String.valueOf(user.getHeight()));
            etWeight.setText(String.valueOf(user.getWeight()));
        }
    }

    private void saveProfile() {
        String name = etFullName.getText().toString().trim();
        if (TextUtils.isEmpty(name)) { etFullName.setError("Required"); return; }

        User user = sessionManager.getUserDetails();
        if (user == null) user = new User();

        user.setFullName(name);
        String ageStr = etAge.getText().toString().trim();
        String heightStr = etHeight.getText().toString().trim();
        String weightStr = etWeight.getText().toString().trim();

        if (!ageStr.isEmpty()) user.setAge(Integer.parseInt(ageStr));
        if (!heightStr.isEmpty()) user.setHeight(Double.parseDouble(heightStr));
        if (!weightStr.isEmpty()) user.setWeight(Double.parseDouble(weightStr));
        user.setGender(spinnerGender.getSelectedItem().toString());
        user.setActivityLevel(spinnerActivity.getSelectedItem().toString());
        user.setDietaryPreference(spinnerDiet.getSelectedItem().toString());
        user.setFitnessGoal(spinnerGoal.getSelectedItem().toString());
        user.setFavoriteCuisine(spinnerCuisine.getSelectedItem().toString());

        progressBar.setVisibility(View.VISIBLE);
        btnSave.setEnabled(false);

        final User finalUser = user;
        apiService.updateProfile(user).enqueue(new Callback<ApiResponse<User>>() {
            @Override
            public void onResponse(Call<ApiResponse<User>> call, Response<ApiResponse<User>> response) {
                progressBar.setVisibility(View.GONE);
                btnSave.setEnabled(true);
                sessionManager.saveUser(finalUser);
                Toast.makeText(ProfileActivity.this, "Profile updated successfully!", Toast.LENGTH_SHORT).show();
                finish();
            }
            @Override
            public void onFailure(Call<ApiResponse<User>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                btnSave.setEnabled(true);
                Toast.makeText(ProfileActivity.this, "Network error: " + t.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
