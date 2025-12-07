import { useState } from 'react';

interface SettingsProps {
  apiKeys: Record<string, string>;
  onClose: () => void;
  onSaveApiKey: (provider: string, apiKey: string) => void;
}

const PROVIDER_INFO = [
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Yerel AI modelleri (API key gerekmez)',
    link: 'https://ollama.ai',
    requiresKey: false
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5 ve diğer OpenAI modelleri',
    link: 'https://platform.openai.com/api-keys',
    requiresKey: true
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 model ailesi',
    link: 'https://console.anthropic.com/settings/keys',
    requiresKey: true
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Gemini model ailesi',
    link: 'https://makersuite.google.com/app/apikey',
    requiresKey: true
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral ve Mixtral modelleri',
    link: 'https://console.mistral.ai/api-keys',
    requiresKey: true
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Command modelleri',
    link: 'https://dashboard.cohere.com/api-keys',
    requiresKey: true
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek Chat ve Coder modelleri',
    link: 'https://platform.deepseek.com/api_keys',
    requiresKey: true
  },
  {
    id: 'moonshot',
    name: 'Kimi (Moonshot)',
    description: 'Kimi AI modelleri (8k, 32k, 128k)',
    link: 'https://platform.moonshot.cn/console/api-keys',
    requiresKey: true
  },
  {
    id: 'xai',
    name: 'Grok (xAI)',
    description: 'Grok modelleri',
    link: 'https://console.x.ai',
    requiresKey: true
  }
];

export default function Settings({ apiKeys, onClose, onSaveApiKey }: SettingsProps) {
  const [keys, setKeys] = useState<Record<string, string>>(apiKeys);
  const [activeTab, setActiveTab] = useState('api-keys');

  const handleSave = (provider: string) => {
    onSaveApiKey(provider, keys[provider] || '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-nova-dark rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Ayarlar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'api-keys'
                  ? 'text-nova-purple border-b-2 border-nova-purple'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              API Anahtarları
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === 'about'
                  ? 'text-nova-purple border-b-2 border-nova-purple'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hakkında
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">
                AI sağlayıcılarından API anahtarlarınızı buraya ekleyin. Anahtarlar güvenli bir şekilde
                bilgisayarınızda saklanır ve hiçbir yere gönderilmez.
              </p>

              {PROVIDER_INFO.map(provider => (
                <div key={provider.id} className="bg-nova-darker p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <p className="text-sm text-gray-400">{provider.description}</p>
                    </div>
                    {provider.requiresKey && (
                      <a
                        href={provider.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-nova-blue hover:text-blue-400 text-sm flex items-center gap-1"
                      >
                        API Key Al
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {provider.requiresKey ? (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={keys[provider.id] || ''}
                        onChange={(e) => setKeys({ ...keys, [provider.id]: e.target.value })}
                        placeholder="API anahtarınızı girin"
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-purple"
                      />
                      <button
                        onClick={() => handleSave(provider.id)}
                        className="px-4 py-2 bg-nova-purple hover:bg-purple-600 rounded-lg transition-colors"
                      >
                        Kaydet
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-green-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      API anahtarı gerekmez
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-nova-purple to-nova-blue bg-clip-text text-transparent mb-2">
                  Nova
                </h1>
                <p className="text-gray-400">Güçlü AI Chatbot Uygulaması</p>
                <p className="text-sm text-gray-500 mt-2">Versiyon 1.0.0</p>
              </div>

              <div className="bg-nova-darker p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Özellikler</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Birden fazla AI sağlayıcı desteği (Ollama, OpenAI, Anthropic, Google, Mistral, Cohere)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Yerel ve bulut tabanlı modeller
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Dosya ve klasör ekleme desteği
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Otomatik konuşma geçmişi kaydetme
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Akıllı hafıza sistemi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Gerçek zamanlı yanıt akışı
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Modern ve kullanıcı dostu arayüz
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-nova-purple">✓</span>
                    Cross-platform destek (Windows, macOS, Linux)
                  </li>
                </ul>
              </div>

              <div className="bg-nova-darker p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Teknolojiler</h3>
                <div className="flex flex-wrap gap-2">
                  {['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Node.js'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-nova-purple/20 rounded-lg text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
