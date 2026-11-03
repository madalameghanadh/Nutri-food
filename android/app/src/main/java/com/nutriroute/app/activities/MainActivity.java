package com.nutriroute.app.activities;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.nutriroute.app.R;
import com.nutriroute.app.fragments.DashboardFragment;
import com.nutriroute.app.fragments.ExplorerFragment;
import com.nutriroute.app.fragments.MealPlannerFragment;
import com.nutriroute.app.fragments.ProfileFragment;
import com.nutriroute.app.fragments.RecommendationsFragment;
import com.nutriroute.app.storage.SessionManager;

public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNav;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sessionManager = new SessionManager(this);
        if (!sessionManager.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        bottomNav = findViewById(R.id.bottom_navigation);

        // Load default fragment
        loadFragment(new DashboardFragment());

        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                loadFragment(new DashboardFragment());
            } else if (id == R.id.nav_recommendations) {
                loadFragment(new RecommendationsFragment());
            } else if (id == R.id.nav_explorer) {
                loadFragment(new ExplorerFragment());
            } else if (id == R.id.nav_planner) {
                loadFragment(new MealPlannerFragment());
            } else if (id == R.id.nav_profile) {
                loadFragment(new ProfileFragment());
            }
            return true;
        });
    }

    private void loadFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .commit();
    }
}
