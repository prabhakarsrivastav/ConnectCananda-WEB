@echo off
echo Starting Canadian Nexus Application...
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start cmd /k "npm run dev"
echo.
echo Both servers are starting in separate windows...
echo Backend: http://localhost:5000
echo Frontend: Will be shown in the frontend window
echo.
pause
