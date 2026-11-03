package com.nutriroute.app.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriroute.app.R;
import com.nutriroute.app.adapters.MealPlanAdapter;
import com.nutriroute.app.models.MealPlan;
import com.nutriroute.app.network.ApiService;
import com.nutriroute.app.network.RetrofitClient;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MealPlannerFragment extends Fragment {

    private RecyclerView rvMeals;
    private MealPlanAdapter adapter;
    private Button btnGenerate;
    private ProgressBar progressBar;
    private TextView tvTotalCalories, tvTotalProtein, tvTotalCarbs, tvTotalFiber;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_meal_planner, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvMeals = view.findViewById(R.id.rv_meals);
        btnGenerate = view.findViewById(R.id.btn_generate_plan);
        progressBar = view.findViewById(R.id.progress_bar);
        tvTotalCalories = view.findViewById(R.id.tv_total_calories);
        tvTotalProtein = view.findViewById(R.id.tv_total_protein);
        tvTotalCarbs = view.findViewById(R.id.tv_total_carbs);
        tvTotalFiber = view.findViewById(R.id.tv_total_fiber);

        adapter = new MealPlanAdapter();
        rvMeals.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvMeals.setAdapter(adapter);

        btnGenerate.setOnClickListener(v -> generateMealPlan());

        // Auto-generate on open
        generateMealPlan();
    }

    private void generateMealPlan() {
        progressBar.setVisibility(View.VISIBLE);
        btnGenerate.setEnabled(false);

        ApiService apiService = RetrofitClient.getApiService(requireContext());
        apiService.generateMealPlan().enqueue(new Callback<MealPlan>() {
            @Override
            public void onResponse(Call<MealPlan> call, Response<MealPlan> response) {
                progressBar.setVisibility(View.GONE);
                btnGenerate.setEnabled(true);

                if (response.isSuccessful() && response.body() != null) {
                    MealPlan plan = response.body();
                    List<MealPlanAdapter.MealSlot> slots = new ArrayList<>();
                    if (plan.getBreakfast() != null) slots.add(new MealPlanAdapter.MealSlot("🌅 Breakfast", plan.getBreakfast()));
                    if (plan.getMorningSnack() != null) slots.add(new MealPlanAdapter.MealSlot("☕ Morning Snack", plan.getMorningSnack()));
                    if (plan.getLunch() != null) slots.add(new MealPlanAdapter.MealSlot("🌞 Lunch", plan.getLunch()));
                    if (plan.getEveningSnack() != null) slots.add(new MealPlanAdapter.MealSlot("🍎 Evening Snack", plan.getEveningSnack()));
                    if (plan.getDinner() != null) slots.add(new MealPlanAdapter.MealSlot("🌙 Dinner", plan.getDinner()));
                    adapter.setSlots(slots);

                    tvTotalCalories.setText(plan.getTotalCalories() + " kcal");
                    tvTotalProtein.setText(plan.getTotalProtein() + "g");
                    tvTotalCarbs.setText(plan.getTotalCarbs() + "g");
                    tvTotalFiber.setText(plan.getTotalFiber() + "g");
                } else {
                    Toast.makeText(requireContext(), "Could not load meal plan from server.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<MealPlan> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                btnGenerate.setEnabled(true);
                Toast.makeText(requireContext(), "Network error: " + t.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
