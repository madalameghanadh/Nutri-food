package com.nutriroute.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.nutriroute.app.R;
import com.nutriroute.app.activities.BmiActivity;
import com.nutriroute.app.activities.FavoritesActivity;
import com.nutriroute.app.activities.FitnessActivity;
import com.nutriroute.app.activities.HistoryActivity;
import com.nutriroute.app.activities.HydrationActivity;
import com.nutriroute.app.activities.LoginActivity;
import com.nutriroute.app.activities.ProfileActivity;
import com.nutriroute.app.activities.SettingsActivity;
import com.nutriroute.app.models.User;
import com.nutriroute.app.storage.SessionManager;

public class ProfileFragment extends Fragment {

    private TextView tvName, tvEmail, tvDiet, tvGoal;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());

        tvName = view.findViewById(R.id.tv_profile_name);
        tvEmail = view.findViewById(R.id.tv_profile_email);
        tvDiet = view.findViewById(R.id.tv_profile_diet);
        tvGoal = view.findViewById(R.id.tv_profile_goal);

        User user = sessionManager.getUserDetails();
        if (user != null) {
            tvName.setText(user.getFullName());
            tvEmail.setText(user.getEmail());
            tvDiet.setText(user.getDietaryPreference());
            tvGoal.setText(user.getFitnessGoal());
        }

        view.findViewById(R.id.btn_edit_profile).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), ProfileActivity.class)));
        view.findViewById(R.id.btn_bmi_calc).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), BmiActivity.class)));
        view.findViewById(R.id.btn_hydration).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), HydrationActivity.class)));
        view.findViewById(R.id.btn_fitness).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), FitnessActivity.class)));
        view.findViewById(R.id.btn_favorites).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), FavoritesActivity.class)));
        view.findViewById(R.id.btn_history).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), HistoryActivity.class)));
        view.findViewById(R.id.btn_settings).setOnClickListener(v ->
                startActivity(new Intent(requireContext(), SettingsActivity.class)));
        view.findViewById(R.id.btn_logout).setOnClickListener(v -> {
            sessionManager.logoutUser();
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }
}
