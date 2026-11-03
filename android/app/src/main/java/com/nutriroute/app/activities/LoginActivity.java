package com.nutriroute.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.nutriroute.app.R;
import com.nutriroute.app.models.AuthResponse;
import com.nutriroute.app.storage.SessionManager;
import com.nutriroute.app.utils.Constants;
import com.nutriroute.app.viewmodels.AuthViewModel;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnLogin, btnDemoLogin;
    private ProgressBar progressBar;
    private TextView tvRegisterLink;
    private AuthViewModel authViewModel;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);
        authViewModel = new ViewModelProvider(this).get(AuthViewModel.class);

        etEmail = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);
        btnLogin = findViewById(R.id.btn_login);
        btnDemoLogin = findViewById(R.id.btn_demo_login);
        progressBar = findViewById(R.id.progress_bar);
        tvRegisterLink = findViewById(R.id.tv_register_link);

        btnLogin.setOnClickListener(v -> attemptLogin());

        btnDemoLogin.setOnClickListener(v -> {
            etEmail.setText(Constants.DEMO_EMAIL);
            etPassword.setText(Constants.DEMO_PASSWORD);
            attemptLogin();
        });

        tvRegisterLink.setOnClickListener(v ->
                startActivity(new Intent(LoginActivity.this, RegisterActivity.class)));

        authViewModel.getAuthResponse().observe(this, this::handleAuthResponse);
    }

    private void attemptLogin() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (TextUtils.isEmpty(email)) { etEmail.setError("Email required"); return; }
        if (TextUtils.isEmpty(password)) { etPassword.setError("Password required"); return; }

        progressBar.setVisibility(View.VISIBLE);
        btnLogin.setEnabled(false);
        authViewModel.login(email, password);
    }

    private void handleAuthResponse(AuthResponse response) {
        progressBar.setVisibility(View.GONE);
        btnLogin.setEnabled(true);

        if (response != null && response.isSuccess()) {
            sessionManager.createLoginSession(response.getToken(), response.getUser());
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finish();
        } else {
            String msg = (response != null && response.getMessage() != null)
                    ? response.getMessage() : "Login failed. Try again.";
            Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
        }
    }
}
