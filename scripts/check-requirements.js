#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Nova Gereklilikler Kontrol Ediliyor...\n');

let hasErrors = false;

// Node.js versiyonu kontrolü
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

  if (majorVersion < 18) {
    console.error('❌ Node.js versiyonu 18 veya üzeri olmalıdır.');
    console.log(`   Mevcut versiyon: ${nodeVersion}`);
    console.log('   İndirmek için: https://nodejs.org/');
    hasErrors = true;
  } else {
    console.log(`✅ Node.js ${nodeVersion} - OK`);
  }
} catch (error) {
  console.error('❌ Node.js yüklü değil!');
  hasErrors = true;
}

// npm kontrolü
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm ${npmVersion} - OK`);
} catch (error) {
  console.error('❌ npm yüklü değil!');
  hasErrors = true;
}

// node_modules kontrolü
if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
  console.log('📦 Bağımlılıklar yükleniyor...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Bağımlılıklar yüklendi');
  } catch (error) {
    console.error('❌ Bağımlılıklar yüklenirken hata oluştu!');
    hasErrors = true;
  }
} else {
  console.log('✅ node_modules - OK');
}

// Ollama kontrolü
console.log('\n🤖 Ollama Kontrolü...');
try {
  const axios = require('axios');
  axios.get('http://localhost:11434/api/tags', { timeout: 3000 })
    .then(response => {
      const models = response.data.models || [];
      console.log(`✅ Ollama çalışıyor - ${models.length} model yüklü`);

      if (models.length === 0) {
        console.log('⚠️  Henüz model yüklü değil. Model yüklemek için:');
        console.log('   ollama pull llama2');
        console.log('   ollama pull mistral');
      } else {
        console.log('   Yüklü modeller:', models.map(m => m.name).join(', '));
      }
    })
    .catch(() => {
      console.log('⚠️  Ollama çalışmıyor veya yüklü değil');
      console.log('   Yerel modeller kullanmak için Ollama\'yı yükleyin:');
      console.log('   https://ollama.ai');
      console.log('   Not: Online AI servislerini kullanmak için Ollama gerekmez.');
    });
} catch (error) {
  console.log('⚠️  Ollama durumu kontrol edilemedi');
  console.log('   axios paketi eksik olabilir');
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Bazı gereklilikler eksik! Lütfen yukarıdaki hataları düzeltin.\n');
  process.exit(1);
} else {
  console.log('✅ Tüm temel gereklilikler karşılanıyor!\n');
  console.log('🚀 Uygulamayı başlatmak için: npm run dev');
  console.log('📦 Production build için: npm run build\n');
}
