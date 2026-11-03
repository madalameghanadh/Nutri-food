package com.nutriroute.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.nutriroute.app.R;
import com.nutriroute.app.models.Food;
import com.nutriroute.app.models.RecommendationResult;

import java.util.ArrayList;
import java.util.List;

public class FoodAdapter extends RecyclerView.Adapter<FoodAdapter.FoodViewHolder> {

    public interface OnFoodClickListener {
        void onFoodClick(Food food);
        void onFavClick(Food food);
    }

    private List<RecommendationResult> items;
    private final OnFoodClickListener listener;

    public FoodAdapter(OnFoodClickListener listener) {
        this.items = new ArrayList<>();
        this.listener = listener;
    }

    public void setItems(List<RecommendationResult> newItems) {
        this.items = newItems != null ? newItems : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FoodViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_food, parent, false);
        return new FoodViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FoodViewHolder holder, int position) {
        RecommendationResult result = items.get(position);
        Food food = result.getFood();

        holder.tvName.setText(food.getName());
        holder.tvDiet.setText(food.getDiet());
        holder.tvCuisine.setText(food.getCuisine());
        holder.tvCalories.setText(food.getCalories() + " kcal");
        holder.tvProtein.setText(food.getProtein() + "g P");
        holder.tvCarbs.setText(food.getCarbs() + "g C");
        holder.tvFat.setText(food.getFat() + "g F");
        holder.tvMatchScore.setText(result.getMatchScore() + "% AI Match");

        if (result.getWhyRecommended() != null && !result.getWhyRecommended().isEmpty()) {
            holder.tvReason.setText("✓ " + result.getWhyRecommended().get(0));
            holder.tvReason.setVisibility(View.VISIBLE);
        } else {
            holder.tvReason.setVisibility(View.GONE);
        }

        Glide.with(holder.itemView.getContext())
                .load(food.getImage())
                .placeholder(android.R.drawable.ic_menu_gallery)
                .error(android.R.drawable.ic_menu_report_image)
                .into(holder.imgFood);

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onFoodClick(food);
        });

        holder.btnFav.setOnClickListener(v -> {
            if (listener != null) listener.onFavClick(food);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class FoodViewHolder extends RecyclerView.ViewHolder {
        ImageView imgFood, btnFav;
        TextView tvName, tvDiet, tvCuisine, tvCalories, tvProtein, tvCarbs, tvFat, tvMatchScore, tvReason;

        public FoodViewHolder(@NonNull View itemView) {
            super(itemView);
            imgFood = itemView.findViewById(R.id.img_food);
            btnFav = itemView.findViewById(R.id.btn_fav);
            tvName = itemView.findViewById(R.id.tv_food_name);
            tvDiet = itemView.findViewById(R.id.tv_food_diet);
            tvCuisine = itemView.findViewById(R.id.tv_food_cuisine);
            tvCalories = itemView.findViewById(R.id.tv_food_calories);
            tvProtein = itemView.findViewById(R.id.tv_food_protein);
            tvCarbs = itemView.findViewById(R.id.tv_food_carbs);
            tvFat = itemView.findViewById(R.id.tv_food_fat);
            tvMatchScore = itemView.findViewById(R.id.tv_match_score);
            tvReason = itemView.findViewById(R.id.tv_food_reason);
        }
    }
}
