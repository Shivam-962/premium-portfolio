@echo off
title Premium Portfolio & AI Resume Builder Launcher

echo ============================================================
echo   Starting Premium Portfolio & AI Resume Builder Locally...
echo ============================================================

:: Define Portable Node.js path
set "PORTABLE_NODE_PATH=C:\Users\HP\.gemini\antigravity\scratch\node-portable\node-v22.11.0-win-x64"

:: Validate portable Node path exists
if not exist "%PORTABLE_NODE_PATH%" (
    echo [ERROR] Portable Node.js was not found at:
    echo   %PORTABLE_NODE_PATH%
    echo Please make sure the path is correct.
    pause
    exit /b
)

echo [1/3] Starting Backend Server (Port 5000)...
start "Portfolio Backend API" cmd /k "set PATH=%PORTABLE_NODE_PATH%;%%PATH%% && cd backend && npm run dev"

echo [2/3] Starting Frontend Vite Server (Port 3000)...
start "Portfolio Frontend UI" cmd /k "set PATH=%PORTABLE_NODE_PATH%;%%PATH%% && cd frontend && npm run dev -- --host"

echo [3/3] Launching your browser to http://localhost:3000...
echo Waiting 5 seconds for servers to initialize...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo ============================================================
echo   Done! Both servers are now running in their own windows.
echo   - To stop the servers, simply close the terminal windows.
echo   - To restart either server, press Ctrl+C in its window.
echo ============================================================
pause
