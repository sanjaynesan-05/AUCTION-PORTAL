# 🚀 Install All Dependencies - IPL Auction Portal
# This script installs all dependencies for both frontend and backend

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  IPL Auction Portal - Setup" -ForegroundColor Cyan
Write-Host "  Installing All Dependencies" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version 2>$null
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath

# Install Backend Dependencies
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $rootPath "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "📦 Installing backend packages..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  Backend directory not found!" -ForegroundColor Yellow
}
Write-Host ""

# Install Frontend Dependencies
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $rootPath "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "📦 Installing frontend packages..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install frontend dependencies!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  Frontend directory not found!" -ForegroundColor Yellow
}
Write-Host ""

# Return to root directory
Set-Location $rootPath

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Installation Complete! 🎉" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ All dependencies have been installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Setup PostgreSQL database:" -ForegroundColor White
Write-Host "     .\setup-postgresql.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Initialize the database:" -ForegroundColor White
Write-Host "     cd backend" -ForegroundColor Cyan
Write-Host "     npm run init-db" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Start the application:" -ForegroundColor White
Write-Host "     .\scripts\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see README.md" -ForegroundColor Gray
Write-Host ""
