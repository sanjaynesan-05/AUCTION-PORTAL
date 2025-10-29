# Start Backend and Frontend Servers

Write-Host "`n=== Starting IPL Auction Portal ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173`n" -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\AUCTION PORTAL\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\AUCTION PORTAL\frontend'; npm run dev"

Write-Host "`nServers starting in new windows..." -ForegroundColor Green
Write-Host "Backend logs: Check backend terminal" -ForegroundColor Gray
Write-Host "Frontend logs: Check frontend terminal`n" -ForegroundColor Gray
