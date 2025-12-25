# BeyondChats Project - Complete Setup Script

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "BeyondChats Project Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check PHP
try {
    $phpVersion = php -v 2>$null
    if ($phpVersion) {
        Write-Host "✓ PHP installed" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ PHP not found. Please install PHP 8.1+" -ForegroundColor Red
    exit 1
}

# Check Composer
try {
    $composerVersion = composer --version 2>$null
    if ($composerVersion) {
        Write-Host "✓ Composer installed" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Composer not found. Please install Composer" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node -v 2>$null
    if ($nodeVersion) {
        Write-Host "✓ Node.js installed" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check MySQL
try {
    $mysqlVersion = mysql --version 2>$null
    if ($mysqlVersion) {
        Write-Host "✓ MySQL installed" -ForegroundColor Green
    }
} catch {
    Write-Host "! MySQL not found. You'll need to install MySQL separately" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Phase 1: Setting up Laravel API" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location laravel-api

Write-Host "Installing Laravel dependencies..." -ForegroundColor Yellow
composer install

if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    Write-Host ""
    Write-Host "Please configure your database in .env file:" -ForegroundColor Yellow
    Write-Host "  DB_DATABASE=beyondchats" -ForegroundColor White
    Write-Host "  DB_USERNAME=root" -ForegroundColor White
    Write-Host "  DB_PASSWORD=your_password" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter after configuring .env"
}

Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate

Write-Host "Running migrations..." -ForegroundColor Yellow
php artisan migrate

Write-Host "✓ Laravel API setup complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Phase 2: Setting up Node.js Enhancer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location nodejs-enhancer

Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    Write-Host ""
    Write-Host "Please add your OpenAI API key to .env:" -ForegroundColor Yellow
    Write-Host "  OPENAI_API_KEY=your_key_here" -ForegroundColor White
    Write-Host ""
    Write-Host "Get your API key from: https://platform.openai.com/api-keys" -ForegroundColor Cyan
    Read-Host "Press Enter after adding your API key"
}

Write-Host "✓ Node.js Enhancer setup complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Phase 3: Setting up React Frontend" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location react-frontend

Write-Host "Installing React dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✓ React Frontend setup complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Scrape articles from BeyondChats:" -ForegroundColor White
Write-Host "   cd laravel-api" -ForegroundColor Cyan
Write-Host "   php scraper.php" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Start Laravel API server:" -ForegroundColor White
Write-Host "   php artisan serve" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Run article enhancer (in new terminal):" -ForegroundColor White
Write-Host "   cd nodejs-enhancer" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Start React frontend (in new terminal):" -ForegroundColor White
Write-Host "   cd react-frontend" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Visit http://localhost:3000 to see your articles!" -ForegroundColor Green
Write-Host ""
