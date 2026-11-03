package com.nutriroute.app.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.nutriroute.app.R;
import com.nutriroute.app.models.ApiResponse;
import com.nutriroute.app.models.ChatRequest;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NutritionActivity extends AppCompatActivity {

    private EditText etMessage;
    private Button btnSend;
    private LinearLayout llChat;
    private ScrollView scrollView;
    private ProgressBar progressBar;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nutrition);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("NutriAI Assistant");
        }

        etMessage = findViewById(R.id.et_chat_message);
        btnSend = findViewById(R.id.btn_send_chat);
        llChat = findViewById(R.id.ll_chat_messages);
        scrollView = findViewById(R.id.scroll_chat);
        progressBar = findViewById(R.id.progress_bar);

        apiService = RetrofitClient.getApiService(this);

        // Welcome message
        addBotMessage("Hello! I'm NutriAI, your intelligent nutrition assistant. Ask me anything about food, nutrition, diet plans, or health tips!");

        btnSend.setOnClickListener(v -> sendMessage());
    }

    private void sendMessage() {
        String msg = etMessage.getText().toString().trim();
        if (msg.isEmpty()) return;

        addUserMessage(msg);
        etMessage.setText("");
        progressBar.setVisibility(View.VISIBLE);
        btnSend.setEnabled(false);

        apiService.askChatbot(new ChatRequest(msg)).enqueue(new Callback<ApiResponse<String>>() {
            @Override
            public void onResponse(Call<ApiResponse<String>> call, Response<ApiResponse<String>> response) {
                progressBar.setVisibility(View.GONE);
                btnSend.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().getData() != null) {
                    addBotMessage(response.body().getData());
                } else {
                    addBotMessage("I couldn't process that. Please try again.");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<String>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                btnSend.setEnabled(true);
                addBotMessage("Network error: " + t.getLocalizedMessage());
            }
        });
    }

    private void addUserMessage(String msg) {
        TextView tv = new TextView(this);
        tv.setText(msg);
        tv.setBackgroundResource(R.drawable.bg_chat_user);
        tv.setPadding(24, 16, 24, 16);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(80, 12, 16, 4);
        params.gravity = android.view.Gravity.END;
        tv.setLayoutParams(params);
        llChat.addView(tv);
        scrollView.post(() -> scrollView.fullScroll(View.FOCUS_DOWN));
    }

    private void addBotMessage(String msg) {
        TextView tv = new TextView(this);
        tv.setText(msg);
        tv.setBackgroundResource(R.drawable.bg_chat_bot);
        tv.setPadding(24, 16, 24, 16);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(16, 12, 80, 4);
        params.gravity = android.view.Gravity.START;
        tv.setLayoutParams(params);
        llChat.addView(tv);
        scrollView.post(() -> scrollView.fullScroll(View.FOCUS_DOWN));
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
