import { useState } from 'react';

interface ExportMenuProps {
  content: string;
  onClose: () => void;
}

export default function ExportMenu({ content, onClose }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'word' | 'excel' | 'pdf' | null>(null);

  const handleExport = async (type: 'word' | 'excel' | 'pdf') => {
    setIsExporting(true);
    setExportType(type);

    try {
      let result;
      const timestamp = new Date().toISOString().split('T')[0];

      switch (type) {
        case 'word':
          result = await window.electronAPI.createWordDocument(content, `Nova_Rapor_${timestamp}.docx`);
          break;
        case 'excel':
          result = await window.electronAPI.createExcelDocument(content, `Nova_Rapor_${timestamp}.xlsx`);
          break;
        case 'pdf':
          result = await window.electronAPI.createPDFDocument(content, `Nova_Rapor_${timestamp}.pdf`);
          break;
      }

      if (result.success) {
        alert(`Dosya başarıyla oluşturuldu!\n${result.path}`);
        onClose();
      } else if (!result.canceled) {
        alert(`Hata: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-nova-dark rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Rapor Oluştur</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Konuşmanızdan bir rapor oluşturun ve bilgisayarınıza indirin.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => handleExport('word')}
            disabled={isExporting}
            className="w-full p-4 bg-nova-darker hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">Word Belgesi</h3>
              <p className="text-sm text-gray-400">Microsoft Word formatında (.docx)</p>
            </div>
            {isExporting && exportType === 'word' && (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="w-full p-4 bg-nova-darker hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6M9 15h6M9 11h6" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">Excel Belgesi</h3>
              <p className="text-sm text-gray-400">Microsoft Excel formatında (.xlsx)</p>
            </div>
            {isExporting && exportType === 'excel' && (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full p-4 bg-nova-darker hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6M10 9h4M10 13h4M10 17h4" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">PDF Belgesi</h3>
              <p className="text-sm text-gray-400">PDF formatında (.pdf)</p>
            </div>
            {isExporting && exportType === 'pdf' && (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-nova-purple/10 rounded-lg border border-nova-purple/30">
          <p className="text-xs text-gray-300">
            💡 <strong>İpucu:</strong> AI'dan rapor oluşturmasını isteyebilirsiniz. Örneğin:
            "Bu konuşmayı bir rapor haline getir" veya "Bu bilgilerden bir tablo oluştur"
          </p>
        </div>
      </div>
    </div>
  );
}
