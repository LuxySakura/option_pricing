# 期权定价计算器开发环境启动脚本
Write-Host "启动期权定价计算器开发环境..." -ForegroundColor Green

Write-Host "1. 激活Python虚拟环境" -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

Write-Host "2. 启动后端API服务（新窗口）" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '启动FastAPI后端服务...' -ForegroundColor Yellow; uvicorn app.main:app --reload"

Write-Host "3. 启动React前端服务（新窗口）" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '启动React前端服务...' -ForegroundColor Yellow; Set-Location .\frontend\react-app; npm start"

Write-Host "开发环境启动完成！" -ForegroundColor Green
Write-Host "- 后端API: http://localhost:8000" -ForegroundColor Magenta
Write-Host "- 前端应用: http://localhost:3000" -ForegroundColor Magenta
Write-Host "- API文档: http://localhost:8000/docs" -ForegroundColor Magenta