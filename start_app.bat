@echo off
echo Starting Fixily Platform Servers...
start "Fixily Express API" cmd /k "node server/index.js"
start "Fixily Vite Frontend" cmd /k "npx vite --port 3000 --host"
timeout /t 3
start http://localhost:3000/
echo Fixily Platform is running at http://localhost:3000/
