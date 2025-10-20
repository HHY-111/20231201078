@echo off
chcp 65001 >nul
echo Starting Django development server...
echo.

REM Check if virtual environment Python executable exists
if not exist ".venv\Scripts\python.exe" (
    echo Error: Virtual environment Python executable not found
    echo Please check if virtual environment is properly created
    pause
    exit /b 1
)

REM Check if manage.py file exists
if not exist "manage.py" (
    echo Error: manage.py file not found
    pause
    exit /b 1
)

echo Using virtual environment Python to start Django server...
echo.

REM Directly use virtual environment Python to start Django server
.venv\Scripts\python.exe manage.py runserver

echo.
echo Django server has stopped
pause