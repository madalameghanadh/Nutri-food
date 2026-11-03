package com.nutriroute.app.network;

import android.content.Context;

import com.nutriroute.app.storage.SessionManager;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {
    private final SessionManager sessionManager;

    public AuthInterceptor(Context context) {
        this.sessionManager = new SessionManager(context);
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request.Builder builder = chain.request().newBuilder();
        String token = sessionManager.getAuthToken();

        if (token != null && !token.isEmpty()) {
            builder.addHeader("Authorization", "Bearer " + token);
        }

        builder.addHeader("Accept", "application/json");
        builder.addHeader("Content-Type", "application/json");

        return chain.proceed(builder.build());
    }
}
