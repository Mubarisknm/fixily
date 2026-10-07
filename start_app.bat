@echo off
echo Starting Fykzi Platform Servers...
start "Fykzi Express API" cmd /k "node server/index.js"
start "Fykzi Vite Frontend" cmd /k "npx vite --port 3000 --host"
timeout /t 3
start http://localhost:3000/
echo Fykzi Platform is running at http://localhost:3000/
