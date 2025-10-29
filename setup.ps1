# IPL Auction Portal - Complete Setup Script

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "IPL AUCTION PORTAL - SETUP" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Check if in correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the AUCTION PORTAL root directory" -ForegroundColor Red
    exit 1
}

# Step 1: Check Node.js
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}

# Step 2: Install Backend Dependencies
Write-Host "[2/6] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend npm install failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Backend dependencies installed`n" -ForegroundColor Green

# Step 3: Initialize Database
Write-Host "[3/6] Initializing database..." -ForegroundColor Yellow
npm run init-db
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database initialization had issues, continuing...`n" -ForegroundColor Yellow
} else {
    Write-Host "✅ Database initialized`n" -ForegroundColor Green
}

# Step 4: Create Presenter Account
Write-Host "[4/6] Creating presenter account..." -ForegroundColor Yellow
node create-presenter.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Presenter creation had issues, continuing...`n" -ForegroundColor Yellow
} else {
    Write-Host "✅ Presenter account ready`n" -ForegroundColor Green
}

# Step 5: Create Viewer Accounts
Write-Host "[5/6] Creating viewer accounts for all teams..." -ForegroundColor Yellow
node scripts/assign-teams-to-viewers.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Viewer creation had issues, continuing...`n" -ForegroundColor Yellow
} else {
    Write-Host "✅ Viewer accounts created`n" -ForegroundColor Green
}

# Step 6: Install Frontend Dependencies
Write-Host "[6/6] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Frontend dependencies installed`n" -ForegroundColor Green

Set-Location ..

# Summary
Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "===================================`n" -ForegroundColor Cyan

Write-Host "📋 Available Accounts:" -ForegroundColor Cyan
Write-Host "   Admin:     admin / admin123" -ForegroundColor White
Write-Host "   Presenter: presenter / presenter123" -ForegroundColor White
Write-Host "   Viewers:   teamname_owner / password123" -ForegroundColor White
Write-Host "   Example:   csk_owner / password123`n" -ForegroundColor Gray

Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host "   .\start-servers.ps1`n" -ForegroundColor White

Write-Host "Or manually:" -ForegroundColor Cyan
Write-Host "   Backend:  cd backend; npm start" -ForegroundColor White
Write-Host "   Frontend: cd frontend; npm run dev`n" -ForegroundColor White

Write-Host "📖 Full credentials: CREDENTIALS.md`n" -ForegroundColor Cyan
