const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // API Keys
  getApiKeys: () => ipcRenderer.invoke('get-api-keys'),
  saveApiKey: (provider, apiKey) => ipcRenderer.invoke('save-api-key', { provider, apiKey }),

  // Conversations
  getConversations: () => ipcRenderer.invoke('get-conversations'),
  createConversation: (id, title, model) => ipcRenderer.invoke('create-conversation', { id, title, model }),
  updateConversation: (id, title) => ipcRenderer.invoke('update-conversation', { id, title }),
  deleteConversation: (id) => ipcRenderer.invoke('delete-conversation', { id }),

  // Messages
  getMessages: (conversationId) => ipcRenderer.invoke('get-messages', { conversationId }),
  saveMessage: (id, conversationId, role, content) => ipcRenderer.invoke('save-message', { id, conversationId, role, content }),

  // Files
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', { filePath }),
  addFileToConversation: (id, conversationId, filePath, fileName, fileType, content) =>
    ipcRenderer.invoke('add-file-to-conversation', { id, conversationId, filePath, fileName, fileType, content }),
  getConversationFiles: (conversationId) => ipcRenderer.invoke('get-conversation-files', { conversationId }),
  removeFile: (id) => ipcRenderer.invoke('remove-file', { id }),

  // Memory
  saveMemory: (id, key, value, category) => ipcRenderer.invoke('save-memory', { id, key, value, category }),
  getMemory: (category) => ipcRenderer.invoke('get-memory', { category }),

  // Ollama
  checkOllama: () => ipcRenderer.invoke('check-ollama'),
  getOllamaModels: () => ipcRenderer.invoke('get-ollama-models'),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // Document Creation
  createWordDocument: (content, fileName) => ipcRenderer.invoke('create-word-document', { content, fileName }),
  createExcelDocument: (content, fileName) => ipcRenderer.invoke('create-excel-document', { content, fileName }),
  createPDFDocument: (content, fileName) => ipcRenderer.invoke('create-pdf-document', { content, fileName })
});
