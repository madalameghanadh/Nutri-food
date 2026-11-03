package com.nutriroute.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.nutriroute.app.R;
import com.nutriroute.app.models.AuthResponse;
import com.nutriroute.app.models.User;
import com.nutriroute.app.storage.SessionManager;
import com.nutriroute.app.viewmodels.AuthViewModel;

public class RegisterActivity extends AppCompatActivity {

    private EditText etFullName, etEmail, etPassword, etAge, etHeight, etWeight;
    private Spinner spinnerGender, spinnerActivity, spinnerDiet, spinnerGoal, spinnerCuisine;
    private Button btnRegister;
    private ProgressBar progressBar;
    private TextView tvLoginLink;
    private AuthViewModel authViewModel;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        sessionManager = new SessionManager(this);
        authViewModel = new ViewModelProvider(this).get(AuthViewModel.class);

        etFullName = findViewById(R.id.et_full_name);
        etEmail = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);
        etAge = findViewById(R.id.et_age);
        etHeight = findViewById(R.id.et_height);
        etWeight = findViewById(R.id.et_weight);
        spinnerGender = findViewById(R.id.spinner_gender);
        spinnerActivity = findViewById(R.id.spinner_activity);
        spinnerDiet = findViewById(R.id.spinner_diet);
        spinnerGoal = findViewById(R.id.spinner_goal);
        spinnerCuisine = findViewById(R.id.spinner_cuisine);
        btnRegister = findViewById(R.id.btn_register);
        progressBar = findViewById(R.id.progress_bar);
        tvLoginLink = findViewById(R.id.tv_login_link);

        setupSpinners();

        btnRegister.setOnClickListener(v -> attemptRegister());
        tvLoginLink.setOnClickListener(v -> finish());

        authViewModel.getAuthResponse().observe(this, this::handleAuthResponse);
    }

    private void setupSpinners() {
        ArrayAdapter<CharSequence> genderAdapter = ArrayAdapter.createFromResource(this, R.array.genders, android.R.layout.simple_spinner_item);
        genderAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerGender.setAdapter(genderAdapter);

        ArrayAdapter<CharSequence> activityAdapter = ArrayAdapter.createFromResource(this, R.array.activity_levels, android.R.layout.simple_spinner_item);
        activityAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerActivity.setAdapter(activityAdapter);

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

    private void attemptRegister() {
        String name = etFullName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String ageStr = etAge.getText().toString().trim();
        String heightStr = etHeight.getText().toString().trim();
        String weightStr = etWeight.getText().toString().trim();

        if (TextUtils.isEmpty(name)) { etFullName.setError("Name required"); return; }
        if (TextUtils.isEmpty(email)) { etEmail.setError("Email required"); return; }
        if (TextUtils.isEmpty(password) || password.length() < 6) { etPassword.setError("Min 6 characters"); return; }
        if (TextUtils.isEmpty(ageStr)) { etAge.setError("Age required"); return; }
        if (TextUtils.isEmpty(heightStr)) { etHeight.setError("Height required"); return; }
        if (TextUtils.isEmpty(weightStr)) { etWeight.setError("Weight required"); return; }

        User user = new User(
                name, email, password,
                Integer.parseInt(ageStr),
                spinnerGender.getSelectedItem().toString(),
                Double.parseDouble(heightStr),
                Double.parseDouble(weightStr),
                spinnerActivity.getSelectedItem().toString(),
                spinnerDiet.getSelectedItem().toString(),
                spinnerGoal.getSelectedItem().toString(),
                spinnerCuisine.getSelectedItem().toString()
        );

        progressBar.setVisibility(View.VISIBLE);
        btnRegister.setEnabled(false);
        authViewModel.register(user);
    }

    private void handleAuthResponse(AuthResponse response) {
        progressBar.setVisibility(View.GONE);
        btnRegister.setEnabled(true);

        if (response != null && response.isSuccess()) {
            sessionManager.createLoginSession(response.getToken(), response.getUser());
            startActivity(new Intent(RegisterActivity.this, MainActivity.class));
            finishAffinity();
        } else {
            String msg = (response != null && response.getMessage() != null)
                    ? response.getMessage() : "Registration failed.";
            Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
        }
    }
}
