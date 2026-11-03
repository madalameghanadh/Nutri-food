package com.nutriroute.app.models;

import java.io.Serializable;

public class ChatRequest implements Serializable {
    private String message;

    public ChatRequest() {}

    public ChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
