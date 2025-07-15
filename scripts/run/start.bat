@echo off
TITLE Option Pricing Calculator - Development Environment Starter

:: --- 1. Define Project Root Directory ---
:: %~dp0 expands to the drive and path of the directory where this script is located.
:: We then navigate up from the script's directory to find the project's root.
SET "SCRIPT_DIR=%~dp0"
SET "PROJECT_ROOT=%SCRIPT_DIR%..\..\"
echo Project Root Directory: %PROJECT_ROOT%
echo.

echo =================================================================
echo      Starting Option Pricing Calculator Development Environment
echo =================================================================
echo.

:: Temporarily change the current directory to the project root.
pushd "%PROJECT_ROOT%"

:: --- 2. Activate Python Virtual Environment ---
echo [1/3] Activating Python virtual environment...
call venv\Scripts\activate.bat
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to activate the Python virtual environment.
    echo Please ensure it was created correctly using the install script.
    pause
    exit /b 1
)

:: --- 3. Start Backend API Service (in a new window) ---
echo [2/3] Starting backend API service (in a new window)...
start "Backend API - FastAPI" cmd /k "echo Starting FastAPI backend service... && uvicorn app.main:app --reload"

:: --- 4. Start Frontend React Service (in a new window) ---
echo [3/3] Starting frontend React service (in a new window)...
:: The 'cd /d' command ensures the directory change works even across different drives.
start "Frontend App - React" cmd /k "echo Starting React frontend service... && cd /d frontend\react-app && npm start"

echo.
echo Startup commands issued successfully!
echo.
echo ===================================================
echo      Development Environment Information
echo ===================================================
echo.
echo   - Backend API running at: http://localhost:8000
echo   - Frontend App running at:  http://localhost:3000
echo   - API Docs available at:  http://localhost:8000/docs
echo.

:: Return to the original directory from before the script was run
popd

pause
