@echo off
TITLE Option Pricing Calculator - Dependency Installer

:: --- 1. Define Project Root Directory ---
:: %~dp0 expands to the drive and path of the directory where this script is located.
:: We then navigate up from the script's directory to find the project's root.
SET "SCRIPT_DIR=%~dp0"
SET "PROJECT_ROOT=%SCRIPT_DIR%..\..\"
echo Project Root Directory: %PROJECT_ROOT%
echo.

echo =================================================================
echo      Option Pricing Calculator - Dependency Installer
echo =================================================================
echo.

:: Temporarily change the current directory to the project root for all operations.
pushd "%PROJECT_ROOT%"

:: --- 2. Check Python Virtual Environment ---
echo [1/5] Checking for Python virtual environment...
if not exist "venv" (
    echo      Creating Python virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create Python virtual environment!
        echo Please ensure Python 3.6+ is installed and available in your PATH.
        goto :error
    )
) else (
    echo      Python virtual environment already exists. Skipping creation.
)

:: --- 3. Activate Python Virtual Environment ---
echo.
echo [2/5] Activating Python virtual environment...
call "venv\Scripts\activate.bat"
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate Python virtual environment!
    goto :error
)

:: --- 4. Install Backend Python Dependencies ---
echo.
echo [3/5] Installing backend Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies from requirements.txt!
    goto :error
)

:: --- 5. Check for Node.js and npm ---
echo.
echo [4/5] Checking for Node.js and npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    echo Please install Node.js and npm, then try again.
    echo Download from: https://nodejs.org/
    goto :error
) else (
    echo      npm found.
)

:: --- 6. Install Frontend React Dependencies ---
echo.
echo [5/5] Installing frontend React dependencies...
pushd "frontend\react-app"
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install React dependencies!
    popd
    goto :error
)
popd

:: --- Success ---
echo.
echo =================================================================
echo      Installation Complete!
echo =================================================================
echo.
echo You can now start the application using your startup script.
echo   e.g., .\scripts\run\start.bat
echo.

goto :end

:error
echo.
echo An error occurred. Please check the messages above.
echo.

:end
:: Return to the original directory from before the script was run.
popd
pause
