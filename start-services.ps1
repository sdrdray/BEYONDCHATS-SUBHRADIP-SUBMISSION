# BeyondChats Project - Start All Services

Write-Host "Starting BeyondChats Services..." -ForegroundColor Cyan
Write-Host ""

# Function to start a process in a new window
function Start-ServiceWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    Write-Host "Starting $Title..." -ForegroundColor Yellow
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$WorkingDirectory'; Write-Host '$Title' -ForegroundColor Green; $Command"
}

# Start Laravel API
Write-Host "1. Starting Laravel API Server (http://localhost:8000)" -ForegroundColor Cyan
Start-ServiceWindow -Title "Laravel API Server" -Command "php artisan serve" -WorkingDirectory "$PSScriptRoot\laravel-api"

Start-Sleep -Seconds 2

# Start React Frontend
Write-Host "2. Starting React Frontend (http://localhost:3000)" -ForegroundColor Cyan
Start-ServiceWindow -Title "React Frontend" -Command "npm start" -WorkingDirectory "$PSScriptRoot\react-frontend"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "All Services Started!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  - Laravel API: http://localhost:8000" -ForegroundColor White
Write-Host "  - React Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "To run the article enhancer:" -ForegroundColor Yellow
Write-Host "  cd nodejs-enhancer" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop services" -ForegroundColor Gray
