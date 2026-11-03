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

import java.util.ArrayList;
import java.util.List;

public class MealPlanAdapter extends RecyclerView.Adapter<MealPlanAdapter.MealViewHolder> {

    public static class MealSlot {
        private String slotTitle;
        private Food food;

        public MealSlot(String slotTitle, Food food) {
            this.slotTitle = slotTitle;
            this.food = food;
        }

        public String getSlotTitle() { return slotTitle; }
        public Food getFood() { return food; }
    }

    private List<MealSlot> slots;

    public MealPlanAdapter() {
        this.slots = new ArrayList<>();
    }

    public void setSlots(List<MealSlot> newSlots) {
        this.slots = newSlots != null ? newSlots : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MealViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_meal, parent, false);
        return new MealViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MealViewHolder holder, int position) {
        MealSlot slot = slots.get(position);
        Food food = slot.getFood();

        holder.tvSlotTitle.setText(slot.getSlotTitle());
        if (food != null) {
            holder.tvFoodName.setText(food.getName());
            holder.tvMacros.setText(food.getCalories() + " kcal • " + food.getProtein() + "g P • " + food.getCarbs() + "g C • " + food.getFiber() + "g Fiber");
            Glide.with(holder.itemView.getContext())
                    .load(food.getImage())
                    .placeholder(android.R.drawable.ic_menu_gallery)
                    .into(holder.imgMeal);
        }
    }

    @Override
    public int getItemCount() {
        return slots.size();
    }

    static class MealViewHolder extends RecyclerView.ViewHolder {
        TextView tvSlotTitle, tvFoodName, tvMacros;
        ImageView imgMeal;

        public MealViewHolder(@NonNull View itemView) {
            super(itemView);
            tvSlotTitle = itemView.findViewById(R.id.tv_slot_title);
            tvFoodName = itemView.findViewById(R.id.tv_meal_name);
            tvMacros = itemView.findViewById(R.id.tv_meal_macros);
            imgMeal = itemView.findViewById(R.id.img_meal);
        }
    }
}
