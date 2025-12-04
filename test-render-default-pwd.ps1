# Test Render Backend with Default Credentials
$BASE_URL = "https://auction-portal-7bds.onrender.com"
$default_pwd = "change-me-in-production"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testing Render with Default Credentials" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test Login with default password
Write-Host "`n[TEST] Login with default password" -ForegroundColor Yellow
try {
    $loginData = @{
        username = "admin"
        password = $default_pwd
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/auth/login" -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginData
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login Successful with default password!" -ForegroundColor Green
    Write-Host "   Token: $($data.access_token.Substring(0,30))..." -ForegroundColor Green
    Write-Host "   User: $($data.user.username) (Role: $($data.user.role))" -ForegroundColor Green
    
    # Store token for next tests
    $global:token = $data.access_token
} catch {
    Write-Host "❌ Login with default password failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
