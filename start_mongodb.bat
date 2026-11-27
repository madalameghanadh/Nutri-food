@echo off
title NutriRoute Local MongoDB Server
color 0A
cls
echo ========================================================
echo   NutriRoute Local MongoDB Server for MongoDB Compass
echo ========================================================
echo.
echo Starting MongoDB Server on port 27017...
echo Compass Connection URI: mongodb://127.0.0.1:27017/nutriroute
echo.
cd /d "%~dp0backend"
node start_mongodb.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start MongoDB Server.
)
pause
