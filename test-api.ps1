# Test API endpoints
# IMPORTANT: Use environment variables for credentials in production
# Example: $env:TEST_USERNAME and $env:TEST_PASSWORD

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
    # Get credentials from environment variables
    $username = $env:TEST_USERNAME
    $password = $env:TEST_PASSWORD
    
    if (-not $username -or -not $password) {
        Write-Host "⚠️  Please set TEST_USERNAME and TEST_PASSWORD environment variables"
        exit 1
    }
    
    $headers = @{'Content-Type' = 'application/json'}
    $body = @{'username' = $username; 'password' = $password} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/auth/login' -Method POST -Headers $headers -Body $body
    $data = $response.Content | ConvertFrom-Json
    Write-Host ("✅ Login successful for user: " + $data.user.username)
    Write-Host ("   Role: " + $data.user.role)
    
} catch {
    Write-Host ("❌ Error: " + $_.Exception.Message)
}
