#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Nova Kurulum Başlatılıyor...\n');
console.log('='.repeat(50) + '\n');

// 1. Node.js kontrolü
console.log('1️⃣  Node.js Versiyonu Kontrol Ediliyor...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 18) {
  console.error('❌ Node.js 18 veya üzeri gereklidir!');
  console.log('   Mevcut versiyon:', nodeVersion);
  console.log('   Lütfen https://nodejs.org/ adresinden güncel sürümü indirin.');
  process.exit(1);
}
console.log(`✅ Node.js ${nodeVersion}\n`);

// 2. Bağımlılıkları yükle
console.log('2️⃣  Bağımlılıklar Yükleniyor...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Bağımlılıklar yüklendi\n');
} catch (error) {
  console.error('❌ Bağımlılıklar yüklenirken hata oluştu!');
  process.exit(1);
}

// 3. Veritabanı dizinini oluştur
console.log('3️⃣  Veritabanı Hazırlanıyor...');
const userDataPath = process.env.APPDATA ||
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config');
const novaDataPath = path.join(userDataPath, 'nova-chatbot');

if (!fs.existsSync(novaDataPath)) {
  fs.mkdirSync(novaDataPath, { recursive: true });
}
console.log(`✅ Veri dizini: ${novaDataPath}\n`);

// 4. Ollama kontrolü
console.log('4️⃣  Ollama Kontrolü...');
try {
  const axios = require('axios');

  axios.get('http://localhost:11434/api/tags', { timeout: 3000 })
    .then(response => {
      const models = response.data.models || [];
      console.log(`✅ Ollama çalışıyor - ${models.length} model bulundu`);

      if (models.length > 0) {
        console.log('   Yüklü modeller:');
        models.forEach(model => {
          console.log(`   - ${model.name}`);
        });
      } else {
        console.log('\n⚠️  Henüz model yüklenmemiş. Başlamak için:');
        console.log('   ollama pull llama2');
        console.log('   ollama pull mistral');
        console.log('   ollama pull codellama\n');
      }

      finishSetup();
    })
    .catch(() => {
      console.log('⚠️  Ollama çalışmıyor veya yüklü değil');
      console.log('\n📝 Ollama Kurulumu (Opsiyonel - Yerel Modeller İçin):');
      console.log('   1. https://ollama.ai adresine gidin');
      console.log('   2. İşletim sisteminiz için kurulum dosyasını indirin');
      console.log('   3. Kurulumu tamamlayın');
      console.log('   4. Bir model yükleyin: ollama pull llama2');
      console.log('\n   Not: Online AI servislerini (OpenAI, Anthropic, vb.) kullanmak için');
      console.log('   Ollama kurmanıza gerek yoktur. API anahtarlarınızı ayarlarda');
      console.log('   girebilirsiniz.\n');

      finishSetup();
    });
} catch (error) {
  console.log('⚠️  Ollama durumu kontrol edilemedi\n');
  finishSetup();
}

function finishSetup() {
  console.log('='.repeat(50));
  console.log('\n🎉 Nova Kurulumu Tamamlandı!\n');
  console.log('🚀 Uygulamayı başlatmak için:');
  console.log('   npm start          - Geliştirme modu');
  console.log('   npm run build      - Production build\n');
  console.log('📚 Daha fazla bilgi için README.md dosyasını okuyun.\n');
  console.log('💡 İpucu: Ayarlar menüsünden API anahtarlarınızı ekleyebilirsiniz.\n');
}
