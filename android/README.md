# NutriRoute Android Application

> **AI-Powered Health-Aware Food Recommendation System**  
> Native Android client for the NutriRoute web application backend.

---

## 📋 Project Overview

NutriRoute Android is a native Java application built for Android Studio that connects to the existing NutriRoute backend API. It provides:

- 🤖 **AI Food Recommendations** — Personalised food scores based on health profile
- 📅 **AI Meal Planner** — Auto-generated daily 5-meal plans
- 🔍 **Food Explorer** — Searchable database of 52+ foods with detailed nutrition facts
- ⚖️ **BMI Calculator** — Instant body mass index analysis
- 💧 **Hydration Tracker** — Daily water intake monitoring
- 🏃 **Fitness Tracker** — Steps, calories burned, active minutes logger
- ❤️ **Favorites** — Save preferred foods
- 📜 **History** — Recommendation history log
- 🤖 **NutriAI Chatbot** — Conversational nutrition assistant
- 👤 **Profile Management** — Full health profile editing
- 🌙 **Dark Mode** — System theme support

---

## 🏗️ Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/nutriroute/app/
│   │   │   ├── activities/          # All Activity classes
│   │   │   │   ├── SplashActivity.java
│   │   │   │   ├── LoginActivity.java
│   │   │   │   ├── RegisterActivity.java
│   │   │   │   ├── MainActivity.java
│   │   │   │   ├── FoodDetailsActivity.java
│   │   │   │   ├── BmiActivity.java
│   │   │   │   ├── HydrationActivity.java
│   │   │   │   ├── FitnessActivity.java
│   │   │   │   ├── NutritionActivity.java
│   │   │   │   ├── FavoritesActivity.java
│   │   │   │   ├── HistoryActivity.java
│   │   │   │   ├── ProfileActivity.java
│   │   │   │   └── SettingsActivity.java
│   │   │   ├── adapters/            # RecyclerView Adapters
│   │   │   │   ├── FoodAdapter.java
│   │   │   │   ├── MealPlanAdapter.java
│   │   │   │   └── HistoryAdapter.java
│   │   │   ├── fragments/           # Bottom-Nav Fragments
│   │   │   │   ├── DashboardFragment.java
│   │   │   │   ├── RecommendationsFragment.java
│   │   │   │   ├── ExplorerFragment.java
│   │   │   │   ├── MealPlannerFragment.java
│   │   │   │   └── ProfileFragment.java
│   │   │   ├── models/              # POJO data models
│   │   │   │   ├── User.java
│   │   │   │   ├── Food.java
│   │   │   │   ├── MealPlan.java
│   │   │   │   ├── WaterLog.java
│   │   │   │   ├── FitnessLog.java
│   │   │   │   ├── HistoryItem.java
│   │   │   │   ├── RecommendationResult.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── ChatRequest.java
│   │   │   ├── network/             # Retrofit networking layer
│   │   │   │   ├── ApiService.java
│   │   │   │   ├── RetrofitClient.java
│   │   │   │   └── AuthInterceptor.java
│   │   │   ├── repository/          # Data repository
│   │   │   │   └── NutriRepository.java
│   │   │   ├── storage/             # SharedPreferences session
│   │   │   │   └── SessionManager.java
│   │   │   ├── utils/               # Utilities
│   │   │   │   ├── Constants.java
│   │   │   │   └── BMICalculator.java
│   │   │   └── viewmodels/          # Architecture ViewModel
│   │   │       ├── AuthViewModel.java
│   │   │       └── FoodViewModel.java
│   │   ├── res/
│   │   │   ├── layout/              # XML layouts
│   │   │   ├── values/              # Colors, strings, themes, arrays
│   │   │   ├── drawable/            # Shape drawables
│   │   │   └── menu/                # Bottom nav menu
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
├── gradle.properties
├── API_INTEGRATION.md
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Android Studio** (Hedgehog or newer recommended)
- **JDK 8** or higher
- **NutriRoute backend running** on port 8080

### Step 1 — Start the Backend

Navigate to the NutriRoute web project root:

```bash
# Using Python (built-in simple HTTP server)
cd "NUTRI FOOD"
python -m http.server 8080

# OR using Node.js
npx serve . -p 8080
```

> The backend serves from `http://localhost:8080`

### Step 2 — Configure BASE_URL

Open [`Constants.java`](app/src/main/java/com/nutriroute/app/utils/Constants.java):

```java
// For Android Emulator connecting to localhost:8080 on developer PC:
public static final String BASE_URL = "http://10.0.2.2:8080/api/";

// For physical device over Wi-Fi (replace with your PC's local IP):
// public static final String BASE_URL = "http://192.168.1.10:8080/api/";
```

> **Why `10.0.2.2`?** Inside the Android Emulator, `localhost` and `127.0.0.1` refer to the virtual device itself. The special IP `10.0.2.2` maps to the host machine's loopback (`localhost`).

### Step 3 — Open in Android Studio

1. Open Android Studio
2. Click **Open** → select the `android/` folder
3. Let Gradle sync (takes ~2 minutes first time)
4. Click **▶ Run** on emulator or device

---

## 🔑 Demo Credentials

| Field | Value |
|---|---|
| Email | `demo@nutriroute.com` |
| Password | `Demo@123` |

Click **"⚡ Try Demo Account"** on the login screen to auto-fill.

---

## 📦 Dependencies

| Library | Version | Purpose |
|---|---|---|
| AndroidX AppCompat | 1.6.1 | Backward-compatible components |
| Material Components | 1.11.0 | Material Design UI |
| ConstraintLayout | 2.1.4 | Flexible layouts |
| RecyclerView | 1.3.2 | Scrollable lists |
| Lifecycle ViewModel | 2.6.2 | Architecture components |
| Retrofit 2 | 2.9.0 | REST API client |
| OkHttp 3 | 4.11.0 | HTTP client |
| Gson Converter | 2.9.0 | JSON serialisation |
| OkHttp Logging | 4.11.0 | API request/response logging |
| Glide | 4.16.0 | Image loading & caching |

---

## 🔗 API Documentation

See [`API_INTEGRATION.md`](API_INTEGRATION.md) for the complete API contract including all endpoints, request/response formats, and authentication details.

---

## 🏛️ Architecture

```
UI Layer (Activities / Fragments)
        ↓↑  LiveData observers
ViewModel Layer (AuthViewModel, FoodViewModel)
        ↓↑  Calls & returns LiveData
Repository Layer (NutriRepository)
        ↓↑  Retrofit Calls
Network Layer (ApiService + RetrofitClient + AuthInterceptor)
        ↓↑  HTTP over Wi-Fi / Loopback
NutriRoute Backend (localhost:8080/api/)
```

---

## 📱 Screens

| Screen | Description |
|---|---|
| Splash | App logo with auto-login check |
| Login | Email/password form with demo shortcut |
| Register | Full health profile registration |
| Dashboard | BMI, water, calories, steps + top picks |
| AI Recommendations | Filtered, sorted AI food matches |
| Food Explorer | Full food database search grid |
| Food Details | Nutrition facts, ingredients, benefits, FAB favorite |
| Meal Planner | AI-generated 5-meal daily plan with totals |
| BMI Calculator | Weight + height → BMI + category |
| Hydration Tracker | Water progress + +250ml/+500ml buttons |
| Fitness Tracker | Steps/calories/minutes log form |
| Favorites | Saved foods grid |
| History | Recommendation history list |
| Profile (Edit) | Full health profile editor |
| Settings | Dark mode toggle, about, sign out |
| NutriAI Chat | Conversational AI nutrition assistant |

---

## ⚠️ Notes

- The app requires the NutriRoute backend to be running and accessible at the configured `BASE_URL`.
- All API calls use `cleartext` traffic (`android:usesCleartextTraffic="true"`) for local HTTP development. For production, use HTTPS and remove that flag.
- User sessions are stored in SharedPreferences and persist across app restarts.

---

*NutriRoute — Your Smart Route to Better Nutrition* 🥗
