# NutriRoute Android API Integration Contract

## Overview

The NutriRoute Android app communicates with the **existing NutriRoute web application backend** via RESTful HTTP/JSON APIs. No new backend is created — the Android app is a native client for the existing system.

---

## Base URL Configuration

| Environment | BASE_URL |
|---|---|
| Android Emulator (connects to localhost on dev machine) | `http://10.0.2.2:8080/api/` |
| Physical Device on same Wi-Fi | `http://192.168.X.X:8080/api/` |
| Production/Hosted | `https://your-domain.com/api/` |

> **Important:** Edit `Constants.java` → `BASE_URL` to change the target server.

---

## Authentication

All authenticated endpoints require a **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

The token is injected automatically by `AuthInterceptor.java` from `SessionManager`.

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/login` | Login with email + password | No |
| POST | `/auth/register` | Register new user | No |

**Login Request Body:**
```json
{
  "email": "demo@nutriroute.com",
  "password": "Demo@123"
}
```

**Auth Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "fullName": "Demo User",
    "email": "demo@nutriroute.com",
    "age": 28,
    "gender": "Male",
    "height": 175.0,
    "weight": 70.0,
    "activityLevel": "Moderately Active",
    "dietaryPreference": "Vegetarian",
    "fitnessGoal": "Maintain Weight",
    "favoriteCuisine": "Indian"
  }
}
```

---

### User Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/profile` | Get logged-in user profile |
| PUT | `/user/profile` | Update user profile |

---

### Food Database

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/foods` | `category`, `query` | List all foods with optional filters |
| GET | `/foods/{id}` | — | Get single food by ID |

**Food Object:**
```json
{
  "id": "001",
  "name": "Masoor Dal",
  "category": "Lunch",
  "cuisine": "Indian",
  "diet": "Vegan",
  "calories": 230,
  "protein": 18,
  "carbs": 40,
  "fat": 1,
  "fiber": 16,
  "sugar": 2,
  "sodium": 280,
  "tags": ["high-protein", "high-fiber"],
  "allergens": [],
  "ingredients": ["Red Lentils", "Onion", "Tomato", "Turmeric"],
  "benefits": ["Excellent plant-based protein", "Heart-healthy"],
  "image": "https://example.com/masoor-dal.jpg"
}
```

---

### AI Recommendations

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/recommendations` | `category`, `tag`, `sortBy` | Get AI-scored food recommendations for logged-in user |

**Recommendation Result:**
```json
{
  "food": { /* Food object */ },
  "matchScore": 92,
  "whyRecommended": [
    "Matches your vegetarian diet",
    "Supports your goal of Maintain Weight",
    "High fiber content"
  ],
  "warning": null
}
```

---

### Meal Planner

| Method | Endpoint | Description |
|---|---|---|
| GET | `/meal-plan/generate` | Generate AI personalized daily meal plan |

**Meal Plan Response:**
```json
{
  "breakfast": { /* Food object */ },
  "morningSnack": { /* Food object */ },
  "lunch": { /* Food object */ },
  "eveningSnack": { /* Food object */ },
  "dinner": { /* Food object */ }
}
```

---

### Favorites

| Method | Endpoint | Description |
|---|---|---|
| GET | `/favorites` | Get user's favorite foods list |
| POST | `/favorites/toggle/{id}` | Toggle favorite (add/remove) |

---

### Recommendation History

| Method | Endpoint | Description |
|---|---|---|
| GET | `/history` | Get recommendation history |

**History Item:**
```json
{
  "date": "2024-01-15",
  "foodName": "Masoor Dal",
  "category": "Lunch",
  "matchScore": 92,
  "reason": "Matches vegetarian diet and goal"
}
```

---

### Hydration Tracker

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/hydration` | — | Get today's water log |
| POST | `/hydration/add` | `ml=250` | Add water intake in ml |
| POST | `/hydration/reset` | — | Reset today's log |

**WaterLog Response:**
```json
{
  "currentLiters": 1.8,
  "targetLiters": 2.5,
  "percentage": 72
}
```

---

### Fitness Tracker

| Method | Endpoint | Description |
|---|---|---|
| GET | `/fitness` | Get today's fitness log |
| POST | `/fitness/log` | Save fitness log |

**FitnessLog Object:**
```json
{
  "steps": 8000,
  "caloriesBurned": 420,
  "activeMinutes": 55,
  "sessions": 1
}
```

---

### NutriAI Chatbot

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chatbot/ask` | Send message to NutriAI assistant |

**Request:**
```json
{ "message": "What foods are good for weight loss?" }
```

**Response:**
```json
{
  "success": true,
  "message": "OK",
  "data": "Great question! For weight loss, consider high-fiber, protein-rich foods like dal, oats, and salads..."
}
```

---

## Error Handling

All API errors return:
```json
{
  "success": false,
  "message": "Error description here"
}
```

HTTP status codes follow REST conventions: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`.
