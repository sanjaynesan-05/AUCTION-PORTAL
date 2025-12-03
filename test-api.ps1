# Test API endpoints
try {
    Write-Host "Testing Players Endpoint..."
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/players' -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host ("✅ Total players: " + $data.Count)
    
    Write-Host ""
    Write-Host "Testing Teams Endpoint..."
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/teams' -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host ("✅ Total teams: " + $data.Count)
    
    Write-Host ""
    Write-Host "Testing Auth/Login..."
    $headers = @{'Content-Type' = 'application/json'}
    $body = @{'username' = 'admin'; 'password' = 'admin@123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/auth/login' -Method POST -Headers $headers -Body $body
    $data = $response.Content | ConvertFrom-Json
    Write-Host ("✅ Login successful for user: " + $data.user.username)
    Write-Host ("   Role: " + $data.user.role)
    
} catch {
    Write-Host ("❌ Error: " + $_.Exception.Message)
}
