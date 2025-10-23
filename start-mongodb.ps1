# IPL Auction Portal - MongoDB Setup Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   IPL Auction Portal - MongoDB Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
$mongoPath = Get-Command mongod -ErrorAction SilentlyContinue
if (-not $mongoPath) {
    Write-Host "❌ MongoDB is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MongoDB:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "2. Install and add to PATH" -ForegroundColor White
    Write-Host "3. Or use MongoDB Atlas (cloud)" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ MongoDB found at: $($mongoPath.Source)" -ForegroundColor Green
Write-Host ""

# Create data directory if it doesn't exist
$dataDir = "C:\data\db"
$logDir = "C:\data\log"

if (-not (Test-Path $dataDir)) {
    Write-Host "Creating data directory: $dataDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

if (-not (Test-Path $logDir)) {
    Write-Host "Creating log directory: $logDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host ""
Write-Host "Starting MongoDB..." -ForegroundColor Green
Write-Host "Note: This will start MongoDB in the foreground." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop MongoDB when done." -ForegroundColor Yellow
Write-Host ""

try {
    & mongod --dbpath $dataDir --logpath "$logDir\mongod.log"
} catch {
    Write-Host "❌ Failed to start MongoDB: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "MongoDB stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"