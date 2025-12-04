# Test Render Backend API Integration
$BASE_URL = "https://auction-portal-7bds.onrender.com"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testing Render Backend API" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n[TEST 1] Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/health" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health Check: $($data.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}

# Test 2: Root Endpoint
Write-Host "`n[TEST 2] Root Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ API Message: $($data.message)" -ForegroundColor Green
    Write-Host "✅ API Version: $($data.version)" -ForegroundColor Green
} catch {
    Write-Host "❌ Root Endpoint Failed: $_" -ForegroundColor Red
}

# Test 3: Login with admin credentials
Write-Host "`n[TEST 3] Login API" -ForegroundColor Yellow
try {
    $loginData = @{
        username = "admin"
        password = "Admin@123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/auth/login" -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginData
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login Successful" -ForegroundColor Green
    Write-Host "   Token: $($data.access_token.Substring(0,20))..." -ForegroundColor Green
    Write-Host "   User: $($data.user.username) (Role: $($data.user.role))" -ForegroundColor Green
    
    # Store token for next tests
    $global:token = $data.access_token
} catch {
    Write-Host "❌ Login Failed: $_" -ForegroundColor Red
}

# Test 4: Get Players
Write-Host "`n[TEST 4] Get Players" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/players" -Method GET -Headers $headers
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Players Retrieved: $($data.Count) players found" -ForegroundColor Green
    $data | ForEach-Object { Write-Host "   - $($_.name) (ID: $($_.id))" -ForegroundColor Green }
} catch {
    Write-Host "❌ Get Players Failed: $_" -ForegroundColor Red
}

# Test 5: Get Teams
Write-Host "`n[TEST 5] Get Teams" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/teams" -Method GET -Headers $headers
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Teams Retrieved: $($data.Count) teams found" -ForegroundColor Green
    $data | ForEach-Object { Write-Host "   - $($_.name) (Budget: ₹$($_.purse)Cr)" -ForegroundColor Green }
} catch {
    Write-Host "❌ Get Teams Failed: $_" -ForegroundColor Red
}

# Test 6: Get Auction State
Write-Host "`n[TEST 6] Get Auction State" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/auction/state" -Method GET -Headers $headers
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Auction State Retrieved" -ForegroundColor Green
    Write-Host "   Status: $($data.is_started)" -ForegroundColor Green
    Write-Host "   Current Player: $($data.current_player_id)" -ForegroundColor Green
    Write-Host "   Current Bid: ₹$($data.current_bid)Cr" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Auction State Failed: $_" -ForegroundColor Red
}

# Test 7: Swagger/API Docs
Write-Host "`n[TEST 7] API Documentation" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/docs" -Method GET
    Write-Host "✅ Swagger API Docs: Available at $BASE_URL/docs" -ForegroundColor Green
} catch {
    Write-Host "❌ API Docs Failed: $_" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
