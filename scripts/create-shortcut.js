#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Nova Masaüstü Kısayolu Oluşturuluyor...\n');

const platform = os.platform();
const projectDir = path.resolve(__dirname, '..');
const homeDir = os.homedir();

function createWindowsShortcut() {
  try {
    const desktopPath = path.join(homeDir, 'Desktop');
    const shortcutPath = path.join(desktopPath, 'Nova AI Chatbot.lnk');

    // Windows shortcut oluşturmak için PowerShell kullan
    const { execSync } = require('child_process');
    const batPath = path.join(projectDir, 'Nova.bat');
    const iconPath = path.join(projectDir, 'assets', 'icon.ico');

    const psScript = `
      $WshShell = New-Object -comObject WScript.Shell
      $Shortcut = $WshShell.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}")
      $Shortcut.TargetPath = "${batPath.replace(/\\/g, '\\\\')}"
      $Shortcut.WorkingDirectory = "${projectDir.replace(/\\/g, '\\\\')}"
      $Shortcut.Description = "Nova AI Chatbot - Güçlü AI Asistanı"
      $Shortcut.Save()
    `;

    execSync(`powershell -Command "${psScript}"`, { stdio: 'inherit' });

    console.log('✅ Windows kısayolu oluşturuldu!');
    console.log(`📍 Konum: ${shortcutPath}\n`);
    return true;
  } catch (error) {
    console.error('❌ Windows kısayolu oluşturulamadı:', error.message);
    return false;
  }
}

function createMacShortcut() {
  try {
    const desktopPath = path.join(homeDir, 'Desktop');
    const shortcutPath = path.join(desktopPath, 'Nova AI Chatbot.command');
    const shPath = path.join(projectDir, 'Nova.sh');

    // macOS için .command dosyası oluştur
    const content = `#!/bin/bash
cd "${projectDir}"
bash "${shPath}"
`;

    fs.writeFileSync(shortcutPath, content, { mode: 0o755 });

    console.log('✅ macOS kısayolu oluşturuldu!');
    console.log(`📍 Konum: ${shortcutPath}\n`);
    return true;
  } catch (error) {
    console.error('❌ macOS kısayolu oluşturulamadı:', error.message);
    return false;
  }
}

function createLinuxShortcut() {
  try {
    const desktopPath = path.join(homeDir, 'Desktop');
    const applicationsPath = path.join(homeDir, '.local', 'share', 'applications');
    const shPath = path.join(projectDir, 'Nova.sh');
    const iconPath = path.join(projectDir, 'assets', 'icon.png');

    // .desktop dosyası oluştur
    const desktopEntry = `[Desktop Entry]
Version=1.0
Type=Application
Name=Nova AI Chatbot
Comment=Güçlü AI Chatbot Uygulaması
Exec=bash "${shPath}"
Icon=${iconPath}
Terminal=true
Categories=Office;Utility;
`;

    // Applications klasörüne kısayol
    if (!fs.existsSync(applicationsPath)) {
      fs.mkdirSync(applicationsPath, { recursive: true });
    }

    const appShortcutPath = path.join(applicationsPath, 'nova-ai-chatbot.desktop');
    fs.writeFileSync(appShortcutPath, desktopEntry, { mode: 0o755 });

    // Desktop'a da kısayol
    const desktopShortcutPath = path.join(desktopPath, 'Nova AI Chatbot.desktop');
    fs.writeFileSync(desktopShortcutPath, desktopEntry, { mode: 0o755 });

    console.log('✅ Linux kısayolları oluşturuldu!');
    console.log(`📍 Uygulama menüsü: ${appShortcutPath}`);
    console.log(`📍 Masaüstü: ${desktopShortcutPath}\n`);
    return true;
  } catch (error) {
    console.error('❌ Linux kısayolları oluşturulamadı:', error.message);
    return false;
  }
}

// Platform'a göre kısayol oluştur
let success = false;

switch (platform) {
  case 'win32':
    console.log('🪟 Windows tespit edildi\n');
    success = createWindowsShortcut();
    break;

  case 'darwin':
    console.log('🍎 macOS tespit edildi\n');
    success = createMacShortcut();
    break;

  case 'linux':
    console.log('🐧 Linux tespit edildi\n');
    success = createLinuxShortcut();
    break;

  default:
    console.log(`⚠️  Desteklenmeyen platform: ${platform}`);
    success = false;
}

if (success) {
  console.log('🎉 Kısayol başarıyla oluşturuldu!');
  console.log('📌 Artık masaüstünden Nova\'yı çift tıklayarak açabilirsiniz.\n');
  console.log('💡 İpucu:');
  console.log('   - Windows: Nova AI Chatbot.lnk dosyasına çift tıklayın');
  console.log('   - macOS: Nova AI Chatbot.command dosyasına çift tıklayın');
  console.log('   - Linux: Nova AI Chatbot.desktop dosyasına çift tıklayın\n');
} else {
  console.log('\n❌ Kısayol oluşturulamadı. Manuel olarak başlatıcı scriptleri kullanın:');
  console.log(`   Windows: ${path.join(projectDir, 'Nova.bat')}`);
  console.log(`   macOS/Linux: ${path.join(projectDir, 'Nova.sh')}\n`);
  process.exit(1);
}
