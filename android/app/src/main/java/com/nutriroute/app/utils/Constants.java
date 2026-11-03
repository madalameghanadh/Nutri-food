package com.nutriroute.app.utils;

public class Constants {
    /**
     * BASE_URL for API communication.
     * Note for Android Emulator: Use "http://10.0.2.2:8080/api/" to connect to localhost:8080 on developer machine.
     * For physical device over Wi-Fi: Replace with developer PC local IP (e.g. "http://192.168.1.10:8080/api/").
     */
    public static final String BASE_URL = "http://10.0.2.2:8080/api/";

    public static final String DEMO_EMAIL = "demo@nutriroute.com";
    public static final String DEMO_PASSWORD = "Demo@123";

    public static final String EXTRA_FOOD_ITEM = "extra_food_item";
    public static final String EXTRA_FOOD_ID = "extra_food_id";
}
