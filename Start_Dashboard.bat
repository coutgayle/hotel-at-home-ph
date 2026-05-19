@echo off
echo Closing any existing background servers...
taskkill /F /IM node.exe >nul 2>&1

echo Starting Hotel at Home Dashboard for Client...
echo Please wait a few seconds while the system loads...

:: Start the backend server in a minimized window
cd backend
start /min cmd /c "npm run dev"

:: Go to frontend and start the frontend server in a minimized window
cd ../frontend
:: Clear stuck cache and force Next.js to use port 3005 to prevent Windows conflicts
start /min cmd /c "rmdir /s /q .next & npm run dev -- -p 3005"

:: Wait 8 seconds for the servers to fully boot up, then open the browser
timeout /t 8 >nul
start http://localhost:3005/portal