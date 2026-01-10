import { useState, useEffect } from 'react';
import { usageService, UsageInfo } from '../services/usageService';

interface UsageDashboardProps {
  apiKeys: Record<string, string>;
  onClose: () => void;
}

export default function UsageDashboard({ apiKeys, onClose }: UsageDashboardProps) {
  const [usageInfo, setUsageInfo] = useState<Record<string, UsageInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageInfo();
  }, []);

  const loadUsageInfo = async () => {
    setLoading(true);
    try {
      const info = await usageService.getAllUsageInfo(apiKeys);
      setUsageInfo(info);
    } catch (error) {
      console.error('Error loading usage info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (info: UsageInfo) => {
    if (!info.hasKey) return 'text-gray-500';
    if (!info.isValid) return 'text-red-400';
    return 'text-green-400';
  };

  const getStatusIcon = (info: UsageInfo) => {
    if (!info.hasKey) return '⚪';
    if (!info.isValid) return '❌';
    return '✅';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-nova-dark rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">API Kullanım Durumu</h2>
            <p className="text-sm text-gray-400 mt-1">Tüm AI sağlayıcılarınızın durumunu görün</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadUsageInfo}
              disabled={loading}
              className="px-4 py-2 bg-nova-purple hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Yenile"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yenile
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-nova-purple border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-400">Yükleniyor...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(usageInfo).map(([key, info]) => (
                <div key={key} className="bg-nova-darker p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStatusIcon(info)}</span>
                      <div>
                        <h3 className="font-semibold">{info.provider}</h3>
                        <p className={`text-xs ${getStatusColor(info)}`}>
                          {!info.hasKey && 'API key yok'}
                          {info.hasKey && !info.isValid && (info.error || 'API key geçersiz')}
                          {info.hasKey && info.isValid && 'Aktif'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      info.isFree
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {info.isFree ? 'Ücretsiz' : 'Ücretli'}
                    </span>
                  </div>

                  {info.subscription && (
                    <div className="mb-3 p-2 bg-gray-800/50 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Plan:</span>
                        <span className="font-medium">{info.subscription.plan}</span>
                      </div>
                      {info.subscription.status && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-400">Durum:</span>
                          <span className="text-green-400">{info.subscription.status}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {info.usage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Kullanım:</span>
                        <span className="font-medium">
                          {info.usage.used !== undefined ? info.usage.used : '-'} / {info.usage.limit !== undefined ? info.usage.limit : '∞'} {info.usage.unit}
                        </span>
                      </div>
                      {info.usage.remaining !== undefined && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-nova-purple h-2 rounded-full transition-all"
                            style={{
                              width: `${info.usage.limit ? (info.usage.remaining / info.usage.limit) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      )}
                      {info.usage.period && (
                        <p className="text-xs text-gray-500">Periyot: {info.usage.period}</p>
                      )}
                    </div>
                  )}

                  {!info.hasKey && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-300">
                      <p>💡 API anahtarı eklemek için Ayarlar menüsünü kullanın</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-nova-darker">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-400">Aktif: {Object.values(usageInfo).filter(i => i.isValid).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span className="text-gray-400">Ücretli: {Object.values(usageInfo).filter(i => !i.isFree).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-gray-400">Ücretsiz: {Object.values(usageInfo).filter(i => i.isFree).length}</span>
              </div>
            </div>
            <p className="text-gray-500">Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
