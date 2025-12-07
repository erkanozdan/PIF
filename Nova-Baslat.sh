#!/bin/bash

# Nova Otomatik Baslatici - macOS/Linux
# Hatalari otomatik gosterir

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Dosya yollari
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HATA_RAPORU="$SCRIPT_DIR/hata-raporu.html"
HATA_METNI="$SCRIPT_DIR/HATA-MESAJI.txt"
LOGFILE="$SCRIPT_DIR/nova.log"

# Temiz basla
rm -f "$HATA_RAPORU"
rm -f "$HATA_METNI"
echo "Nova baslatiyor..." > "$LOGFILE"

clear
echo ""
echo "================================================"
echo "          NOVA AI CHATBOT"
echo "================================================"
echo ""
echo "Program hazirlaniyor..."
echo ""

# Hata gosterme fonksiyonu
show_error() {
    local BASLIK="$1"
    local MESAJ="$2"
    local COZUM="$3"

    # HTML hata raporu olustur
    cat > "$HATA_RAPORU" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova - Hata Raporu</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .error-box {
            background: #fee;
            border-left: 4px solid #e53e3e;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .error-box p {
            color: #c53030;
            font-size: 16px;
            line-height: 1.6;
        }
        .solution-box {
            background: #e6f7ff;
            border-left: 4px solid #1890ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .solution-box h2 {
            color: #0050b3;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .solution-box p {
            color: #0050b3;
            line-height: 1.8;
            font-size: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">⚠️</div>
            <h1>BASLIK_PLACEHOLDER</h1>
        </div>
        <div class="error-box">
            <p><strong>Hata:</strong> MESAJ_PLACEHOLDER</p>
        </div>
        <div class="solution-box">
            <h2>✅ Çözüm Adımları</h2>
            <p>COZUM_PLACEHOLDER</p>
        </div>
        <div class="footer">
            <p>Bu pencereyi kapatabilirsiniz.</p>
            <p>Sorunu çözdükten sonra <strong>Nova-Baslat.sh</strong> dosyasını tekrar çalıştırın.</p>
        </div>
    </div>
</body>
</html>
EOF

    # Placeholder'lari degistir
    sed -i.bak "s/BASLIK_PLACEHOLDER/$BASLIK/g" "$HATA_RAPORU"
    sed -i.bak "s/MESAJ_PLACEHOLDER/$MESAJ/g" "$HATA_RAPORU"
    sed -i.bak "s/COZUM_PLACEHOLDER/$COZUM/g" "$HATA_RAPORU"
    rm -f "$HATA_RAPORU.bak"

    # Metin dosyasina da yaz
    cat > "$HATA_METNI" << TXTEOF
================================================
NOVA HATA RAPORU
================================================

HATA: $BASLIK

MESAJ: $MESAJ

COZUM:
$COZUM

================================================
Bu dosyayi kopyalayip destek alabilirsiniz.
Tarih: $(date)
================================================
TXTEOF

    # Tarayicida ac
    if command -v xdg-open &> /dev/null; then
        xdg-open "$HATA_RAPORU" &
        xdg-open "$HATA_METNI" &
    elif command -v open &> /dev/null; then
        open "$HATA_RAPORU" &
        open "$HATA_METNI" &
    fi

    # Console'da da goster
    clear
    echo ""
    echo -e "${RED}================================================${NC}"
    echo -e "${RED}          HATA OLUSTU!${NC}"
    echo -e "${RED}================================================${NC}"
    echo ""
    echo -e "${RED}$BASLIK${NC}"
    echo ""
    echo "$MESAJ"
    echo ""
    echo "================================================"
    echo ""
    echo "> Tarayicinizda detayli cozum acildi"
    echo "> HATA-MESAJI.txt dosyasi olusturuldu (kopyalayabilirsiniz)"
    echo ""
    echo "================================================"
    echo ""
    echo "Bu pencereyi ACIK TUTUN!"
    echo "Ekran goruntusu alin veya metni kopyalayin."
    echo ""
    read -p "Kapatmak icin Enter'a basin..."

    exit 1
}

# Node.js kontrolu
if ! command -v node &> /dev/null; then
    show_error "Node.js Bulunamadi" \
        "Node.js yuklu degil!" \
        "1. https://nodejs.org adresine gidin<br>2. LTS versiyonunu indirin<br>3. Kurun<br>4. Terminal'i yeniden baslatın<br>5. Nova-Baslat.sh dosyasini tekrar calistirin"
fi

# npm kontrolu
if ! command -v npm &> /dev/null; then
    show_error "npm Bulunamadi" \
        "npm yuklu degil!" \
        "Node.js'i yeniden kurun:<br>https://nodejs.org"
fi

# Proje klasoru kontrolu
cd "$SCRIPT_DIR"
if [ ! -f "package.json" ]; then
    show_error "Proje Dosyalari Eksik" \
        "package.json bulunamadi!" \
        "Nova klasorunun icinde oldugunuzdan emin olun.<br>Dosyalari tekrar indirin."
fi

# Bagimliliklar kontrolu ve yukleme
if [ ! -d "node_modules" ]; then
    echo "Ilk kez calistiriliyor..."
    echo "Bagimliliklar yukleniyor (2-5 dakika surebilir)..."
    echo ""
    echo "Lutfen bekleyin!"
    echo ""

    npm install > "$LOGFILE" 2>&1

    if [ $? -ne 0 ]; then
        show_error "Yukleme Hatasi" \
            "Bagimliliklar yuklenemedi!" \
            "1. Internet baglantinizi kontrol edin<br>2. Tekrar deneyin<br>3. Hata devam ederse Terminal'de:<br>&nbsp;&nbsp;&nbsp;npm cache clean --force<br>&nbsp;&nbsp;&nbsp;npm install"
    fi
fi

# Programi baslat
echo ""
echo "================================================"
echo "Nova aciliyor..."
echo "================================================"
echo ""
echo "> Uygulama penceresi acildiginda bu pencereyi KAPATMAYIN!"
echo "> Nova'yi kapatmak icin bu pencerede Ctrl+C yapin"
echo ""

npm start 2>&1

# Hata kontrolu
if [ $? -ne 0 ]; then
    echo ""
    echo ""
    echo "[HATA] Program baslatilirken hata olustu!"
    echo ""
    show_error "Baslangic Hatasi" \
        "Nova baslatilirken hata olustu!" \
        "Lutfen ekran goruntusunu alin.<br><br>Deneyebilecekleriniz:<br>1. node_modules klasorunu silin<br>2. Nova-Baslat.sh dosyasini tekrar calistirin"
fi

read -p "Devam etmek icin Enter'a basin..."
