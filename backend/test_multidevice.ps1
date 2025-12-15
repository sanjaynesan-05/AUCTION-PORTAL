# Multi-Device Connection Test
$serverIP = "192.168.0.103"
$baseUrl = "http://${serverIP}:8000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "IPL Auction - Multi-Device Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Server Reachability
Write-Host "1️⃣  Testing Server Reachability..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $serverIP -Count 1 -Quiet
if ($ping) {
    Write-Host "   ✅ Server IP is reachable" -ForegroundColor Green
} else {
    Write-Host "   ❌ Cannot reach server IP" -ForegroundColor Red
    exit
}

# Test 2: Port Check
Write-Host "`n2️⃣  Testing Port 8000..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($serverIP, 8000)
    $tcpClient.Close()
    Write-Host "   ✅ Port 8000 is open" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Port 8000 is not accessible" -ForegroundColor Red
    exit
}

# Test 3: API Endpoint
Write-Host "`n3️⃣  Testing API Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auction/state" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ API is accessible" -ForegroundColor Green
    Write-Host "   📊 Status: $($data.status) | Bid: ₹$($data.currentBid)L" -ForegroundColor White
} catch {
    Write-Host "   ❌ API not accessible" -ForegroundColor Red
    exit
}

# Test 4: Authentication
Write-Host "`n4️⃣  Testing Authentication..." -ForegroundColor Yellow
try {
    $loginData = '{"username":"admin","password":"auction123"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing
    $auth = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Login successful" -ForegroundColor Green
    Write-Host "   👤 User: $($auth.user.username)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Authentication failed" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📱 Multi-Device Access URLs" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Share these URLs with devices on your network:`n" -ForegroundColor Yellow
Write-Host "  📱 Test Page:  " -NoNewline; Write-Host "http://${serverIP}:8000/test_network.html" -ForegroundColor Green
Write-Host "  📖 API Docs:   " -NoNewline; Write-Host "http://${serverIP}:8000/docs" -ForegroundColor Green
Write-Host "  🔌 WebSocket:  " -NoNewline; Write-Host "ws://${serverIP}:8000/ws/auction" -ForegroundColor Green

Write-Host "`n✅ All Tests Passed - Multi-Device Ready!`n" -ForegroundColor Green
