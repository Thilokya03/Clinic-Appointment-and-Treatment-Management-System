# Clinic Management System - Startup Script
# PowerShell version

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CLINIC MANAGEMENT SYSTEM" -ForegroundColor Green
Write-Host "  Automatic Startup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Check Node.js
Write-Host "[1/3] Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "    Node.js: OK ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host "    ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "    Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check dependencies
Write-Host "[2/3] Checking if dependencies are installed..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "    Installing root dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "    Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "    Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "    Dependencies: OK" -ForegroundColor Green
Write-Host ""

# Start servers
Write-Host "[3/3] Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Login as Super Admin:" -ForegroundColor Yellow
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run development servers
npm run dev
