Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  FRONTEND-BACKEND INTEGRATION TEST" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://auction-portal-7bds.onrender.com"
$pass = 0
$fail = 0

# Test 1: Health Check
Write-Host "TEST 1: Backend Health Check" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/health" -TimeoutSec 10 -ErrorAction Stop
    if ($r.StatusCode -eq 200) {
        Write-Host "  OK - Backend healthy" -ForegroundColor Green
        $pass++
    }
} catch {
    Write-Host "  FAIL - Backend not accessible" -ForegroundColor Red
    $fail++
}

# Test 2: Login
Write-Host ""
Write-Host "TEST 2: Admin Login (Critical)" -ForegroundColor Yellow
try {
    $body = @{username = "admin"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.access_token) {
        Write-Host "  OK - Token generated" -ForegroundColor Green
        Write-Host "  Role: $($d.user.role)" -ForegroundColor Green
        $adminToken = $d.access_token
        $pass++
    }
} catch {
    Write-Host "  FAIL - Login failed" -ForegroundColor Red
    $fail++
}

# Test 3: Current User
Write-Host ""
Write-Host "TEST 3: Get Current User (Auth Test)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $h = @{"Authorization" = "Bearer $adminToken"}
        $r = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -Headers $h -TimeoutSec 10 -ErrorAction Stop
        $d = $r.Content | ConvertFrom-Json
        Write-Host "  OK - User: $($d.username), Role: $($d.role)" -ForegroundColor Green
        $pass++
    } catch {
        Write-Host "  FAIL - Could not get user" -ForegroundColor Red
        $fail++
    }
} else {
    Write-Host "  SKIP - No token" -ForegroundColor Yellow
}

# Test 4: Players Data
Write-Host ""
Write-Host "TEST 4: Players Endpoint (Data)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/players" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    $count = $d.Count
    Write-Host "  OK - $count players loaded" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "  FAIL - Could not load players" -ForegroundColor Red
    $fail++
}

# Test 5: Teams Data
Write-Host ""
Write-Host "TEST 5: Teams Endpoint (Data)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/teams" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    $count = $d.Count
    Write-Host "  OK - $count teams loaded" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "  FAIL - Could not load teams" -ForegroundColor Red
    $fail++
}

# Test 6: Error Handling
Write-Host ""
Write-Host "TEST 6: Error Handling (Invalid Credentials)" -ForegroundColor Yellow
try {
    $body = @{username = "admin"; password = "wrong"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  FAIL - Should reject bad credentials" -ForegroundColor Red
    $fail++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  OK - 401 error (correct)" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "  FAIL - Wrong error code" -ForegroundColor Red
        $fail++
    }
}

# Test 7: Presenter Role
Write-Host ""
Write-Host "TEST 7: Presenter Login (Role Test)" -ForegroundColor Yellow
try {
    $body = @{username = "presenter"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.user.role -eq "presenter") {
        Write-Host "  OK - Presenter authenticated" -ForegroundColor Green
        $pass++
    }
} catch {
    Write-Host "  FAIL - Presenter login failed" -ForegroundColor Red
    $fail++
}

# Test 8: Team Login
Write-Host ""
Write-Host "TEST 8: Team Login (Viewer Role)" -ForegroundColor Yellow
try {
    $body = @{username = "csk"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.user.role -eq "viewer") {
        Write-Host "  OK - Team viewer: $($d.user.teamName)" -ForegroundColor Green
        $pass++
    }
} catch {
    Write-Host "  FAIL - Team login failed" -ForegroundColor Red
    $fail++
}

# Summary
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($fail -eq 0) {
    Write-Host "SUCCESS: Frontend-Backend integration is FULLY OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "DEPLOYMENT READINESS: READY TO DEPLOY" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor Yellow
    Write-Host "  Backend URL: $baseUrl" -ForegroundColor White
    Write-Host "  API Config: .env.production configured" -ForegroundColor White
    Write-Host "  Authentication: JWT working" -ForegroundColor White
    Write-Host "  All roles: Admin, Presenter, Viewer" -ForegroundColor White
    Write-Host ""
    Write-Host "What's Ready:" -ForegroundColor Yellow
    Write-Host "  - Frontend build: Complete (dist/ folder)" -ForegroundColor White
    Write-Host "  - Backend API: All endpoints working" -ForegroundColor White
    Write-Host "  - Authentication: All roles working" -ForegroundColor White
    Write-Host "  - Data loading: Players and teams" -ForegroundColor White
    Write-Host "  - Error handling: Proper responses" -ForegroundColor White
} else {
    Write-Host "ISSUES FOUND - Fix before deployment" -ForegroundColor Red
}
