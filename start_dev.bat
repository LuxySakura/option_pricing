@echo off
echo 启动期权定价计算器开发环境...

echo 1. 激活Python虚拟环境
call venv\Scripts\activate.bat

echo 2. 启动后端API服务（新窗口）
start cmd /k "echo 启动FastAPI后端服务... && uvicorn app.main:app --reload"

echo 3. 启动React前端服务（新窗口）
start cmd /k "echo 启动React前端服务... && cd frontend\react-app && npm start"

echo 开发环境启动完成！
echo - 后端API: http://localhost:8000
echo - 前端应用: http://localhost:3000
echo - API文档: http://localhost:8000/docs