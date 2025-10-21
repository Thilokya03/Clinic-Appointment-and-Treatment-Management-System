@echo off
COLOR 0A
title Clinic Management System - Startup

echo.
echo ========================================
echo   CLINIC MANAGEMENT SYSTEM
echo   Automatic Startup Script
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

echo [1/3] Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo     Node.js: OK
echo.

echo [2/3] Checking if dependencies are installed...
if not exist "node_modules" (
    echo     Installing root dependencies...
    call npm install
)
if not exist "backend\node_modules" (
    echo     Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)
if not exist "frontend\node_modules" (
    echo     Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)
echo     Dependencies: OK
echo.

echo [3/3] Starting servers...
echo.
echo ========================================
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo   Login as Super Admin:
echo   Username: admin
echo   Password: admin123
echo.
echo   Press Ctrl+C to stop all servers
echo ========================================
echo.

REM Start both servers in background and wait for them to start
start "Backend Server" cmd /k "cd /d "%~dp0backend" && npm start"
start "Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Waiting for servers to start...
timeout /t 8 /nobreak >nul

REM Open frontend in default browser
echo Opening frontend in browser...
start http://localhost:5173

echo.
echo Both servers are running!
echo Press any key to stop all servers and exit...
pause >nul

REM Kill all node processes when user presses a key
taskkill /F /IM node.exe >nul 2>&1

exit /b 0
