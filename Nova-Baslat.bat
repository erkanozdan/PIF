@echo off
setlocal enabledelayedexpansion

:: Nova Otomatik Baslatici - Hatalari otomatik gosterir
title Nova AI Chatbot

:: Hata raporu HTML dosyasi
set HATA_RAPORU=%~dp0hata-raporu.html
set HATA_METNI=%~dp0HATA-MESAJI.txt
set LOGFILE=%~dp0nova.log

:: Temiz basla
if exist "%HATA_RAPORU%" del "%HATA_RAPORU%"
if exist "%HATA_METNI%" del "%HATA_METNI%"
echo Nova baslatiyor... > "%LOGFILE%"

cls
echo.
echo ================================================
echo          NOVA AI CHATBOT
echo ================================================
echo.
echo Program hazirlaniyor...
echo.

:: Node.js kontrolu
where node >nul 2>nul
if %errorlevel% neq 0 (
    call :HataGoster "Node.js Bulunamadi" "Node.js yuklu degil!" "1. https://nodejs.org adresine gidin<br>2. LTS versiyonunu indirin (Yesil buton)<br>3. Kurun ve bilgisayari yeniden baslatin<br>4. Nova-Baslat.bat dosyasina tekrar cift tiklayin"
    exit /b 1
)

:: npm kontrolu
where npm >nul 2>nul
if %errorlevel% neq 0 (
    call :HataGoster "npm Bulunamadi" "npm yuklu degil!" "Node.js'i yeniden kurun:<br>https://nodejs.org"
    exit /b 1
)

:: Proje klasoru kontrolu
cd /d "%~dp0"
if not exist "package.json" (
    call :HataGoster "Proje Dosyalari Eksik" "package.json bulunamadi!" "Nova klasorunun icinde oldugunuzdan emin olun.<br>Dosyalari tekrar indirin."
    exit /b 1
)

:: Bagimliliklar kontrolu ve yukleme
if not exist "node_modules" (
    echo Ilk kez calistiriliyor...
    echo Bagimliliklar yukleniyor ^(2-5 dakika surebilir^)...
    echo.
    echo Lutfen bekleyin, pencereyi KAPATMAYIN!
    echo.

    npm install >"%LOGFILE%" 2>&1

    if !errorlevel! neq 0 (
        echo. >> "%LOGFILE%"
        echo === HATA OLUSTU === >> "%LOGFILE%"
        call :HataGoster "Yukleme Hatasi" "Bagimliliklar yuklenemedi! Hata detaylari nova.log dosyasinda." "1. Internet baglantinizi kontrol edin<br>2. Command Prompt acin ve:<br>&nbsp;&nbsp;&nbsp;cd %~dp0<br>&nbsp;&nbsp;&nbsp;npm cache clean --force<br>&nbsp;&nbsp;&nbsp;npm install<br>3. Nova-Baslat.bat dosyasina tekrar cift tiklayin<br><br><strong>Hata icin nova.log dosyasini kontrol edin</strong>"
        exit /b 1
    )
)

:: Programi baslat
echo.
echo ================================================
echo Nova aciliyor...
echo ================================================
echo.
echo ^> Uygulama penceresi acildiginda bu pencereyi KAPATMAYIN^!
echo ^> Nova'yi kapatmak icin bu pencerede Ctrl+C yapin
echo.

npm start >> "%LOGFILE%" 2>&1

:: Hata kontrolu
if !errorlevel! neq 0 (
    echo.
    echo.
    echo [HATA] Program baslatilirken hata olustu!
    echo.
    echo Hata detaylari: %LOGFILE%
    echo.
    call :HataGoster "Baslangic Hatasi" "Nova baslatilirken hata olustu! Hata detaylari nova.log dosyasinda." "Deneyebilecekleriniz:<br>1. node_modules klasorunu silin<br>2. Command Prompt acin ve:<br>&nbsp;&nbsp;&nbsp;cd %~dp0<br>&nbsp;&nbsp;&nbsp;npm install<br>3. Nova-Baslat.bat dosyasina tekrar cift tiklayin<br><br><strong>Hata icin nova.log dosyasini kontrol edin</strong>"
)

pause
exit /b 0

:: ===================================
:: HATA GOSTERME FONKSIYONU
:: ===================================
:HataGoster
set "BASLIK=%~1"
set "MESAJ=%~2"
set "COZUM=%~3"

:: HTML hata raporu olustur
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>Nova - Hata Raporu^</title^>
echo     ^<style^>
echo         * { margin: 0; padding: 0; box-sizing: border-box; }
echo         body {
echo             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
echo             background: linear-gradient^(135deg, #667eea 0%%, #764ba2 100%%^);
echo             min-height: 100vh;
echo             display: flex;
echo             align-items: center;
echo             justify-content: center;
echo             padding: 20px;
echo         }
echo         .container {
echo             background: white;
echo             border-radius: 20px;
echo             box-shadow: 0 20px 60px rgba^(0,0,0,0.3^);
echo             max-width: 600px;
echo             width: 100%%;
echo             padding: 40px;
echo         }
echo         .header {
echo             text-align: center;
echo             margin-bottom: 30px;
echo         }
echo         .icon {
echo             font-size: 80px;
echo             margin-bottom: 20px;
echo         }
echo         h1 {
echo             color: #333;
echo             font-size: 28px;
echo             margin-bottom: 10px;
echo         }
echo         .error-box {
echo             background: #fee;
echo             border-left: 4px solid #e53e3e;
echo             padding: 15px;
echo             border-radius: 8px;
echo             margin: 20px 0;
echo         }
echo         .error-box p {
echo             color: #c53030;
echo             font-size: 16px;
echo             line-height: 1.6;
echo         }
echo         .solution-box {
echo             background: #e6f7ff;
echo             border-left: 4px solid #1890ff;
echo             padding: 20px;
echo             border-radius: 8px;
echo             margin: 20px 0;
echo         }
echo         .solution-box h2 {
echo             color: #0050b3;
echo             font-size: 18px;
echo             margin-bottom: 15px;
echo         }
echo         .solution-box p {
echo             color: #0050b3;
echo             line-height: 1.8;
echo             font-size: 15px;
echo         }
echo         .button {
echo             display: inline-block;
echo             background: #667eea;
echo             color: white;
echo             padding: 12px 30px;
echo             border-radius: 8px;
echo             text-decoration: none;
echo             font-weight: bold;
echo             margin-top: 20px;
echo             transition: all 0.3s;
echo         }
echo         .button:hover {
echo             background: #5568d3;
echo             transform: translateY^(-2px^);
echo             box-shadow: 0 5px 15px rgba^(102, 126, 234, 0.4^);
echo         }
echo         .footer {
echo             text-align: center;
echo             margin-top: 30px;
echo             color: #666;
echo             font-size: 14px;
echo         }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="container"^>
echo         ^<div class="header"^>
echo             ^<div class="icon"^>⚠️^</div^>
echo             ^<h1^>%BASLIK%^</h1^>
echo         ^</div^>
echo         ^<div class="error-box"^>
echo             ^<p^>^<strong^>Hata:^</strong^> %MESAJ%^</p^>
echo         ^</div^>
echo         ^<div class="solution-box"^>
echo             ^<h2^>✅ Çözüm Adımları^</h2^>
echo             ^<p^>%COZUM%^</p^>
echo         ^</div^>
echo         ^<div class="footer"^>
echo             ^<p^>Bu pencereyi kapatabilirsiniz.^</p^>
echo             ^<p^>Sorunu çözdükten sonra ^<strong^>Nova-Baslat.bat^</strong^> dosyasına tekrar çift tıklayın.^</p^>
echo         ^</div^>
echo     ^</div^>
echo ^</body^>
echo ^</html^>
) > "%HATA_RAPORU%"

:: Metin dosyasina da yaz
(
echo ================================================
echo NOVA HATA RAPORU
echo ================================================
echo.
echo HATA: %BASLIK%
echo.
echo MESAJ: %MESAJ%
echo.
echo COZUM:
echo %COZUM%
echo.
echo ================================================
echo Bu dosyayi kopyalayip destek alabilirsiniz.
echo Tarih: %date% %time%
echo ================================================
echo.
echo === LOG DOSYASI ^(nova.log^) ===
echo.
) > "%HATA_METNI%"

:: Log dosyasini da ekle (varsa)
if exist "%LOGFILE%" (
    type "%LOGFILE%" >> "%HATA_METNI%"
)

:: Hata raporunu tarayicida ac
start "" "%HATA_RAPORU%"

:: Metin dosyasini da ac
start notepad "%HATA_METNI%"

:: Console'da da goster
cls
color 0C
echo.
echo ================================================
echo          HATA OLUSTU!
echo ================================================
echo.
echo %BASLIK%
echo.
echo %MESAJ%
echo.
echo ================================================
echo.
echo ^> Tarayicinizda detayli cozum acildi
echo ^> Notepad'de hata metni acildi ^(kopyalayabilirsiniz^)
echo ^> HATA-MESAJI.txt dosyasini da kontrol edin
echo.
echo ================================================
echo.
echo Bu pencereyi ACIK TUTUN!
echo Ekran goruntusu alin veya metni kopyalayin.
echo.
echo Kapatmak icin bir tusa basin...
echo.
pause >nul

exit /b 1
