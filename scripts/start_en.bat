@echo off
echo Starting Option Pricing Calculator development environment...

echo 1. Activating Python virtual environment
call venv\Scripts\activate.bat

echo 2. Starting backend API service (new window)
start cmd /k "echo Starting FastAPI backend service... && uvicorn app.main:app --reload"

echo 3. Starting React frontend service (new window)
start cmd /k "echo Starting React frontend service... && cd frontend\react-app && npm start"

echo Development environment startup complete!
echo - Backend API: http://localhost:8000
echo - Frontend app: http://localhost:3000
echo - API docs: http://localhost:8000/docs