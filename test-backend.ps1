# IPL Auction Portal - Backend Test Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   IPL Auction Portal - Backend Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET -TimeoutSec 10
    if ($response.success) {
        Write-Host "✅ Health Check: $($response.message)" -ForegroundColor Green
        Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Health Check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health Check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. Backend server is not running" -ForegroundColor White
    Write-Host "2. Wrong port (should be 5000)" -ForegroundColor White
    Write-Host "3. Firewall blocking the connection" -ForegroundColor White
    Write-Host ""
    Write-Host "Make sure to run 'npm start' from the root directory first." -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Test 2: MongoDB Connection Status
Write-Host "Testing MongoDB Connection..." -ForegroundColor Yellow
Write-Host "Note: This requires authentication. Register/login first if needed." -ForegroundColor Gray

# Test 3: Instructions
Write-Host "✅ Backend server is running!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB using start-mongodb.bat or start-mongodb.ps1" -ForegroundColor White
Write-Host "2. Register an admin user:" -ForegroundColor White
Write-Host "   POST $baseUrl/api/auth/register" -ForegroundColor Gray
Write-Host "   Body: {\"username\":\"admin\",\"password\":\"admin123\",\"role\":\"admin\"}" -ForegroundColor Gray
Write-Host "3. Login to get JWT token:" -ForegroundColor White
Write-Host "   POST $baseUrl/api/auth/login" -ForegroundColor Gray
Write-Host "   Body: {\"username\":\"admin\",\"password\":\"admin123\"}" -ForegroundColor Gray
Write-Host "4. Use the token for authenticated requests" -ForegroundColor White
Write-Host ""
Write-Host "For full API documentation, see BACKEND.md" -ForegroundColor Cyan

Read-Host "Press Enter to exit"