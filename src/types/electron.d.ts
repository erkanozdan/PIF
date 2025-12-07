export interface ElectronAPI {
  // API Keys
  getApiKeys: () => Promise<Record<string, string>>;
  saveApiKey: (provider: string, apiKey: string) => Promise<{ success: boolean }>;

  // Conversations
  getConversations: () => Promise<any[]>;
  createConversation: (id: string, title: string, model: string) => Promise<any>;
  updateConversation: (id: string, title: string) => Promise<{ success: boolean }>;
  deleteConversation: (id: string) => Promise<{ success: boolean }>;

  // Messages
  getMessages: (conversationId: string) => Promise<any[]>;
  saveMessage: (id: string, conversationId: string, role: string, content: string) => Promise<any>;

  // Files
  selectFiles: () => Promise<string[]>;
  selectFolder: () => Promise<string | null>;
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  addFileToConversation: (
    id: string,
    conversationId: string,
    filePath: string,
    fileName: string,
    fileType: string,
    content: string
  ) => Promise<any>;
  getConversationFiles: (conversationId: string) => Promise<any[]>;
  removeFile: (id: string) => Promise<{ success: boolean }>;

  // Memory
  saveMemory: (id: string, key: string, value: string, category: string) => Promise<{ success: boolean }>;
  getMemory: (category?: string) => Promise<any[]>;

  // Ollama
  checkOllama: () => Promise<{ installed: boolean; models: any[] }>;
  getOllamaModels: () => Promise<any[]>;

  // Settings
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<{ success: boolean }>;

  // Document Creation
  createWordDocument: (content: string, fileName: string) => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>;
  createExcelDocument: (content: string, fileName: string) => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>;
  createPDFDocument: (content: string, fileName: string) => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
