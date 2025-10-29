# IPL Auction Portal - PostgreSQL Setup Helper
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   IPL Auction Portal - PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "❌ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation options:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Or use Docker: docker run --name auction-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=auction_portal -p 5432:5432 -d postgres:15" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($psqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL service is running
Write-Host "Checking PostgreSQL service status..." -ForegroundColor Yellow
$service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL service is stopped" -ForegroundColor Yellow
        Write-Host "Attempting to start..." -ForegroundColor Yellow
        try {
            Start-Service $service.Name
            Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to start service: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Please start it manually using Services or pgAdmin" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  PostgreSQL service not found (might be running via Docker)" -ForegroundColor Yellow
}

Write-Host ""

# Prompt for database details
Write-Host "Database Configuration" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

$dbUser = Read-Host "PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "PostgreSQL password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

$dbHost = Read-Host "PostgreSQL host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbPort = Read-Host "PostgreSQL port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "5432"
}

$dbName = Read-Host "Database name (default: auction_portal)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "auction_portal"
}

Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $dbPasswordPlain

# Test connection
try {
    $result = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -c "SELECT version();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!" -ForegroundColor Green
        Write-Host ""
        
        # Check if database exists
        Write-Host "Checking if database '$dbName' exists..." -ForegroundColor Yellow
        $dbCheck = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName';"
        
        if ($dbCheck -eq "1") {
            Write-Host "✅ Database '$dbName' already exists" -ForegroundColor Green
        } else {
            Write-Host "Creating database '$dbName'..." -ForegroundColor Yellow
            $createDb = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -c "CREATE DATABASE $dbName;"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Database '$dbName' created successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to create database" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        
        # Update .env file
        Write-Host "Updating server/.env file..." -ForegroundColor Yellow
        $envPath = ".\server\.env"
        
        if (Test-Path $envPath) {
            $databaseUrl = "DATABASE_URL=postgresql://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/${dbName}"
            
            $envContent = Get-Content $envPath
            $newContent = @()
            $found = $false
            
            foreach ($line in $envContent) {
                if ($line -match "^DATABASE_URL=") {
                    $newContent += $databaseUrl
                    $found = $true
                } else {
                    $newContent += $line
                }
            }
            
            if (-not $found) {
                $newContent = @($databaseUrl) + $newContent
            }
            
            $newContent | Set-Content $envPath
            Write-Host "✅ .env file updated" -ForegroundColor Green
        } else {
            Write-Host "⚠️  .env file not found at $envPath" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Run: cd server" -ForegroundColor White
        Write-Host "2. Run: npm install" -ForegroundColor White
        Write-Host "3. Run: npm run init-db" -ForegroundColor White
        Write-Host "4. Run: npm start" -ForegroundColor White
        Write-Host ""
        Write-Host "Default admin credentials:" -ForegroundColor Yellow
        Write-Host "Username: admin" -ForegroundColor White
        Write-Host "Password: admin123" -ForegroundColor White
        
    } else {
        Write-Host "❌ Connection failed: $result" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "1. PostgreSQL is running" -ForegroundColor White
        Write-Host "2. Username and password are correct" -ForegroundColor White
        Write-Host "3. Host and port are correct" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Connection failed: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host ""
Read-Host "Press Enter to exit"
