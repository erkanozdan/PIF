@echo off
setlocal enabledelayedexpansion

:: Nova Debug Launcher - Hata mesajlarini goster

title Nova AI Chatbot - Debug Mode

echo.
echo ================================================
echo          NOVA DEBUG MODE
echo ================================================
echo.

:: Log dosyasi olustur
set LOGFILE=%~dp0nova-debug.log
echo Nova Debug Log - %date% %time% > "%LOGFILE%"
echo. >> "%LOGFILE%"

echo Debug modu aktif. Hatalar kaydediliyor...
echo Log dosyasi: %LOGFILE%
echo.

:: Node.js kontrolu
echo [1/5] Node.js kontrol ediliyor...
echo [1/5] Node.js kontrol ediliyor... >> "%LOGFILE%"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Node.js bulunamadi! >> "%LOGFILE%"
    echo.
    echo [HATA] Node.js bulunamadi!
    echo.
    echo Node.js yuklemek icin: https://nodejs.org/
    echo LTS versiyonunu indirin ve kurun.
    echo Kurulumdan sonra bilgisayari yeniden baslatin.
    echo.
    pause
    exit /b 1
)

node --version >> "%LOGFILE%" 2>&1
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js %NODE_VERSION% bulundu >> "%LOGFILE%"
echo [OK] Node.js %NODE_VERSION% bulundu
echo.

:: npm kontrolu
echo [2/5] npm kontrol ediliyor...
echo [2/5] npm kontrol ediliyor... >> "%LOGFILE%"

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] npm bulunamadi! >> "%LOGFILE%"
    echo [HATA] npm bulunamadi!
    pause
    exit /b 1
)

npm --version >> "%LOGFILE%" 2>&1
echo [OK] npm bulundu
echo.

:: Proje klasoru kontrolu
echo [3/5] Proje klasoru kontrol ediliyor...
echo [3/5] Proje klasoru kontrol ediliyor... >> "%LOGFILE%"

cd /d "%~dp0"
if not exist "package.json" (
    echo [HATA] package.json bulunamadi! >> "%LOGFILE%"
    echo [HATA] package.json bulunamadi!
    echo Lutfen dogru klasorde oldugunuzdan emin olun.
    pause
    exit /b 1
)

echo [OK] Proje klasoru bulundu
echo.

:: Bagimliliklar kontrolu
echo [4/5] Bagimliliklar kontrol ediliyor...
echo [4/5] Bagimliliklar kontrol ediliyor... >> "%LOGFILE%"

if not exist "node_modules" (
    echo [!] node_modules bulunamadi. Yukleniyor...
    echo [!] node_modules bulunamadi. Yukleniyor... >> "%LOGFILE%"
    echo.
    echo Bu islem birka dakika surebilir. Lutfen bekleyin...
    echo.

    call npm install >> "%LOGFILE%" 2>&1

    if %errorlevel% neq 0 (
        echo. >> "%LOGFILE%"
        echo [HATA] npm install basarisiz! >> "%LOGFILE%"
        echo.
        echo [HATA] Bagimliliklar yuklenemedi!
        echo.
        echo Hata detaylari icin bakınız: %LOGFILE%
        echo.
        echo Cozum onerileri:
        echo 1. Internet baglantinizi kontrol edin
        echo 2. npm cache temizleyin: npm cache clean --force
        echo 3. node_modules klasorunu silin ve tekrar deneyin
        echo.
        pause
        exit /b 1
    )

    echo. >> "%LOGFILE%"
    echo [OK] Bagimliliklar basariyla yuklendi >> "%LOGFILE%"
    echo [OK] Bagimliliklar basariyla yuklendi
) else (
    echo [OK] Bagimliliklar mevcut
)
echo.

:: Program baslat
echo [5/5] Nova baslatiliyor...
echo [5/5] Nova baslatiliyor... >> "%LOGFILE%"
echo.
echo ================================================
echo        NOVA BASLATILIYOR...
echo ================================================
echo.
echo Uygulama acildiginda bu pencereyi KAPATMAYIN!
echo Kapatmak icin: Ctrl+C
echo.
echo Hata olusursa: %LOGFILE% dosyasini kontrol edin
echo.

npm start >> "%LOGFILE%" 2>&1

if %errorlevel% neq 0 (
    echo.
    echo [HATA] Program baslatilirken hata olustu!
    echo Hata detaylari: %LOGFILE%
    echo.
    pause
)
