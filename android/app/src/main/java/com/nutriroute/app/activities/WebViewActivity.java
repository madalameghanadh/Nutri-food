package com.nutriroute.app.activities;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.nutriroute.app.R;

public class WebViewActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private LinearLayout errorLayout;
    private FrameLayout webViewContainer;

    // File upload callback
    private ValueCallback<Uri[]> fileUploadCallback;
    private ActivityResultLauncher<Intent> fileChooserLauncher;

    // Website Base URL — change this to your deployed server URL when hosting remotely
    private static final String BASE_URL = "http://192.168.1.18:5000";
    // Entry page for mobile app: bypasses landing page, starts at login
    private static final String ENTRY_URL = BASE_URL + "/login.html";

    /*
     * For physical device testing over Wi-Fi, use your PC's local IP:
     * private static final String BASE_URL = "http://192.168.1.XXX:5000";
     *
     * For production deployment:
     * private static final String BASE_URL = "https://your-deployed-url.com";
     */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);

        // Make status bar match the app theme
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.primary_dark));

        initViews();
        initFileChooserLauncher();
        setupWebView();
        setupSwipeRefresh();

        if (isNetworkAvailable()) {
            loadWebsite();
        } else {
            showErrorScreen();
        }
    }

    private void initViews() {
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        errorLayout = findViewById(R.id.errorLayout);
        webViewContainer = findViewById(R.id.webViewContainer);

        // Retry button in error screen
        findViewById(R.id.btnRetry).setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                hideErrorScreen();
                loadWebsite();
            }
        });
    }

    private void initFileChooserLauncher() {
        fileChooserLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (fileUploadCallback == null) return;

                    Uri[] results = null;
                    if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                        String dataString = result.getData().getDataString();
                        if (dataString != null) {
                            results = new Uri[]{Uri.parse(dataString)};
                        }
                    }
                    fileUploadCallback.onReceiveValue(results);
                    fileUploadCallback = null;
                });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript (required for the website)
        webSettings.setJavaScriptEnabled(true);

        // Enable DOM storage for localStorage/sessionStorage
        webSettings.setDomStorageEnabled(true);

        // Enable database storage
        webSettings.setDatabaseEnabled(true);

        // Enable caching for offline support
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Allow mixed content (HTTP images on HTTPS pages)
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Enable zoom controls
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);

        // Responsive viewport
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);

        // Allow file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);

        // Enable cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // User agent — identify as mobile app
        String defaultUA = webSettings.getUserAgentString();
        webSettings.setUserAgentString(defaultUA + " NutriRouteApp/1.0");

        // WebViewClient — handles page navigation within the app
        webView.setWebViewClient(new WebViewClient() {

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);

                // Inject CSS to hide scrollbars and optimize for mobile
                String mobileOptimizations = "javascript:(function(){" +
                        "var meta = document.querySelector('meta[name=viewport]');" +
                        "if(!meta){" +
                        "  meta = document.createElement('meta');" +
                        "  meta.name = 'viewport';" +
                        "  document.head.appendChild(meta);" +
                        "}" +
                        "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';" +
                        "})()";
                view.evaluateJavascript(mobileOptimizations, null);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String url = uri.toString();

                // If URL points to the landing page ("/" or "/index.html"),
                // redirect straight to login.html to keep landing page hidden in the mobile app
                String path = uri.getPath();
                if (path == null || path.isEmpty() || path.equals("/") || path.endsWith("/index.html")) {
                    view.loadUrl(ENTRY_URL);
                    return true;
                }

                // Keep website navigation within the WebView
                if (url.startsWith(BASE_URL) || url.startsWith("http://192.168.1.18:5000") || url.startsWith("http://localhost:5000") || url.startsWith("http://10.0.2.2:5000")) {
                    return false; // Load in WebView
                }

                // External links (e.g., social media, maps) — open in browser
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                // Only show error for main frame (not sub-resources like images)
                if (request.isForMainFrame()) {
                    showErrorScreen();
                }
            }
        });

        // WebChromeClient — handles file uploads, progress, etc.
        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }

            // Handle file input (e.g., profile photo upload)
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback,
                                             FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = callback;

                Intent intent = fileChooserParams.createIntent();
                fileChooserLauncher.launch(intent);
                return true;
            }
        });

        // Enable hardware acceleration
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Allow back gesture within webview
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
    }

    private void setupSwipeRefresh() {
        swipeRefreshLayout.setColorSchemeColors(
                ContextCompat.getColor(this, R.color.primary),
                ContextCompat.getColor(this, R.color.secondary),
                ContextCompat.getColor(this, R.color.accent)
        );
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isNetworkAvailable()) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
                showErrorScreen();
            }
        });

        // Only enable pull-to-refresh when at the top of the page
        swipeRefreshLayout.setOnChildScrollUpCallback((parent, child) ->
                webView.getScrollY() > 0
        );
    }

    private void loadWebsite() {
        webView.loadUrl(ENTRY_URL);
    }

    private void showErrorScreen() {
        progressBar.setVisibility(View.GONE);
        webViewContainer.setVisibility(View.GONE);
        errorLayout.setVisibility(View.VISIBLE);
    }

    private void hideErrorScreen() {
        errorLayout.setVisibility(View.GONE);
        webViewContainer.setVisibility(View.VISIBLE);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnected();
        }
        return false;
    }

    @Override
    public void onBackPressed() {
        String currentUrl = webView.getUrl();
        // If user is on the login page, back exits the app
        if (currentUrl != null && (currentUrl.endsWith("/login.html") || currentUrl.contains("login.html?"))) {
            super.onBackPressed();
            return;
        }

        // Navigate back within the WebView if possible
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
