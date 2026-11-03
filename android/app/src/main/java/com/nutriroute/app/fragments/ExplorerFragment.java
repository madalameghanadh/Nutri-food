package com.nutriroute.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;
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

public class ExplorerFragment extends Fragment {

    private RecyclerView recyclerView;
    private FoodAdapter adapter;
    private FoodViewModel viewModel;
    private EditText etSearch;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_explorer, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(FoodViewModel.class);

        recyclerView = view.findViewById(R.id.rv_explorer);
        etSearch = view.findViewById(R.id.et_search_food);

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
        recyclerView.setLayoutManager(new GridLayoutManager(requireContext(), 2));
        recyclerView.setAdapter(adapter);

        viewModel.getFoods().observe(getViewLifecycleOwner(), foods -> {
            if (foods != null) {
                List<RecommendationResult> results = new ArrayList<>();
                for (Food f : foods) {
                    RecommendationResult r = new RecommendationResult();
                    r.setFood(f);
                    r.setMatchScore(0);
                    results.add(r);
                }
                adapter.setItems(results);
            }
        });

        viewModel.loadFoods(null, null);

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                viewModel.loadFoods(null, s.toString().trim());
            }
            @Override public void afterTextChanged(Editable s) {}
        });
    }
}
