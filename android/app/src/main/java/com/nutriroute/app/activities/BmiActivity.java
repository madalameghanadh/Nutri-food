package com.nutriroute.app.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.nutriroute.app.R;
import com.nutriroute.app.utils.BMICalculator;

public class BmiActivity extends AppCompatActivity {

    private EditText etWeight, etHeight;
    private Button btnCalculate;
    private TextView tvBmiResult, tvBmiCategory, tvBmiDesc;
    private View bmiIndicator;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bmi);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("BMI Calculator");
        }

        etWeight = findViewById(R.id.et_bmi_weight);
        etHeight = findViewById(R.id.et_bmi_height);
        btnCalculate = findViewById(R.id.btn_calculate_bmi);
        tvBmiResult = findViewById(R.id.tv_bmi_result);
        tvBmiCategory = findViewById(R.id.tv_bmi_category);
        tvBmiDesc = findViewById(R.id.tv_bmi_desc);

        btnCalculate.setOnClickListener(v -> calculateBmi());
    }

    private void calculateBmi() {
        String weightStr = etWeight.getText().toString().trim();
        String heightStr = etHeight.getText().toString().trim();

        if (weightStr.isEmpty() || heightStr.isEmpty()) {
            if (weightStr.isEmpty()) etWeight.setError("Required");
            if (heightStr.isEmpty()) etHeight.setError("Required");
            return;
        }

        double weight = Double.parseDouble(weightStr);
        double height = Double.parseDouble(heightStr);
        double bmi = BMICalculator.calculateBMI(weight, height);
        String category = BMICalculator.getBMICategory(bmi);

        tvBmiResult.setText(String.valueOf(bmi));
        tvBmiCategory.setText(category);

        String desc;
        switch (category) {
            case "Underweight":
                desc = "Your BMI indicates you are underweight. Consider increasing caloric intake with nutrient-dense foods.";
                break;
            case "Normal Range":
                desc = "Great job! Your BMI is within the healthy range. Maintain your balanced diet and regular exercise.";
                break;
            case "Overweight":
                desc = "Your BMI is slightly above the healthy range. Focus on a balanced diet and regular physical activity.";
                break;
            default:
                desc = "Please consult a healthcare provider for personalised guidance on reaching a healthier weight.";
                break;
        }
        tvBmiDesc.setText(desc);
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
