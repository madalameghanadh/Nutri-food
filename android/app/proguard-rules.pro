# Add project specific ProGuard rules here.
# Keep Retrofit and Gson classes
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.nutriroute.app.models.** { *; }
-keep class com.nutriroute.app.network.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn retrofit2.**
