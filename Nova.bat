@echo off
setlocal enabledelayedexpansion

:: Nova AI Chatbot Launcher (Windows)
:: Bu dosyaya çift tıklayarak programı başlatabilirsiniz

title Nova AI Chatbot

echo.
echo ================================================
echo          NOVA AI CHATBOT LAUNCHER
echo ================================================
echo.

:: Node.js kontrolü
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Node.js bulunamadi!
    echo.
    echo Lutfen Node.js yukleyin: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Node.js versiyonu
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% bulundu
echo.

:: npm kontrolü
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] npm bulunamadi!
    pause
    exit /b 1
)

:: Proje klasörüne git
cd /d "%~dp0"

:: node_modules kontrolü
if not exist "node_modules" (
    echo [!] Bagimliliklarin yuklenmesi gerekiyor...
    echo.
    echo Yukleniyor... Lutfen bekleyin...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [HATA] Bagimliliklarin yuklenmesi basarisiz!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Bagimliliklar basariyla yuklendi!
    echo.
) else (
    echo [OK] Bagimliliklar mevcut
    echo.
)

:: Ollama kontrolü (opsiyonel)
echo [*] Ollama kontrol ediliyor...
curl -s http://localhost:11434/api/tags >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Ollama aktif
) else (
    echo [!] Ollama bulunamadi (Opsiyonel - Yerel modeller icin)
)
echo.

:: Programı başlat
echo ================================================
echo        NOVA BASLATILIYOR...
echo ================================================
echo.
echo Program acildiginda bu pencereyi kapatmayin!
echo Nova'yi kapatmak icin bu pencerede Ctrl+C'ye basin.
echo.

npm start

pause
