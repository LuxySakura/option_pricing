# 期权定价计算器 - 一键安装所有依赖 (PowerShell版本)

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   期权定价计算器 - 一键安装所有依赖" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] 检查Python虚拟环境..." -ForegroundColor Yellow
if (-not (Test-Path -Path "venv")) {
    Write-Host "创建Python虚拟环境..." -ForegroundColor Gray
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 创建Python虚拟环境失败！" -ForegroundColor Red
        Write-Host "请确保已安装Python 3.6+" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
} else {
    Write-Host "Python虚拟环境已存在，跳过创建步骤。" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[2/5] 激活Python虚拟环境..." -ForegroundColor Yellow
try {
    & .\venv\Scripts\Activate.ps1
} catch {
    Write-Host "错误: 激活Python虚拟环境失败！" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # 如果是执行策略问题，提供解决方案
    if ($_.Exception.Message -like "*cannot be loaded because running scripts is disabled*") {
        Write-Host ""
        Write-Host "这可能是由于PowerShell执行策略限制。" -ForegroundColor Yellow
        Write-Host "尝试运行以下命令后重试：" -ForegroundColor Yellow
        Write-Host "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass" -ForegroundColor White -BackgroundColor DarkGray
    }
    
    Read-Host "按Enter键退出"
    exit 1
}

Write-Host ""
Write-Host "[3/5] 安装后端Python依赖..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 安装Python依赖失败！" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit 1
}

Write-Host ""
Write-Host "[4/5] 检查Node.js和npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "检测到npm版本: $npmVersion" -ForegroundColor Gray
} catch {
    Write-Host "错误: 未找到npm！" -ForegroundColor Red
    Write-Host "请安装Node.js和npm后重试。" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Blue
    Read-Host "按Enter键退出"
    exit 1
}

Write-Host ""
Write-Host "[5/5] 安装前端React依赖..." -ForegroundColor Yellow
Push-Location -Path .\frontend\react-app
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "错误: 安装React依赖失败！" -ForegroundColor Red
    Pop-Location  # 返回项目根目录
    Read-Host "按Enter键退出"
    exit 1
}
Pop-Location  # 返回项目根目录

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "   安装完成！" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "您现在可以使用以下命令启动应用：" -ForegroundColor White
Write-Host ""
Write-Host "  启动开发环境: .\start_en.bat" -ForegroundColor Yellow
Write-Host "  或使用PowerShell: .\start_dev.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "感谢使用期权定价计算器！" -ForegroundColor Cyan
Write-Host ""

Read-Host "按Enter键退出"