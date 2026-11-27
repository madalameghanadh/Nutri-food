@echo off
title NutriRoute - Install APK on Phone
color 0B
cls
echo ========================================================
echo         NutriRoute Android App - Phone Installer
echo ========================================================
echo.

set ADB="C:\Users\___megha___17\AppData\Local\Android\Sdk\platform-tools\adb.exe"

if not exist %ADB% (
    echo [ERROR] ADB not found at %ADB%
    pause
    exit /b 1
)

echo Checking for connected Android phone...
echo.
%ADB% devices
echo.

echo --------------------------------------------------------
echo NOTE: Make sure:
echo  1. Your phone is connected to this PC via USB cable.
echo  2. 'USB Debugging' is enabled in Developer Options.
echo  3. Tap 'Allow' on your phone screen if prompted.
echo --------------------------------------------------------
echo.
echo Installing NutriRoute.apk to your phone...
%ADB% install -r "%~dp0NutriRoute.apk"

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] NutriRoute App installed successfully on phone!
    echo ========================================================
    echo Launching app on your phone...
    %ADB% shell monkey -p com.nutriroute.app -c android.intent.category.LAUNCHER 1 >nul 2>&1
) else (
    echo.
    echo [FAILED] Could not install automatically.
    echo Please make sure your phone is connected and USB Debugging is ON.
)

echo.
pause
