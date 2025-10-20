@echo off
echo ========================================
echo  Clinic Management System - Startup
echo ========================================
echo.
echo Starting Backend and Frontend Servers...
echo.

REM Change to the project directory
cd /d "%~dp0"

REM Start both servers using npm
npm run dev

pause
