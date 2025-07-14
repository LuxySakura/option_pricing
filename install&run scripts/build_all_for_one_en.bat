@echo off
echo ===================================================
echo   Option Pricing Calculator - Install All Dependencies
echo ===================================================
echo.

echo [1/5] Checking Python virtual environment...
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Error: Failed to create Python virtual environment!
        echo Please make sure Python 3.6+ is installed
        pause
        exit /b 1
    )
) else (
    echo Python virtual environment already exists, skipping creation.
)

echo.
echo [2/5] Activating Python virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo Error: Failed to activate Python virtual environment!
    pause
    exit /b 1
)

echo.
echo [3/5] Installing backend Python dependencies...
set PYTHONUTF8=1
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies!
    pause
    exit /b 1
)

echo.
echo [4/5] Checking Node.js and npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm not found!
    echo Please install Node.js and npm, then try again.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [5/5] Installing frontend React dependencies...
cd frontend\react-app
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install React dependencies!
    cd ..\..  REM Return to project root
    pause
    exit /b 1
)

cd ..\..  REM Return to project root

echo.
echo ===================================================
echo   Installation Complete!
echo ===================================================
echo.
echo You can now start the application using:
echo.
echo   Start development environment: .\start_en.bat
echo   Or using PowerShell: .\start_dev.ps1
echo.
echo Thank you for using Option Pricing Calculator!
echo.

pause