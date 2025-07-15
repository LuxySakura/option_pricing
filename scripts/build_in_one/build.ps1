# Option Pricing Calculator - One-Click Dependency Installer (PowerShell Version)

# --- 1. Define Project Root Directory ---
# $PSScriptRoot is the directory where the script file is located.
# We navigate up to find the project's root directory.
# Adjust the number of ".." if your script is nested deeper.
$ProjectRoot = (Get-Item "$PSScriptRoot\..\..").FullName
Write-Host "Project Root Directory: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

# --- Main Script Logic ---
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "      Option Pricing Calculator - Dependency Installer" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Set current location to the project root to ensure commands run correctly
Push-Location -Path $ProjectRoot

# --- 2. Check Python Virtual Environment ---
Write-Host "[1/5] Checking for Python virtual environment..." -ForegroundColor Yellow
$VenvPath = Join-Path $ProjectRoot "venv"
if (-not (Test-Path -Path $VenvPath)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create Python virtual environment!" -ForegroundColor Red
        Write-Host "Please ensure Python 3.6+ is installed and available in your PATH." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Python virtual environment already exists. Skipping creation." -ForegroundColor Gray
}

# --- 3. Activate Python Virtual Environment ---
Write-Host ""
Write-Host "[2/5] Activating Python virtual environment..." -ForegroundColor Yellow
$ActivateScript = Join-Path $VenvPath "Scripts\Activate.ps1"
try {
    . $ActivateScript
} catch {
    Write-Host "ERROR: Failed to activate Python virtual environment!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Provide a helpful tip if it's an execution policy issue
    if ($_.Exception.Message -like "*cannot be loaded because running scripts is disabled*") {
        Write-Host ""
        Write-Host "This might be due to PowerShell's execution policy." -ForegroundColor Yellow
        Write-Host "Try running the following command in your terminal, then run this script again:" -ForegroundColor Yellow
        Write-Host "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass" -ForegroundColor White -BackgroundColor DarkGray
    }
    
    Read-Host "Press Enter to exit"
    exit 1
}

# --- 4. Install Backend Python Dependencies ---
Write-Host ""
Write-Host "[3/5] Installing backend Python dependencies..." -ForegroundColor Yellow
$RequirementsFile = Join-Path $ProjectRoot "requirements.txt"
pip install -r $RequirementsFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Python dependencies from '$RequirementsFile'!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# --- 5. Check for Node.js and npm ---
Write-Host ""
Write-Host "[4/5] Checking for Node.js and npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "Detected npm version: $npmVersion" -ForegroundColor Gray
} catch {
    Write-Host "ERROR: npm not found!" -ForegroundColor Red
    Write-Host "Please install Node.js and npm, then try again." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Blue
    Read-Host "Press Enter to exit"
    exit 1
}

# --- 6. Install Frontend React Dependencies ---
Write-Host ""
Write-Host "[5/5] Installing frontend React dependencies..." -ForegroundColor Yellow
$FrontEndDirectory = Join-Path $ProjectRoot "frontend\react-app"
Push-Location -Path $FrontEndDirectory
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "ERROR: Failed to install React dependencies!" -ForegroundColor Red
    Pop-Location # Return to the previous directory (project root)
    Read-Host "Press Enter to exit"
    exit 1
}
Pop-Location # Return to the previous directory (project root)

# --- Completion ---
Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "      Setup Complete!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the application using your startup script." -ForegroundColor White
Write-Host ""
Write-Host "  e.g., .\scripts\run\start.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Thank you for using the Option Pricing Calculator!" -ForegroundColor Cyan
Write-Host ""

# Return to the original directory from before the script was run
Pop-Location

Read-Host "Press Enter to exit"
