# PostgreSQL Integration - Quick Setup Script
# Run this to check and setup PostgreSQL step by step

Write-Host "`n===========================================================" -ForegroundColor Cyan
Write-Host " PostgreSQL Integration Setup for Auction Portal" -ForegroundColor Cyan
Write-Host "===========================================================`n" -ForegroundColor Cyan

# Step 1: Check PostgreSQL installation
Write-Host "[Step 1/6] Checking PostgreSQL installation..." -ForegroundColor Yellow

$pgInstalled = $false
try {
    $null = Get-Command psql -ErrorAction Stop
    $pgVersion = (psql --version 2>&1) | Out-String
    Write-Host "SUCCESS: PostgreSQL is installed" -ForegroundColor Green
    Write-Host "         Version: $($pgVersion.Trim())" -ForegroundColor Gray
    $pgInstalled = $true
}
catch {
    Write-Host "NOT FOUND: PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "`nPlease install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "  Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  Install PostgreSQL 15 or 16" -ForegroundColor White
    Write-Host "  Remember your postgres user password!`n" -ForegroundColor White
    
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check PostgreSQL service
Write-Host "`n[Step 2/6] Checking PostgreSQL service status..." -ForegroundColor Yellow

$services = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue
if ($services) {
    $runningService = $services | Where-Object { $_.Status -eq 'Running' }
    if ($runningService) {
        Write-Host "SUCCESS: PostgreSQL service is running" -ForegroundColor Green
        Write-Host "         Service: $($runningService.Name)" -ForegroundColor Gray
    }
    else {
        Write-Host "WARNING: PostgreSQL service exists but not running" -ForegroundColor Yellow
        Write-Host "         Attempting to start..." -ForegroundColor Gray
        try {
            Start-Service $services[0].Name
            Write-Host "SUCCESS: PostgreSQL service started" -ForegroundColor Green
        }
        catch {
            Write-Host "ERROR: Could not start PostgreSQL service" -ForegroundColor Red
            Write-Host "       Please start it manually from Services app" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "INFO: PostgreSQL service not found by name pattern" -ForegroundColor Yellow
    Write-Host "      This might be okay if PostgreSQL is running differently" -ForegroundColor Gray
}

# Step 3: Check .env configuration
Write-Host "`n[Step 3/6] Checking environment configuration..." -ForegroundColor Yellow

$envPath = Join-Path $PSScriptRoot "..\backend\.env"
if (Test-Path $envPath) {
    Write-Host "SUCCESS: .env file found" -ForegroundColor Green
    
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "DATABASE_URL=postgresql://([^:]+):([^@]+)@([^/]+)/(.+)") {
        $dbUser = $matches[1]
        $dbPassword = $matches[2]
        $dbHost = $matches[3]
        $dbName = $matches[4]
        
        Write-Host "         Database: $dbName" -ForegroundColor Gray
        Write-Host "         Host: $dbHost" -ForegroundColor Gray
        Write-Host "         User: $dbUser" -ForegroundColor Gray
        
        if ($dbPassword -eq "password") {
            Write-Host "WARNING: Using default password 'password'" -ForegroundColor Yellow
            Write-Host "         Please update .env with your actual PostgreSQL password" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "ERROR: .env file not found at $envPath" -ForegroundColor Red
    exit 1
}

# Step 4: Test database connection
Write-Host "`n[Step 4/6] Testing database connection..." -ForegroundColor Yellow

Push-Location (Join-Path $PSScriptRoot "..\backend")
try {
    $testResult = node -e "require('dotenv').config(); const {connectDB} = require('./database'); connectDB().then(() => console.log('SUCCESS')).catch(err => console.log('ERROR:' + err.message));" 2>&1
    
    if ($testResult -match "SUCCESS") {
        Write-Host "SUCCESS: Connected to PostgreSQL!" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Could not connect to database" -ForegroundColor Red
        Write-Host "       $testResult" -ForegroundColor Gray
        Write-Host "`nCommon fixes:" -ForegroundColor Yellow
        Write-Host "  1. Check PostgreSQL password in .env file" -ForegroundColor White
        Write-Host "  2. Ensure PostgreSQL service is running" -ForegroundColor White
        Write-Host "  3. Verify database exists (we'll try to create it next)" -ForegroundColor White
    }
}
finally {
    Pop-Location
}

# Step 5: Create database
Write-Host "`n[Step 5/6] Creating database 'auction_portal'..." -ForegroundColor Yellow
Write-Host "You may be prompted for PostgreSQL password" -ForegroundColor Gray

$createDb = @"
SELECT 'CREATE DATABASE auction_portal' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auction_portal')\gexec
"@

try {
    $result = $createDb | psql -U postgres -h localhost 2>&1
    if ($result -match "CREATE DATABASE" -or $result -match "already exists") {
        Write-Host "SUCCESS: Database 'auction_portal' is ready" -ForegroundColor Green
    }
    else {
        Write-Host "INFO: $result" -ForegroundColor Gray
    }
}
catch {
    Write-Host "ERROR: Could not create database" -ForegroundColor Red
    Write-Host "       You can create it manually in pgAdmin or psql" -ForegroundColor Yellow
}

# Step 6: Initialize database
Write-Host "`n[Step 6/6] Initializing database schema and seed data..." -ForegroundColor Yellow

$response = Read-Host "Do you want to initialize the database now? This will create tables and add sample data (y/n)"

if ($response -eq 'y') {
    Push-Location (Join-Path $PSScriptRoot "..\backend")
    try {
        Write-Host "Running: npm run init-db..." -ForegroundColor Gray
        npm run init-db
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nSUCCESS: Database initialized!" -ForegroundColor Green
        }
        else {
            Write-Host "`nWARNING: Database initialization had issues" -ForegroundColor Yellow
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "SKIPPED: You can run 'npm run init-db' later" -ForegroundColor Yellow
}

# Summary
Write-Host "`n===========================================================" -ForegroundColor Cyan
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "===========================================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start backend:  cd backend && npm start" -ForegroundColor White
Write-Host "  2. Test API:       curl http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  3. Start frontend: cd frontend && npm run dev`n" -ForegroundColor White

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  Full guide: docs\POSTGRESQL-INTEGRATION.md`n" -ForegroundColor White

Read-Host "Press Enter to exit"
