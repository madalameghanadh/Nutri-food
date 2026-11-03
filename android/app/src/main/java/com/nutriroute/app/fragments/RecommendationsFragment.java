package com.nutriroute.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriroute.app.R;
import com.nutriroute.app.activities.FoodDetailsActivity;
import com.nutriroute.app.adapters.FoodAdapter;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.RecommendationResult;
import com.nutriroute.app.utils.Constants;
import com.nutriroute.app.viewmodels.FoodViewModel;

import java.util.ArrayList;
import java.util.List;

public class RecommendationsFragment extends Fragment {

    private RecyclerView recyclerView;
    private FoodAdapter adapter;
    private FoodViewModel viewModel;
    private Spinner spinnerCategory, spinnerSort;
    private EditText etSearch;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_recommendations, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(FoodViewModel.class);

        recyclerView = view.findViewById(R.id.rv_recommendations);
        spinnerCategory = view.findViewById(R.id.spinner_category);
        spinnerSort = view.findViewById(R.id.spinner_sort);
        etSearch = view.findViewById(R.id.et_search_recs);

        adapter = new FoodAdapter(new FoodAdapter.OnFoodClickListener() {
            @Override
            public void onFoodClick(Food food) {
                Intent intent = new Intent(requireContext(), FoodDetailsActivity.class);
                intent.putExtra(Constants.EXTRA_FOOD_ITEM, food);
                startActivity(intent);
            }
            @Override
            public void onFavClick(Food food) {}
        });
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        // Spinners
        ArrayAdapter<CharSequence> catAdapter = ArrayAdapter.createFromResource(requireContext(), R.array.food_categories, android.R.layout.simple_spinner_item);
        catAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategory.setAdapter(catAdapter);

        ArrayAdapter<CharSequence> sortAdapter = ArrayAdapter.createFromResource(requireContext(), R.array.sort_options, android.R.layout.simple_spinner_item);
        sortAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerSort.setAdapter(sortAdapter);

        // Observe changes
        viewModel.getRecommendations().observe(getViewLifecycleOwner(), results -> {
            if (results != null) adapter.setItems(results);
        });

        loadRecommendations();

        AdapterView.OnItemSelectedListener spinnerListener = new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                loadRecommendations();
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        };
        spinnerCategory.setOnItemSelectedListener(spinnerListener);
        spinnerSort.setOnItemSelectedListener(spinnerListener);
    }

    private void loadRecommendations() {
        String cat = spinnerCategory != null ? spinnerCategory.getSelectedItem().toString() : null;
        String sort = spinnerSort != null ? spinnerSort.getSelectedItem().toString().toLowerCase() : "score";
        if (cat != null && cat.equalsIgnoreCase("All")) cat = null;
        viewModel.loadRecommendations(cat, null, sort);
    }
}
