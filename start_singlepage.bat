@echo off
cd /d "%~dp0"
echo Starting Django development server...
.venv\Scripts\python.exe manage.py runserver
echo Server started successfully!
pause