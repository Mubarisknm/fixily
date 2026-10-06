@echo off
echo Starting Fykso Platform Servers...
start "Fykso Express API" cmd /k "node server/index.js"
start "Fykso Vite Frontend" cmd /k "npx vite --port 3000 --host"
timeout /t 3
start http://localhost:3000/
echo Fykso Platform is running at http://localhost:3000/
