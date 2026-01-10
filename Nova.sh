#!/bin/bash

# Nova AI Chatbot Launcher (macOS/Linux)
# Bu dosyayı çalıştırarak programı başlatabilirsiniz
# Kullanım: ./Nova.sh veya bash Nova.sh

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo ""
echo "================================================"
echo "          NOVA AI CHATBOT LAUNCHER"
echo "================================================"
echo ""

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}[HATA]${NC} Node.js bulunamadı!"
    echo ""
    echo "Lütfen Node.js yükleyin: https://nodejs.org/"
    echo ""
    read -p "Devam etmek için Enter'a basın..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}[OK]${NC} Node.js $NODE_VERSION bulundu"
echo ""

# npm kontrolü
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[HATA]${NC} npm bulunamadı!"
    exit 1
fi

# Proje klasörüne git
cd "$(dirname "$0")"

# node_modules kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!]${NC} Bağımlılıkların yüklenmesi gerekiyor..."
    echo ""
    echo "Yükleniyor... Lütfen bekleyin..."
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}[HATA]${NC} Bağımlılıkların yüklenmesi başarısız!"
        read -p "Devam etmek için Enter'a basın..."
        exit 1
    fi
    echo ""
    echo -e "${GREEN}[OK]${NC} Bağımlılıklar başarıyla yüklendi!"
    echo ""
else
    echo -e "${GREEN}[OK]${NC} Bağımlılıklar mevcut"
    echo ""
fi

# Ollama kontrolü (opsiyonel)
echo -e "${BLUE}[*]${NC} Ollama kontrol ediliyor..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} Ollama aktif"
else
    echo -e "${YELLOW}[!]${NC} Ollama bulunamadı (Opsiyonel - Yerel modeller için)"
fi
echo ""

# Programı başlat
echo "================================================"
echo "        NOVA BAŞLATILIYOR..."
echo "================================================"
echo ""
echo "Program açıldığında bu pencereyi kapatmayın!"
echo "Nova'yı kapatmak için Ctrl+C'ye basın."
echo ""

npm start
