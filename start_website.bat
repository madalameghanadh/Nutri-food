@echo off
title NutriRoute Web Application Launcher
color 0A
cd /d "%~dp0"
echo ======================================================================
echo              🍃 STARTING NUTRIRoute AI WEB APPLICATION
echo ======================================================================
echo.
echo [1/2] Opening browser at http://localhost:5000 ...
start http://localhost:5000
echo.
echo [2/2] Starting Node.js backend server on port 5000...
echo (Keep this window open while using the website)
echo.
node backend/server.js
pause
