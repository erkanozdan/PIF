import { useState, useRef, useEffect } from 'react';
import { Conversation, Message, FileAttachment } from '../App';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ExportMenu from './ExportMenu';

interface ChatAreaProps {
  currentConversation: Conversation | null;
  messages: Message[];
  files: FileAttachment[];
  selectedProvider: string;
  selectedModel: string;
  availableModels: string[];
  onSendMessage: (content: string, onChunk?: (text: string) => void) => void;
  onAddFiles: () => void;
  onRemoveFile: (fileId: string) => void;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

const PROVIDERS = [
  { id: 'ollama', name: 'Ollama (Yerel)', icon: '🏠' },
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic Claude', icon: '🔮' },
  { id: 'google', name: 'Google Gemini', icon: '✨' },
  { id: 'mistral', name: 'Mistral AI', icon: '🌊' },
  { id: 'cohere', name: 'Cohere', icon: '🧠' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🇨🇳' },
  { id: 'moonshot', name: 'Kimi (Moonshot)', icon: '🌙' },
  { id: 'xai', name: 'Grok (xAI)', icon: '𝕏' }
];

export default function ChatArea({
  currentConversation,
  messages,
  files,
  selectedProvider,
  selectedModel,
  availableModels,
  onSendMessage,
  onAddFiles,
  onRemoveFile,
  onProviderChange,
  onModelChange
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const message = input;
    setInput('');
    setIsStreaming(true);
    setStreamingMessage('');

    await onSendMessage(message, (chunk) => {
      setStreamingMessage(prev => prev + chunk);
    });

    setIsStreaming(false);
    setStreamingMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-nova-darker">
        <div className="text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold mb-2">Nova'ya Hoş Geldiniz</h2>
          <p className="text-gray-400 mb-6">Başlamak için yeni bir konuşma oluşturun</p>
          <div className="text-sm text-gray-500">
            <p>✨ Birden fazla AI modeli desteği</p>
            <p>📁 Dosya ve klasör ekleme</p>
            <p>💾 Otomatik konuşma kaydetme</p>
            <p>🧠 Akıllı hafıza sistemi</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-nova-darker">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-nova-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{currentConversation.title}</h2>

          <div className="flex gap-3">
            {/* Export Button */}
            <button
              onClick={() => setShowExportMenu(true)}
              className="px-3 py-2 bg-nova-purple hover:bg-purple-600 rounded-lg text-sm transition-colors flex items-center gap-2"
              title="Rapor Oluştur"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>

            {/* Provider Selection */}
            <select
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nova-purple"
            >
              {PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.icon} {provider.name}
                </option>
              ))}
            </select>

            {/* Model Selection */}
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nova-purple"
              disabled={availableModels.length === 0}
            >
              {availableModels.length === 0 ? (
                <option>Model bulunamadı</option>
              ) : (
                availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Files */}
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1 bg-nova-purple/20 rounded-lg text-sm"
              >
                <span>📄 {file.file_name}</span>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-nova-purple text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Message */}
        {isStreaming && streamingMessage && (
          <div className="flex justify-start fade-in">
            <div className="max-w-[80%] p-4 rounded-lg bg-gray-700 text-gray-100">
              <div className="markdown-content">
                <ReactMarkdown>{streamingMessage}</ReactMarkdown>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-nova-purple rounded-full animate-pulse"></div>
                Yazıyor...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-nova-dark">
        <div className="flex gap-2">
          <button
            onClick={onAddFiles}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Dosya Ekle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile yeni satır)"
            className="flex-1 p-3 bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-nova-purple"
            rows={3}
            disabled={isStreaming}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="px-6 bg-nova-purple hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isStreaming ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Export Menu */}
      {showExportMenu && (
        <ExportMenu
          content={messages.map(m => `${m.role === 'user' ? 'Kullanıcı' : 'Nova'}: ${m.content}`).join('\n\n')}
          onClose={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}
