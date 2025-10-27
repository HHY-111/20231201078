@echo off
echo ========================================
echo 启动 Vue 前端开发服务器
echo ========================================

cd vue-frontend

if not exist node_modules (
    echo 正在安装依赖包...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo 依赖安装完成
)

echo 启动 Vue 开发服务器...
npm run dev

pause