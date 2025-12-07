# Nova AI Chatbot

**Nova**, yerel ve online yapay zeka modellerini destekleyen, güçlü ve kullanıcı dostu bir masaüstü chatbot uygulamasıdır.

![Nova AI Chatbot](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ Özellikler

### 🤖 Çoklu AI Model Desteği
- **Yerel Modeller**: Ollama ile bilgisayarınızda çalışan modeller (llama2, mistral, codellama, vb.)
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, o1-preview, o1-mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash
- **Mistral AI**: Mistral Large, Medium, Small, Mixtral modelleri
- **Cohere**: Command R+, Command R
- **DeepSeek**: Chat ve Coder modelleri
- **Kimi (Moonshot)**: 8k, 32k, 128k context modelleri
- **Grok (xAI)**: Beta ve Vision modelleri

### 📊 API Kullanım Takibi
- Gerçek zamanlı API kullanım durumu
- Ücretli/ücretsiz model göstergeleri
- API key doğrulama
- Kullanım limitleri ve kalan kredi bilgisi
- Rate limit takibi

### 📁 Dosya Yönetimi
- Konuşmalara dosya ve klasör ekleme
- Desteklenen formatlar: Metin, kod, JSON, Markdown ve daha fazlası
- Dosya içeriklerini AI'a bağlam olarak gönderme

### 📄 Belge Oluşturma
- **Word (.docx)**: Microsoft Word formatında raporlar
- **Excel (.xlsx)**: Tablolar ve veri analizleri
- **PDF (.pdf)**: Profesyonel PDF belgeleri
- AI ile etkileşimli rapor hazırlama

### 💾 Akıllı Veri Yönetimi
- Otomatik konuşma geçmişi kaydetme
- SQLite tabanlı yerel veritabanı
- Hafıza sistemi ile kullanıcı bilgilerini saklama
- Konuşmalar arası süreklilik

### 🎨 Modern Kullanıcı Arayüzü
- Koyu tema tasarım
- Gerçek zamanlı mesaj akışı (streaming)
- Markdown ve kod vurgulama desteği
- Responsive ve kullanıcı dostu arayüz

### 🔒 Güvenlik ve Gizlilik
- API anahtarları bilgisayarınızda güvenli şekilde saklanır
- Verileriniz hiçbir yere gönderilmez
- Tamamen offline çalışabilme (Ollama ile)

## 🚀 Kurulum ve Başlatma

### Yöntem 1: Çift Tıkla Başlat (En Kolay) ⭐

#### Windows
1. `Nova.bat` dosyasına **çift tıklayın**
2. Otomatik olarak eksiklikler kontrol edilir ve kurulur
3. Program açılır!

#### macOS / Linux
1. Terminal'de: `bash Nova.sh` veya dosyaya çift tıklayın
2. Otomatik olarak eksiklikler kontrol edilir ve kurulur
3. Program açılır!

### Yöntem 2: Masaüstü Kısayolu Oluştur

```bash
npm install
npm run create-shortcut
```

Bu komut masaüstünüze bir kısayol oluşturur. Artık çift tıklayarak Nova'yı açabilirsiniz!

### Yöntem 3: Manuel Kurulum

#### Gereksinimler
- **Node.js** 18 veya üzeri ([İndir](https://nodejs.org/))
- **npm** (Node.js ile birlikte gelir)
- **Ollama** (opsiyonel, yerel modeller için) ([İndir](https://ollama.ai/))

#### Adımlar

```bash
# 1. Projeyi indirin
git clone https://github.com/yourusername/nova-chatbot.git
cd nova-chatbot

# 2. Otomatik kurulum
npm run setup

# 3. Uygulamayı başlatın
npm start

# VEYA Windows için:
Nova.bat

# VEYA macOS/Linux için:
bash Nova.sh
```

## 📖 Kullanım

### İlk Adımlar

1. **Yeni Konuşma Oluşturun**: Sol tarafta "Yeni Konuşma" butonuna tıklayın
2. **AI Model Seçin**: Üst kısımdaki dropdown menülerden sağlayıcı ve model seçin
3. **Mesaj Gönderin**: Alt kısımdaki metin kutusuna mesajınızı yazın ve Enter'a basın

### API Kullanım Durumunu Görme

1. Sol sidebar'daki 📊 (grafik) ikonuna tıklayın
2. Tüm API keylerinin durumunu görün
3. Ücretli/ücretsiz modelleri kontrol edin
4. Kullanım limitlerini takip edin

### API Anahtarı Ekleme

1. Sağ üst köşedeki ⚙️ ayarlar ikonuna tıklayın
2. "API Anahtarları" sekmesine gidin
3. Kullanmak istediğiniz sağlayıcının API anahtarını girin
4. "Kaydet" butonuna tıklayın

#### API Anahtarı Alma

| Sağlayıcı | Link | Durum |
|-----------|------|-------|
| **Ollama** | [ollama.ai](https://ollama.ai) | 🟢 Ücretsiz (Yerel) |
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | 🟠 Ücretli |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | 🟠 Ücretli |
| **Google** | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) | 🟢 Ücretsiz tier |
| **Mistral** | [console.mistral.ai/api-keys](https://console.mistral.ai/api-keys) | 🟠 Ücretli |
| **Cohere** | [dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys) | 🟢 Trial tier |
| **DeepSeek** | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) | 🟠 Ücretli |
| **Moonshot** | [platform.moonshot.cn/console/api-keys](https://platform.moonshot.cn/console/api-keys) | 🟠 Ücretli |
| **xAI (Grok)** | [console.x.ai](https://console.x.ai) | 🟢 Bazı modeller ücretsiz |

### Dosya Ekleme

1. Konuşma ekranında 📎 dosya ekle ikonuna tıklayın
2. Eklemek istediğiniz dosyaları seçin
3. Dosya içerikleri otomatik olarak AI'a gönderilir

### Rapor Oluşturma

1. Üst kısımdaki "Export" butonuna tıklayın
2. İstediğiniz format seçin (Word, Excel veya PDF)
3. Dosya konumunu seçin ve kaydedin

**İpucu**: AI'dan önce rapor hazırlamasını isteyin:
```
Bu konuşmayı bir rapor haline getir
```

### Ollama Kullanımı

Yerel modeller için Ollama kurmanız gerekir:

1. [Ollama'yı indirin](https://ollama.ai/)
2. Kurulumu tamamlayın
3. Terminal/Komut İstemcisi'nde model yükleyin:

```bash
# Önerilen modeller
ollama pull llama2        # Genel amaçlı
ollama pull mistral       # Hızlı ve güçlü
ollama pull codellama     # Kod yazma
ollama pull llama2:13b    # Daha büyük model
```

4. Nova'da "Ollama (Yerel)" sağlayıcısını seçin

## 🎯 Hızlı Başlangıç Komutları

```bash
# Kurulum ve başlatma
npm run setup             # İlk kurulum
npm start                 # Programı başlat

# Launcher scriptleri
./Nova.bat               # Windows (çift tık)
bash Nova.sh             # macOS/Linux

# Kısayol oluştur
npm run create-shortcut  # Masaüstü kısayolu

# Geliştirme
npm run dev              # Development mode
npm run build            # Production build
npm run build:electron   # Executable oluştur
```

## 🛠️ Geliştirme

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build          # Vite build
npm run build:electron # Electron executable oluştur
```

### Proje Yapısı

```
nova-chatbot/
├── electron/              # Electron ana süreç
│   ├── main.js           # Ana Electron dosyası
│   ├── preload.js        # Preload script
│   └── documentService.js # Belge oluşturma servisi
├── src/                  # React kaynak kodları
│   ├── components/       # UI komponentleri
│   ├── services/         # AI servisleri
│   └── types/            # TypeScript tipler
├── scripts/              # Yardımcı scriptler
│   ├── setup.js          # Kurulum scripti
│   ├── check-requirements.js
│   └── create-shortcut.js # Kısayol oluşturma
├── Nova.bat              # Windows launcher
├── Nova.sh               # macOS/Linux launcher
└── package.json
```

## 🔧 Teknolojiler

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron 33
- **Database**: SQLite (better-sqlite3)
- **AI SDKs**: OpenAI, Anthropic, Google, Mistral, Cohere, DeepSeek, Moonshot, xAI
- **Document Generation**: docx, exceljs, pdfkit
- **Build**: Vite, electron-builder

## 🐛 Sorun Giderme

### "Node.js bulunamadı" hatası
- [Node.js](https://nodejs.org/) indirip kurun
- Terminal'i yeniden başlatın

### "npm install" başarısız oluyor
```bash
# Cache'i temizleyin
npm cache clean --force
npm install
```

### Ollama bağlanamıyor
- Ollama'nın çalıştığından emin olun: `ollama list`
- Varsayılan port kullanılıyor mu kontrol edin (11434)

### Uygulama açılmıyor
1. `node_modules` klasörünü silin
2. `npm install` komutunu çalıştırın
3. Tekrar başlatın

## 📝 Yapılacaklar

- [ ] Resim analizi ve görsel envanter sistemi
- [ ] Dosya sınıflandırma (MSDS, TDS, vb.)
- [ ] Bilimsel makale araştırma entegrasyonu
- [ ] Gelişmiş hafıza ve araştırma sistemi
- [ ] Ses kaydı ve transkripsyon
- [ ] Çoklu dil desteği
- [ ] Tema özelleştirme
- [ ] Plugin sistemi
- [ ] Model otomatik güncelleme

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Sorun Bildirimi

Bir sorunla karşılaştıysanız, lütfen GitHub Issues üzerinden bildirin.

## 💬 İletişim

- **GitHub**: [@yourusername](https://github.com/yourusername)

## 🙏 Teşekkürler

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Ollama](https://ollama.ai/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://anthropic.com/)
- [Google AI](https://ai.google.dev/)
- Tüm açık kaynak katkıcılara

---

**Nova** ile güçlü AI asistanınızı masaüstünüzde kullanın! 🚀

### 🎯 Hızlı Başlangıç

1. **İlk kez kullanıyorsanız:**
   ```bash
   npm run setup
   npm run create-shortcut
   ```

2. **Sonraki kullanımlar:**
   - Windows: `Nova.bat` dosyasına çift tıklayın
   - macOS/Linux: `Nova.sh` dosyasını çalıştırın
   - Veya masaüstündeki kısayola çift tıklayın

3. **Ayarlardan API anahtarlarınızı ekleyin**

4. **Nova ile sohbete başlayın!**
