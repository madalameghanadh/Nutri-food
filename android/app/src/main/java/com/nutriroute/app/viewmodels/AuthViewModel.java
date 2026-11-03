package com.nutriroute.app.viewmodels;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.nutriroute.app.models.AuthResponse;
import com.nutriroute.app.models.User;
import com.nutriroute.app.repository.NutriRepository;

public class AuthViewModel extends AndroidViewModel {

    private final NutriRepository repository;
    private final MutableLiveData<AuthResponse> authResponse = new MutableLiveData<>();

    public AuthViewModel(@NonNull Application application) {
        super(application);
        repository = new NutriRepository(application);
    }

    public LiveData<AuthResponse> getAuthResponse() {
        return authResponse;
    }

    public void login(String email, String password) {
        repository.login(email, password).observeForever(response -> {
            authResponse.setValue(response);
        });
    }

    public void register(User user) {
        repository.register(user).observeForever(response -> {
            authResponse.setValue(response);
        });
    }
}
