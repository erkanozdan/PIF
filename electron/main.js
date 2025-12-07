const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const Store = require('electron-store');
const documentService = require('./documentService');

const store = new Store();
let mainWindow;
let db;

// Veritabanını başlat
function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'nova.db');
  db = new Database(dbPath);

  // Konuşmalar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT,
      model TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Mesajlar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      role TEXT,
      content TEXT,
      timestamp INTEGER,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `);

  // Dosyalar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      file_path TEXT,
      file_name TEXT,
      file_type TEXT,
      content TEXT,
      added_at INTEGER,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `);

  // Hafıza tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'default',
      key TEXT,
      value TEXT,
      category TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  console.log('Database initialized at:', dbPath);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#1a1a2e',
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'Nova AI Chatbot'
  });

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

// IPC Handlers

// API Keys
ipcMain.handle('get-api-keys', async () => {
  return store.get('apiKeys', {});
});

ipcMain.handle('save-api-key', async (event, { provider, apiKey }) => {
  const apiKeys = store.get('apiKeys', {});
  apiKeys[provider] = apiKey;
  store.set('apiKeys', apiKeys);
  return { success: true };
});

// Conversations
ipcMain.handle('get-conversations', async () => {
  const conversations = db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all();
  return conversations;
});

ipcMain.handle('create-conversation', async (event, { id, title, model }) => {
  const now = Date.now();
  db.prepare('INSERT INTO conversations (id, title, model, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(id, title, model, now, now);
  return { id, title, model, created_at: now, updated_at: now };
});

ipcMain.handle('update-conversation', async (event, { id, title }) => {
  const now = Date.now();
  db.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?')
    .run(title, now, id);
  return { success: true };
});

ipcMain.handle('delete-conversation', async (event, { id }) => {
  db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
  db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(id);
  db.prepare('DELETE FROM files WHERE conversation_id = ?').run(id);
  return { success: true };
});

// Messages
ipcMain.handle('get-messages', async (event, { conversationId }) => {
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC')
    .all(conversationId);
  return messages;
});

ipcMain.handle('save-message', async (event, { id, conversationId, role, content }) => {
  const timestamp = Date.now();
  db.prepare('INSERT INTO messages (id, conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)')
    .run(id, conversationId, role, content, timestamp);

  // Konuşma güncelleme zamanını güncelle
  db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?')
    .run(timestamp, conversationId);

  return { id, conversation_id: conversationId, role, content, timestamp };
});

// Files
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Tüm Dosyalar', extensions: ['*'] },
      { name: 'Metin Dosyaları', extensions: ['txt', 'md', 'json', 'js', 'ts', 'py', 'java', 'cpp', 'c', 'h'] },
      { name: 'Dokümanlar', extensions: ['pdf', 'doc', 'docx'] }
    ]
  });

  if (result.canceled) {
    return [];
  }

  return result.filePaths;
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle('read-file', async (event, { filePath }) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('add-file-to-conversation', async (event, { id, conversationId, filePath, fileName, fileType, content }) => {
  const now = Date.now();
  db.prepare('INSERT INTO files (id, conversation_id, file_path, file_name, file_type, content, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, conversationId, filePath, fileName, fileType, content, now);
  return { id, conversation_id: conversationId, file_path: filePath, file_name: fileName, file_type: fileType, content, added_at: now };
});

ipcMain.handle('get-conversation-files', async (event, { conversationId }) => {
  const files = db.prepare('SELECT * FROM files WHERE conversation_id = ? ORDER BY added_at DESC')
    .all(conversationId);
  return files;
});

ipcMain.handle('remove-file', async (event, { id }) => {
  db.prepare('DELETE FROM files WHERE id = ?').run(id);
  return { success: true };
});

// Memory
ipcMain.handle('save-memory', async (event, { id, key, value, category }) => {
  const now = Date.now();
  db.prepare(`
    INSERT INTO memory (id, key, value, category, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET value = ?, updated_at = ?
  `).run(id, key, value, category, now, now, value, now);
  return { success: true };
});

ipcMain.handle('get-memory', async (event, { category }) => {
  let query = 'SELECT * FROM memory';
  if (category) {
    query += ' WHERE category = ?';
    return db.prepare(query).all(category);
  }
  return db.prepare(query).all();
});

// Ollama kontrol
ipcMain.handle('check-ollama', async () => {
  try {
    const axios = require('axios');
    const response = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 });
    return { installed: true, models: response.data.models || [] };
  } catch (error) {
    return { installed: false, models: [] };
  }
});

ipcMain.handle('get-ollama-models', async () => {
  try {
    const axios = require('axios');
    const response = await axios.get('http://localhost:11434/api/tags');
    return response.data.models || [];
  } catch (error) {
    console.error('Ollama models error:', error);
    return [];
  }
});

// Settings
ipcMain.handle('get-settings', async () => {
  return store.get('settings', {
    theme: 'dark',
    language: 'tr',
    autoUpdate: true
  });
});

ipcMain.handle('save-settings', async (event, settings) => {
  store.set('settings', settings);
  return { success: true };
});

// Document Creation
ipcMain.handle('create-word-document', async (event, { content, fileName }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName || 'document.docx',
      filters: [
        { name: 'Word Belgesi', extensions: ['docx'] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    return await documentService.createWordDocument(content, result.filePath);
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-excel-document', async (event, { content, fileName }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName || 'spreadsheet.xlsx',
      filters: [
        { name: 'Excel Belgesi', extensions: ['xlsx'] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    return await documentService.createExcelDocument(content, result.filePath);
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-pdf-document', async (event, { content, fileName }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: fileName || 'document.pdf',
      filters: [
        { name: 'PDF Belgesi', extensions: ['pdf'] }
      ]
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    return await documentService.createPDFDocument(content, result.filePath);
  } catch (error) {
    return { success: false, error: error.message };
  }
});
