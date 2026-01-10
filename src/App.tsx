import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Settings from './components/Settings';
import UsageDashboard from './components/UsageDashboard';
import { aiService } from './services/aiService';

export interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: number;
  updated_at: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface FileAttachment {
  id: string;
  conversation_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  content: string;
  added_at: number;
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showUsageDashboard, setShowUsageDashboard] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [selectedProvider, setSelectedProvider] = useState('ollama');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Konuşmaları yükle
  useEffect(() => {
    loadConversations();
    loadApiKeys();
  }, []);

  // API keyler değiştiğinde modelleri yükle
  useEffect(() => {
    loadModels();
  }, [selectedProvider, apiKeys]);

  const loadConversations = async () => {
    const convs = await window.electronAPI.getConversations();
    setConversations(convs);
  };

  const loadApiKeys = async () => {
    const keys = await window.electronAPI.getApiKeys();
    setApiKeys(keys);
  };

  const loadModels = async () => {
    try {
      const apiKey = apiKeys[selectedProvider];
      const models = await aiService.getAvailableModels(selectedProvider, apiKey);
      setAvailableModels(models);
      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      console.error('Error loading models:', error);
      setAvailableModels([]);
    }
  };

  const createNewConversation = async () => {
    const id = crypto.randomUUID();
    const title = 'Yeni Konuşma';
    const model = `${selectedProvider}:${selectedModel}`;

    const newConv = await window.electronAPI.createConversation(id, title, model);
    setConversations([newConv, ...conversations]);
    setCurrentConversation(newConv);
    setMessages([]);
    setFiles([]);
  };

  const selectConversation = async (conv: Conversation) => {
    setCurrentConversation(conv);
    const msgs = await window.electronAPI.getMessages(conv.id);
    setMessages(msgs);

    const convFiles = await window.electronAPI.getConversationFiles(conv.id);
    setFiles(convFiles);

    // Model bilgisini ayarla
    const [provider, model] = conv.model.split(':');
    if (provider && model) {
      setSelectedProvider(provider);
      setSelectedModel(model);
    }
  };

  const deleteConversation = async (id: string) => {
    await window.electronAPI.deleteConversation(id);
    setConversations(conversations.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
      setFiles([]);
    }
  };

  const sendMessage = async (content: string, onChunk?: (text: string) => void) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    // Kullanıcı mesajını kaydet
    const userMsgId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMsgId,
      conversation_id: currentConversation.id,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    await window.electronAPI.saveMessage(userMsgId, currentConversation.id, 'user', content);
    setMessages(prev => [...prev, userMessage]);

    // Dosya içeriklerini ekle
    let fullContent = content;
    if (files.length > 0) {
      const fileContext = files.map(f => `\n\n[Dosya: ${f.file_name}]\n${f.content}`).join('\n');
      fullContent = content + fileContext;
    }

    // AI'dan yanıt al
    const apiKey = apiKeys[selectedProvider];
    const conversationMessages = [...messages, { role: 'user' as const, content: fullContent }];

    try {
      let assistantContent = '';
      const assistantMsgId = crypto.randomUUID();

      await aiService.streamMessage(
        selectedProvider,
        conversationMessages,
        selectedModel,
        {
          onChunk: (text) => {
            assistantContent += text;
            if (onChunk) onChunk(text);
          },
          onComplete: async () => {
            const assistantMessage: Message = {
              id: assistantMsgId,
              conversation_id: currentConversation.id,
              role: 'assistant',
              content: assistantContent,
              timestamp: Date.now()
            };

            await window.electronAPI.saveMessage(
              assistantMsgId,
              currentConversation.id,
              'assistant',
              assistantContent
            );

            setMessages(prev => [...prev, assistantMessage]);

            // Konuşma başlığını güncelle (ilk mesajsa)
            if (messages.length === 0) {
              const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
              await window.electronAPI.updateConversation(currentConversation.id, title);
              setConversations(prev =>
                prev.map(c => (c.id === currentConversation.id ? { ...c, title } : c))
              );
            }
          },
          onError: (error) => {
            console.error('AI Error:', error);
            alert('Hata: ' + error.message);
          }
        },
        apiKey
      );
    } catch (error: any) {
      console.error('Send message error:', error);
      alert('Mesaj gönderilirken hata oluştu: ' + error.message);
    }
  };

  const addFiles = async () => {
    const filePaths = await window.electronAPI.selectFiles();

    for (const filePath of filePaths) {
      const result = await window.electronAPI.readFile(filePath);

      if (result.success && currentConversation) {
        const fileId = crypto.randomUUID();
        const fileName = filePath.split(/[\\/]/).pop() || 'unknown';
        const fileType = fileName.split('.').pop() || 'txt';

        await window.electronAPI.addFileToConversation(
          fileId,
          currentConversation.id,
          filePath,
          fileName,
          fileType,
          result.content
        );

        const newFile: FileAttachment = {
          id: fileId,
          conversation_id: currentConversation.id,
          file_path: filePath,
          file_name: fileName,
          file_type: fileType,
          content: result.content,
          added_at: Date.now()
        };

        setFiles(prev => [...prev, newFile]);
      }
    }
  };

  const removeFile = async (fileId: string) => {
    await window.electronAPI.removeFile(fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="flex h-screen bg-nova-darker">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onOpenSettings={() => setShowSettings(true)}
        onOpenUsage={() => setShowUsageDashboard(true)}
      />

      <ChatArea
        currentConversation={currentConversation}
        messages={messages}
        files={files}
        selectedProvider={selectedProvider}
        selectedModel={selectedModel}
        availableModels={availableModels}
        onSendMessage={sendMessage}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
        onProviderChange={setSelectedProvider}
        onModelChange={setSelectedModel}
      />

      {showSettings && (
        <Settings
          apiKeys={apiKeys}
          onClose={() => setShowSettings(false)}
          onSaveApiKey={async (provider, key) => {
            await window.electronAPI.saveApiKey(provider, key);
            await loadApiKeys();
          }}
        />
      )}

      {showUsageDashboard && (
        <UsageDashboard
          apiKeys={apiKeys}
          onClose={() => setShowUsageDashboard(false)}
        />
      )}
    </div>
  );
}

export default App;
