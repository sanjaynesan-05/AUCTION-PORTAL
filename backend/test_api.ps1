# IPL Auction Backend API Test Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IPL Auction Backend API Tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:8000"
$token = ""

# Test 1: Public Endpoints (No Auth Required)
Write-Host "1. Testing Public Endpoints" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

# Test GET /auction/state
Write-Host "`n[GET] /auction/state" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/state" -UseBasicParsing
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET /auction/players
Write-Host "`n[GET] /auction/players" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/players" -UseBasicParsing
    $players = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Players count: $($players.Count)" -ForegroundColor White
    Write-Host "First player: $($players[0].name) - Base: ₹$($players[0].base_price)L" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET /auction/teams
Write-Host "`n[GET] /auction/teams" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/teams" -UseBasicParsing
    $teams = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Teams count: $($teams.Count)" -ForegroundColor White
    Write-Host "First team: $($teams[0].name) - Budget: ₹$($teams[0].budget)L" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET /auction/players/pending
Write-Host "`n[GET] /auction/players/pending" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/players/pending" -UseBasicParsing
    $pendingPlayers = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Pending players count: $($pendingPlayers.Count)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Authentication
Write-Host "`n`n2. Testing Authentication" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

# Test POST /auth/login
Write-Host "`n[POST] /auth/login" -ForegroundColor Green
try {
    $body = @{username='admin'; password='auction123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
    $loginData = $response.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "User: $($loginData.user.username) - Role: $($loginData.user.role)" -ForegroundColor White
    Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test GET /auth/me
Write-Host "`n[GET] /auth/me" -ForegroundColor Green
try {
    $headers = @{ Authorization = "Bearer $token" }
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Headers $headers -UseBasicParsing
    $userData = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Current user: $($userData.username) - Role: $($userData.role)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Admin Endpoints (Requires JWT)
Write-Host "`n`n3. Testing Admin Endpoints" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

$headers = @{ 
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get first pending player
$pendingPlayers = (Invoke-WebRequest -Uri "$baseUrl/auction/players/pending" -UseBasicParsing).Content | ConvertFrom-Json
$firstPlayer = $pendingPlayers[0]
$firstTeam = ((Invoke-WebRequest -Uri "$baseUrl/auction/teams" -UseBasicParsing).Content | ConvertFrom-Json)[0]

Write-Host "`nUsing Player: $($firstPlayer.name) (ID: $($firstPlayer.id))" -ForegroundColor Cyan
Write-Host "Using Team: $($firstTeam.name) (ID: $($firstTeam.id))" -ForegroundColor Cyan

# Test POST /admin/auction/select-player
Write-Host "`n[POST] /admin/auction/select-player" -ForegroundColor Green
try {
    $body = @{player_id = $firstPlayer.id} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/select-player" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST /admin/auction/start
Write-Host "`n[POST] /admin/auction/start" -ForegroundColor Green
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/start" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST /admin/auction/increment (twice)
Write-Host "`n[POST] /admin/auction/increment" -ForegroundColor Green
try {
    $body = @{amount = 10} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/increment" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK - Increment 1" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
    
    Start-Sleep -Milliseconds 500
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/increment" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK - Increment 2" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST /admin/auction/end
Write-Host "`n[POST] /admin/auction/end" -ForegroundColor Green
try {
    $body = @{team_id = $firstTeam.id} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/end" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Check auction state after sale
Write-Host "`n[GET] /auction/state (after sale)" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/state" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST /admin/auction/next
Write-Host "`n[POST] /admin/auction/next" -ForegroundColor Green
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/auction/next" -Method POST -Headers $headers -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Status: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All Tests Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
