@echo off
echo ===================================================
echo   期权定价计算器 - 一键安装所有依赖
echo ===================================================
echo.

echo [1/5] 检查Python虚拟环境...
if not exist venv (
    echo 创建Python虚拟环境...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo 错误: 创建Python虚拟环境失败！
        echo 请确保已安装Python 3.6+
        pause
        exit /b 1
    )
) else (
    echo Python虚拟环境已存在，跳过创建步骤。
)

echo.
echo [2/5] 激活Python虚拟环境...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo 错误: 激活Python虚拟环境失败！
    pause
    exit /b 1
)

echo.
echo [3/5] 安装后端Python依赖...
set PYTHONUTF8=1
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo 错误: 安装Python依赖失败！
    pause
    exit /b 1
)

echo.
echo [4/5] 检查Node.js和npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到npm！
    echo 请安装Node.js和npm后重试。
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [5/5] 安装前端React依赖...
cd frontend\react-app
npm install
if %errorlevel% neq 0 (
    echo 错误: 安装React依赖失败！
    cd ..\..  REM 返回项目根目录
    pause
    exit /b 1
)

cd ..\..  REM 返回项目根目录

echo.
echo ===================================================
echo   安装完成！
echo ===================================================
echo.
echo 您现在可以使用以下命令启动应用：
echo.
echo   启动开发环境: .\start_en.bat
echo   或使用PowerShell: .\start_dev.ps1
echo.
echo 感谢使用期权定价计算器！
echo.

pause