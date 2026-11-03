package com.nutriroute.app.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.nutriroute.app.models.User;

public class SessionManager {
    private static final String PREF_NAME = "NutriRouteSession";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";
    private static final String KEY_AUTH_TOKEN = "authToken";
    private static final String KEY_USER_DATA = "userData";
    private static final String KEY_THEME_DARK = "isDarkMode";

    private final SharedPreferences pref;
    private final SharedPreferences.Editor editor;
    private final Gson gson;

    public SessionManager(Context context) {
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = pref.edit();
        gson = new Gson();
    }

    public void createLoginSession(String token, User user) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_AUTH_TOKEN, token);
        editor.putString(KEY_USER_DATA, gson.toJson(user));
        editor.apply();
    }

    public boolean isLoggedIn() {
        return pref.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public String getAuthToken() {
        return pref.getString(KEY_AUTH_TOKEN, "");
    }

    public User getUserDetails() {
        String json = pref.getString(KEY_USER_DATA, null);
        if (json != null) {
            return gson.fromJson(json, User.class);
        }
        return null;
    }

    public void saveUser(User user) {
        editor.putString(KEY_USER_DATA, gson.toJson(user));
        editor.apply();
    }

    public void setDarkMode(boolean isDark) {
        editor.putBoolean(KEY_THEME_DARK, isDark);
        editor.apply();
    }

    public boolean isDarkMode() {
        return pref.getBoolean(KEY_THEME_DARK, false);
    }

    public void logoutUser() {
        editor.clear();
        editor.apply();
    }
}
