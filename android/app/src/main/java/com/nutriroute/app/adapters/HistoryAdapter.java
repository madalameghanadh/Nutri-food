package com.nutriroute.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriroute.app.R;
import com.nutriroute.app.models.HistoryItem;

import java.util.ArrayList;
import java.util.List;

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder> {

    private List<HistoryItem> items;

    public HistoryAdapter() {
        this.items = new ArrayList<>();
    }

    public void setItems(List<HistoryItem> newItems) {
        this.items = newItems != null ? newItems : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_history, parent, false);
        return new HistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HistoryViewHolder holder, int position) {
        HistoryItem item = items.get(position);
        holder.tvDate.setText(item.getDate());
        holder.tvFoodName.setText(item.getFoodName());
        holder.tvCategory.setText(item.getCategory());
        holder.tvMatch.setText(item.getMatchScore() + "% Match");
        holder.tvReason.setText(item.getReason());
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class HistoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvDate, tvFoodName, tvCategory, tvMatch, tvReason;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            tvDate = itemView.findViewById(R.id.tv_history_date);
            tvFoodName = itemView.findViewById(R.id.tv_history_food);
            tvCategory = itemView.findViewById(R.id.tv_history_category);
            tvMatch = itemView.findViewById(R.id.tv_history_match);
            tvReason = itemView.findViewById(R.id.tv_history_reason);
        }
    }
}
