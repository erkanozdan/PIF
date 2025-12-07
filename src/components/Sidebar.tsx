import { Conversation } from '../App';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewConversation: () => void;
  onSelectConversation: (conv: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  conversations,
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onOpenSettings
}: SidebarProps) {
  return (
    <div className="w-64 bg-nova-dark border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-nova-purple to-nova-blue bg-clip-text text-transparent">
            Nova
          </h1>
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Ayarlar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <button
          onClick={onNewConversation}
          className="w-full py-2 px-4 bg-nova-purple hover:bg-purple-600 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Konuşma
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-all ${
              currentConversation?.id === conv.id
                ? 'bg-nova-purple/20 border border-nova-purple'
                : 'hover:bg-gray-700/50'
            }`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{conv.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{conv.model}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Bu konuşmayı silmek istediğinizden emin misiniz?')) {
                    onDeleteConversation(conv.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                title="Sil"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">Henüz konuşma yok</p>
            <p className="text-xs mt-2">Yeni bir konuşma başlatın</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Nova AI Chatbot v1.0
        </div>
      </div>
    </div>
  );
}
