# 期权定价计算器开发环境启动脚本

# --- 1. 定义项目根目录 ---
# $PSScriptRoot 是脚本文件所在的目录 (...\scripts\run)
# (Get-Item ..\..).FullName 会获取上两级目录的完整路径，即项目根目录
$ProjectRoot = (Get-Item "$PSScriptRoot\..\..").FullName
Write-Host "Project Root Directory: $ProjectRoot" -ForegroundColor DarkGray

Write-Host "Start Option Pricing Calculator Development Environment..." -ForegroundColor Green

# --- 2. 激活 Python 虚拟环境 ---
# 使用基于项目根目录的绝对路径
$VenvActivateScript = Join-Path $ProjectRoot "venv\Scripts\Activate.ps1"
Write-Host "1. Activating Python Virtual Environment from '$VenvActivateScript'" -ForegroundColor Cyan
. $VenvActivateScript

# --- 3. 启动后端 API (在新窗口中) ---
# 使用 -WorkingDirectory 参数确保 uvicorn 在项目根目录运行
Write-Host "2. Starting BackEnd API (New Window)" -ForegroundColor Cyan
$BackendCommand = "Write-Host 'Starting FastAPI BackEnd Service...' -ForegroundColor Yellow; uvicorn app.main:app --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand -WorkingDirectory $ProjectRoot

# --- 4. 启动前端 App (在新窗口中) ---
# 使用 -WorkingDirectory 参数确保 npm start 在正确的前端目录运行
Write-Host "3. Starting FrontEnd App (New Window)" -ForegroundColor Cyan
$FrontEndDirectory = Join-Path $ProjectRoot "frontend\react-app"
$FrontEndCommand = "Write-Host 'Starting React FrontEnd App...' -ForegroundColor Yellow; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontEndCommand -WorkingDirectory $FrontEndDirectory

Write-Host "Successfully Started Option Pricing Calculator Environment" -ForegroundColor Green
Write-Host "- BackEnd API: http://localhost:8000" -ForegroundColor Magenta
Write-Host "- FrontEnd APP: http://localhost:3000" -ForegroundColor Magenta
Write-Host "- API Docs: http://localhost:8000/docs" -ForegroundColor Magenta
