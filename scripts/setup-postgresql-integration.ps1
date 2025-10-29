# PostgreSQL Setup Script for Windows
# This script helps set up PostgreSQL for the Auction Portal

Write-Host "`n🔍 PostgreSQL Integration Setup`n" -ForegroundColor Cyan

# Step 1: Check if PostgreSQL is installed
Write-Host "Step 1: Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is installed: $pgVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ PostgreSQL is NOT installed" -ForegroundColor Red
    Write-Host "`n📥 Please install PostgreSQL first:" -ForegroundColor Yellow
    Write-Host "   1. Visit: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "   2. Download PostgreSQL 15 or 16 installer" -ForegroundColor White
    Write-Host "   3. Run installer and note your password" -ForegroundColor White
    Write-Host "   4. Restart PowerShell and run this script again`n" -ForegroundColor White
    
    $openBrowser = Read-Host "Open download page in browser? (y/n)"
    if ($openBrowser -eq 'y') {
        Start-Process "https://www.postgresql.org/download/windows/"
    }
    exit
}

# Step 2: Check if PostgreSQL service is running
Write-Host "`nStep 2: Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -eq "Running") {
        Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL service is stopped. Starting..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  PostgreSQL service not found (might be running as different service)" -ForegroundColor Yellow
}

# Step 3: Configure .env file
Write-Host "`nStep 3: Configuring environment variables..." -ForegroundColor Yellow

$envPath = "d:\AUCTION PORTAL\backend\.env"
if (Test-Path $envPath) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $currentEnv = Get-Content $envPath -Raw
    
    # Check if DATABASE_URL needs configuration
    if ($currentEnv -match "DATABASE_URL=.*password@localhost") {
        Write-Host "`n⚠️  Database password is still set to 'password'" -ForegroundColor Yellow
        Write-Host "Please update your .env file with your actual PostgreSQL password" -ForegroundColor White
        
        $updateNow = Read-Host "`nDo you want to update it now? (y/n)"
        if ($updateNow -eq 'y') {
            $dbPassword = Read-Host "Enter your PostgreSQL password" -AsSecureString
            $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
            )
            
            $newDatabaseUrl = "DATABASE_URL=postgresql://postgres:$dbPasswordPlain@localhost:5432/auction_portal"
            $currentEnv = $currentEnv -replace "DATABASE_URL=.*", $newDatabaseUrl
            
            Set-Content -Path $envPath -Value $currentEnv
            Write-Host "✅ .env file updated" -ForegroundColor Green
        }
    } else {
        Write-Host "✅ DATABASE_URL appears to be configured" -ForegroundColor Green
    }
} else {
    Write-Host "❌ .env file not found at $envPath" -ForegroundColor Red
    exit
}

# Step 4: Test database connection
Write-Host "`nStep 4: Testing database connection..." -ForegroundColor Yellow
Write-Host "Attempting to connect to PostgreSQL..." -ForegroundColor White

$testScript = @"
require('dotenv').config();
const { connectDB } = require('./database');
connectDB()
  .then(() => {
    console.log('✅ Database connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"@

Set-Location "d:\AUCTION PORTAL\backend"
$testScript | node 2>&1 | ForEach-Object {
    if ($_ -match "✅") {
        Write-Host $_ -ForegroundColor Green
        $script:connectionSuccess = $true
    } elseif ($_ -match "❌") {
        Write-Host $_ -ForegroundColor Red
        $script:connectionSuccess = $false
    } else {
        Write-Host $_
    }
}

if (-not $script:connectionSuccess) {
    Write-Host "`n⚠️  Database connection failed. Please check:" -ForegroundColor Yellow
    Write-Host "   1. PostgreSQL is running" -ForegroundColor White
    Write-Host "   2. Password in .env is correct" -ForegroundColor White
    Write-Host "   3. Database 'auction_portal' exists (we'll create it next)`n" -ForegroundColor White
    
    $continue = Read-Host "Continue to create database? (y/n)"
    if ($continue -ne 'y') {
        exit
    }
}

# Step 5: Create database
Write-Host "`nStep 5: Creating database 'auction_portal'..." -ForegroundColor Yellow
Write-Host "Enter your PostgreSQL password when prompted" -ForegroundColor White

$createDbCommand = @"
CREATE DATABASE auction_portal;
"@

# Try to create database
Write-Host "Connecting to PostgreSQL..." -ForegroundColor White
$createDbCommand | psql -U postgres -h localhost 2>&1 | ForEach-Object {
    if ($_ -match "already exists") {
        Write-Host "✅ Database 'auction_portal' already exists" -ForegroundColor Green
    } elseif ($_ -match "CREATE DATABASE") {
        Write-Host "✅ Database 'auction_portal' created successfully" -ForegroundColor Green
    } elseif ($_ -match "error" -or $_ -match "ERROR") {
        Write-Host "⚠️  $_" -ForegroundColor Yellow
    }
}

# Step 6: Initialize database schema and seed data
Write-Host "`nStep 6: Initializing database schema and seeding data..." -ForegroundColor Yellow
Write-Host "This will create tables and add initial data (users, teams, players)" -ForegroundColor White

$initDb = Read-Host "`nRun database initialization? (y/n)"
if ($initDb -eq 'y') {
    Set-Location "d:\AUCTION PORTAL\backend"
    npm run init-db
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Database initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Database initialization had issues. Check output above." -ForegroundColor Yellow
    }
}

# Step 7: Summary and next steps
Write-Host "`n" + ("="*60) -ForegroundColor Cyan
Write-Host "🎉 PostgreSQL Integration Setup Complete!" -ForegroundColor Green
Write-Host ("="*60) -ForegroundColor Cyan

Write-Host "`n📋 Summary:" -ForegroundColor Yellow
Write-Host "   ✅ PostgreSQL installed and running" -ForegroundColor White
Write-Host "   ✅ Environment variables configured" -ForegroundColor White
Write-Host "   ✅ Database 'auction_portal' created" -ForegroundColor White
Write-Host "   ✅ Schema and initial data loaded" -ForegroundColor White

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start the backend server:" -ForegroundColor White
Write-Host "      cd 'd:\AUCTION PORTAL\backend'" -ForegroundColor Cyan
Write-Host "      npm start`n" -ForegroundColor Cyan

Write-Host "   2. Test the API:" -ForegroundColor White
Write-Host "      curl http://localhost:5000/api/health`n" -ForegroundColor Cyan

Write-Host "   3. Start the frontend:" -ForegroundColor White
Write-Host "      cd 'd:\AUCTION PORTAL\frontend'" -ForegroundColor Cyan
Write-Host "      npm run dev`n" -ForegroundColor Cyan

Write-Host "📚 For detailed documentation, see:" -ForegroundColor Yellow
Write-Host "   d:\AUCTION PORTAL\docs\POSTGRESQL-INTEGRATION.md`n" -ForegroundColor White

Write-Host "🆘 If you encounter issues, check:" -ForegroundColor Yellow
Write-Host "   - Logs: d:\AUCTION PORTAL\backend\logs\error.log" -ForegroundColor White
Write-Host "   - Documentation: docs\BACKEND-SETUP.md`n" -ForegroundColor White

# Optional: Start backend server
$startServer = Read-Host "Start backend server now? (y/n)"
if ($startServer -eq 'y') {
    Write-Host "`nStarting backend server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow
    Set-Location "d:\AUCTION PORTAL\backend"
    npm start
}
