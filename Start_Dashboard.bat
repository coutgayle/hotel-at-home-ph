@echo off
echo Starting Hotel at Home Dashboard for Client...
echo Please wait a few seconds while the system loads...

:: Start the backend server in a minimized window
cd backend
start /min cmd /c "npm run dev"

:: Go to frontend and start the frontend server in a minimized window
cd ../frontend
start /min cmd /c "npm run dev"

:: Wait 5 seconds for the servers to boot up, then open the browser
timeout /t 5 >nul
start http://localhost:3000/admin