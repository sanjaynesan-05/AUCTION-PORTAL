# 🚀 Start All - IPL Auction Portal
# This script starts both frontend and backend servers concurrently

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  IPL Auction Portal - Launcher" -ForegroundColor Cyan
Write-Host "  Starting Frontend & Backend" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL status..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq 'Running'}

if ($pgService) {
    Write-Host "✅ PostgreSQL is running ($($pgService.Name))" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostgreSQL service not found or not running!" -ForegroundColor Yellow
    Write-Host "   Please ensure PostgreSQL is installed and running." -ForegroundColor Gray
    Write-Host "   Or use Docker: docker run --name auction-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=auction_portal -p 5432:5432 -d postgres:15" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
}
Write-Host ""

# Check if backend is configured
$backendEnv = Join-Path $rootPath "backend\.env"
if (-not (Test-Path $backendEnv)) {
    Write-Host "⚠️  Backend .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please run: .\setup-postgresql.ps1" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Starting Servers..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to start backend
$backendScript = {
    param($backendPath)
    Set-Location $backendPath
    Write-Host ""
    Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Magenta
    Write-Host ""
    npm run dev
}

# Function to start frontend
$frontendScript = {
    param($frontendPath)
    Set-Location $frontendPath
    Start-Sleep -Seconds 3  # Wait for backend to start
    Write-Host ""
    Write-Host "🎨 Starting Frontend Server (Port 5173)..." -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}

# Start backend in a new window
$backendPath = Join-Path $rootPath "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$backendPath'; Write-Host '🚀 Backend Server' -ForegroundColor Magenta; Write-Host ''; npm run dev}"

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start frontend in a new window
$frontendPath = Join-Path $rootPath "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$frontendPath'; Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; Write-Host ''; npm run dev}"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Servers Starting! 🚀" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend and frontend are starting in separate windows..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your application will be available at:" -ForegroundColor White
Write-Host "  Frontend: " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5000" -ForegroundColor Magenta
Write-Host ""
Write-Host "Default login credentials:" -ForegroundColor White
Write-Host "  Username: " -NoNewline -ForegroundColor Gray
Write-Host "admin" -ForegroundColor Yellow
Write-Host "  Password: " -NoNewline -ForegroundColor Gray
Write-Host "admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers." -ForegroundColor Gray
Write-Host ""
