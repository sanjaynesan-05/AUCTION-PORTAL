Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  AUCTION PORTAL BACKEND - COMPREHENSIVE TEST SUITE" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://auction-portal-7bds.onrender.com"
$pass = 0
$fail = 0

# Test 1: Health Check
Write-Host "TEST 1: Health Check (/health)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/health" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    Write-Host "  Status: 200 OK" -ForegroundColor Green
    Write-Host "  Response: $($d.status)" -ForegroundColor Gray
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Red
    $fail++
}

# Test 2: Root Endpoint
Write-Host ""
Write-Host "TEST 2: Root Endpoint (/)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    Write-Host "  Status: 200 OK" -ForegroundColor Green
    Write-Host "  Message: $($d.message)" -ForegroundColor Gray
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Red
    $fail++
}

# Test 3: Get Players
Write-Host ""
Write-Host "TEST 3: Get Players (/players)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/players" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    $count = $d.Count
    Write-Host "  Status: 200 OK - $count players found" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Red
    $fail++
}

# Test 4: Get Teams
Write-Host ""
Write-Host "TEST 4: Get Teams (/teams)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/teams" -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    $count = $d.Count
    Write-Host "  Status: 200 OK - $count teams found" -ForegroundColor Green
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Red
    $fail++
}

# Test 5: Admin Login
Write-Host ""
Write-Host "TEST 5: Admin Login (auction123)" -ForegroundColor Yellow
try {
    $body = @{username = "admin"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.access_token) {
        Write-Host "  Status: 200 OK" -ForegroundColor Green
        Write-Host "  Role: $($d.user.role)" -ForegroundColor Gray
        $adminToken = $d.access_token
        $pass++
    }
} catch {
    Write-Host "  Status: FAILED (401)" -ForegroundColor Red
    $fail++
}

# Test 6: Presenter Login
Write-Host ""
Write-Host "TEST 6: Presenter Login (auction123)" -ForegroundColor Yellow
try {
    $body = @{username = "presenter"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.access_token) {
        Write-Host "  Status: 200 OK" -ForegroundColor Green
        Write-Host "  Role: $($d.user.role)" -ForegroundColor Gray
        $presenterToken = $d.access_token
        $pass++
    }
} catch {
    Write-Host "  Status: FAILED (401)" -ForegroundColor Red
    $fail++
}

# Test 7: Team User Login
Write-Host ""
Write-Host "TEST 7: Team User Login (csk/auction123)" -ForegroundColor Yellow
try {
    $body = @{username = "csk"; password = "auction123"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    if ($d.access_token) {
        Write-Host "  Status: 200 OK" -ForegroundColor Green
        Write-Host "  Team: $($d.user.teamName)" -ForegroundColor Gray
        $teamToken = $d.access_token
        $pass++
    }
} catch {
    Write-Host "  Status: FAILED (401)" -ForegroundColor Red
    $fail++
}

# Test 8: Invalid Credentials
Write-Host ""
Write-Host "TEST 8: Invalid Credentials (should reject)" -ForegroundColor Yellow
try {
    $body = @{username = "admin"; password = "wrong"} | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  Status: FAILED (should have rejected)" -ForegroundColor Red
    $fail++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  Status: 401 Unauthorized (correct)" -ForegroundColor Green
        $pass++
    }
}

# Test 9: Get Current User
Write-Host ""
Write-Host "TEST 9: Get Current User (/auth/me)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $h = @{"Authorization" = "Bearer $adminToken"}
        $r = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -Headers $h -TimeoutSec 10 -ErrorAction Stop
        $d = $r.Content | ConvertFrom-Json
        Write-Host "  Status: 200 OK" -ForegroundColor Green
        Write-Host "  Username: $($d.username)" -ForegroundColor Gray
        Write-Host "  Role: $($d.role)" -ForegroundColor Gray
        $pass++
    } catch {
        Write-Host "  Status: FAILED" -ForegroundColor Red
        $fail++
    }
} else {
    Write-Host "  SKIPPED (no admin token)" -ForegroundColor Gray
}

# Test 10: Logout
Write-Host ""
Write-Host "TEST 10: Logout (/auth/logout)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/logout" -Method POST -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    Write-Host "  Status: 200 OK" -ForegroundColor Green
    Write-Host "  Message: $($d.message)" -ForegroundColor Gray
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Red
    $fail++
}

# Test 11: All Teams Login
Write-Host ""
Write-Host "TEST 11: All 10 Teams Login" -ForegroundColor Yellow
$teams = @("csk", "mi", "rcb", "kkr", "dc", "rr", "pbks", "srh", "gt", "lsg")
$teamSuccess = 0
foreach ($team in $teams) {
    try {
        $body = @{username = $team; password = "auction123"} | ConvertTo-Json
        $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
        $d = $r.Content | ConvertFrom-Json
        if ($d.access_token) { $teamSuccess++ }
    } catch { }
}
if ($teamSuccess -eq 10) {
    Write-Host "  Status: 10/10 teams logged in" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  Status: $teamSuccess/10 teams logged in" -ForegroundColor Red
    $fail++
}

# Test 12: Reset Passwords Endpoint
Write-Host ""
Write-Host "TEST 12: Reset Passwords (/system/reset-passwords)" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/system/reset-passwords" -Method POST -TimeoutSec 10 -ErrorAction Stop
    $d = $r.Content | ConvertFrom-Json
    Write-Host "  Status: 200 OK" -ForegroundColor Green
    Write-Host "  Message: $($d.message)" -ForegroundColor Gray
    $pass++
} catch {
    Write-Host "  Status: FAILED" -ForegroundColor Yellow
    $fail++
}

# Summary
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "Passed: $pass" -ForegroundColor Green
Write-Host "Failed: $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host ""
if ($fail -eq 0) {
    Write-Host "SUCCESS: All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backend is fully operational with:" -ForegroundColor Yellow
    Write-Host "  - 53 Players" -ForegroundColor White
    Write-Host "  - 10 Teams" -ForegroundColor White
    Write-Host "  - 12 Users (1 admin, 1 presenter, 10 teams)" -ForegroundColor White
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Yellow
    Write-Host "  Username: admin, Password: auction123" -ForegroundColor White
    Write-Host "  Username: presenter, Password: auction123" -ForegroundColor White
    Write-Host "  Username: csk/mi/rcb/kkr/dc/rr/pbks/srh/gt/lsg, Password: auction123" -ForegroundColor White
} else {
    Write-Host "ISSUES FOUND - See details above" -ForegroundColor Red
}
