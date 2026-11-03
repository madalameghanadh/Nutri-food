package com.nutriroute.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriroute.app.R;
import com.nutriroute.app.activities.BmiActivity;
import com.nutriroute.app.activities.FitnessActivity;
import com.nutriroute.app.activities.HydrationActivity;
import com.nutriroute.app.adapters.FoodAdapter;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.User;
import com.nutriroute.app.storage.SessionManager;
import com.nutriroute.app.utils.BMICalculator;
import com.nutriroute.app.viewmodels.FoodViewModel;

public class DashboardFragment extends Fragment {

    private TextView tvGreeting, tvBmi, tvBmiCategory, tvWater, tvCalories, tvSteps;
    private RecyclerView rvTopPicks;
    private FoodAdapter foodAdapter;
    private FoodViewModel foodViewModel;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_dashboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());
        foodViewModel = new ViewModelProvider(this).get(FoodViewModel.class);

        tvGreeting = view.findViewById(R.id.tv_greeting);
        tvBmi = view.findViewById(R.id.tv_bmi_value);
        tvBmiCategory = view.findViewById(R.id.tv_bmi_category);
        tvWater = view.findViewById(R.id.tv_water_value);
        tvCalories = view.findViewById(R.id.tv_calories_value);
        tvSteps = view.findViewById(R.id.tv_steps_value);
        rvTopPicks = view.findViewById(R.id.rv_top_picks);

        // Setup RecyclerView
        foodAdapter = new FoodAdapter(new FoodAdapter.OnFoodClickListener() {
            @Override
            public void onFoodClick(Food food) {
                Intent intent = new Intent(requireContext(), com.nutriroute.app.activities.FoodDetailsActivity.class);
                intent.putExtra(com.nutriroute.app.utils.Constants.EXTRA_FOOD_ITEM, food);
                startActivity(intent);
            }

            @Override
            public void onFavClick(Food food) {}
        });
        rvTopPicks.setLayoutManager(new LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false));
        rvTopPicks.setAdapter(foodAdapter);

        // Load user data
        User user = sessionManager.getUserDetails();
        if (user != null) {
            tvGreeting.setText("Hello, " + user.getFullName().split(" ")[0] + "! 👋");
            double bmi = BMICalculator.calculateBMI(user.getWeight(), user.getHeight());
            tvBmi.setText(String.valueOf(bmi));
            tvBmiCategory.setText(BMICalculator.getBMICategory(bmi));
        }

        // Demo stats
        tvWater.setText("1.8 / 2.5 L");
        tvCalories.setText("1,840 kcal");
        tvSteps.setText("6,420");

        // Load top AI picks
        foodViewModel.loadRecommendations(null, null, "score");
        foodViewModel.getRecommendations().observe(getViewLifecycleOwner(), results -> {
            if (results != null) {
                foodAdapter.setItems(results.size() > 5 ? results.subList(0, 5) : results);
            }
        });

        // Quick action buttons
        view.findViewById(R.id.btn_bmi).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), BmiActivity.class)));
        view.findViewById(R.id.btn_water).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), HydrationActivity.class)));
        view.findViewById(R.id.btn_fitness).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), FitnessActivity.class)));
    }
}
