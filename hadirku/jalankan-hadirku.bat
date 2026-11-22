@echo off
title HADIRKU - Sistem Absensi Digital Sekolah
color 0B
echo ============================================================
echo   HADIRKU - SISTEM ABSENSI DIGITAL SEKOLAH (SMA / SMK)
echo   Tugas Akhir Kejuruan Teknik Komputer dan Jaringan (TKJ)
echo ============================================================
echo.
echo [1/2] Menyiapkan environment Node.js...
set PATH=%PATH%;C:\Users\Asus\AppData\Local\Programs\nodejs\node-v26.13.1-win-x64

echo [2/2] Menjalankan Server HADIRKU pada port 5000...
cd /d "%~dp0backend"
start http://localhost:5000
node src/server.js
pause
