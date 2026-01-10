#!/bin/bash

# Nova Debug Launcher - macOS/Linux
# Hata mesajlarini goster ve logla

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo ""
echo "================================================"
echo "          NOVA DEBUG MODE"
echo "================================================"
echo ""

# Log dosyasi
LOGFILE="$(dirname "$0")/nova-debug.log"
echo "Nova Debug Log - $(date)" > "$LOGFILE"
echo "" >> "$LOGFILE"

echo -e "${BLUE}Debug modu aktif. Hatalar kaydediliyor...${NC}"
echo "Log dosyasi: $LOGFILE"
echo ""

# Node.js kontrolu
echo -e "${BLUE}[1/5] Node.js kontrol ediliyor...${NC}"
echo "[1/5] Node.js kontrol ediliyor..." >> "$LOGFILE"

if ! command -v node &> /dev/null; then
    echo "[HATA] Node.js bulunamadi!" >> "$LOGFILE"
    echo -e "${RED}[HATA]${NC} Node.js bulunamadi!"
    echo ""
    echo "Node.js yuklemek icin: https://nodejs.org/"
    echo "LTS versiyonunu indirin ve kurun."
    echo ""
    read -p "Devam etmek icin Enter'a basin..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "Node.js $NODE_VERSION bulundu" >> "$LOGFILE"
echo -e "${GREEN}[OK]${NC} Node.js $NODE_VERSION bulundu"
echo ""

# npm kontrolu
echo -e "${BLUE}[2/5] npm kontrol ediliyor...${NC}"
echo "[2/5] npm kontrol ediliyor..." >> "$LOGFILE"

if ! command -v npm &> /dev/null; then
    echo "[HATA] npm bulunamadi!" >> "$LOGFILE"
    echo -e "${RED}[HATA]${NC} npm bulunamadi!"
    read -p "Devam etmek icin Enter'a basin..."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "npm $NPM_VERSION bulundu" >> "$LOGFILE"
echo -e "${GREEN}[OK]${NC} npm $NPM_VERSION bulundu"
echo ""

# Proje klasoru kontrolu
echo -e "${BLUE}[3/5] Proje klasoru kontrol ediliyor...${NC}"
echo "[3/5] Proje klasoru kontrol ediliyor..." >> "$LOGFILE"

cd "$(dirname "$0")"

if [ ! -f "package.json" ]; then
    echo "[HATA] package.json bulunamadi!" >> "$LOGFILE"
    echo -e "${RED}[HATA]${NC} package.json bulunamadi!"
    echo "Lutfen dogru klasorde oldugunuzdan emin olun."
    read -p "Devam etmek icin Enter'a basin..."
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Proje klasoru bulundu"
echo ""

# Bagimliliklar kontrolu
echo -e "${BLUE}[4/5] Bagimliliklar kontrol ediliyor...${NC}"
echo "[4/5] Bagimliliklar kontrol ediliyor..." >> "$LOGFILE"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!]${NC} node_modules bulunamadi. Yukleniyor..."
    echo "[!] node_modules bulunamadi. Yukleniyor..." >> "$LOGFILE"
    echo ""
    echo "Bu islem birka dakika surebilir. Lutfen bekleyin..."
    echo ""

    npm install >> "$LOGFILE" 2>&1

    if [ $? -ne 0 ]; then
        echo "" >> "$LOGFILE"
        echo "[HATA] npm install basarisiz!" >> "$LOGFILE"
        echo ""
        echo -e "${RED}[HATA]${NC} Bagimliliklar yuklenemedi!"
        echo ""
        echo "Hata detaylari icin bakınız: $LOGFILE"
        echo ""
        echo "Cozum onerileri:"
        echo "1. Internet baglantinizi kontrol edin"
        echo "2. npm cache temizleyin: npm cache clean --force"
        echo "3. node_modules klasorunu silin ve tekrar deneyin"
        echo ""
        read -p "Devam etmek icin Enter'a basin..."
        exit 1
    fi

    echo "" >> "$LOGFILE"
    echo "[OK] Bagimliliklar basariyla yuklendi" >> "$LOGFILE"
    echo -e "${GREEN}[OK]${NC} Bagimliliklar basariyla yuklendi"
else
    echo -e "${GREEN}[OK]${NC} Bagimliliklar mevcut"
fi
echo ""

# Program baslat
echo -e "${BLUE}[5/5] Nova baslatiliyor...${NC}"
echo "[5/5] Nova baslatiliyor..." >> "$LOGFILE"
echo ""
echo "================================================"
echo "        NOVA BASLATILIYOR..."
echo "================================================"
echo ""
echo "Uygulama acildiginda bu pencereyi KAPATMAYIN!"
echo "Kapatmak icin: Ctrl+C"
echo ""
echo "Hata olusursa: $LOGFILE dosyasini kontrol edin"
echo ""

npm start 2>&1 | tee -a "$LOGFILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo ""
    echo -e "${RED}[HATA]${NC} Program baslatilirken hata olustu!"
    echo "Hata detaylari: $LOGFILE"
    echo ""
    read -p "Devam etmek icin Enter'a basin..."
fi
