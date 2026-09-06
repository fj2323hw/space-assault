@echo off
cd /d "%~dp0"
echo Starting game server on port 8000...
powershell -ExecutionPolicy Bypass -File ".\server.ps1"
pause
