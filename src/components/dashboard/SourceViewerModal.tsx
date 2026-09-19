import React from 'react';
import { LessonData } from '../../types/curriculum';
import { FileText, X, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonData: LessonData | null;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({
  isOpen,
  onClose,
  lessonData,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !lessonData) return null;

  const rawJsonSnippet = JSON.stringify(lessonData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJsonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Xác Minh Nguồn Dữ Liệu Gốc (Data Source Verification)</h3>
              <p className="text-xs text-slate-400">
                Thông tin được trích xuất từ tài liệu PPCT và Quy định chính thức trong `/raw-documents`
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Source Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Khung Phân Phối Chương Trình (PPCT):
              </span>
              <p className="text-slate-700 font-medium">{lessonData.source || `PPCT Global Success Tiếng Anh Lớp ${lessonData.grade}`}</p>
              <span className="text-[11px] font-mono text-blue-600 block">
                Tài liệu: {lessonData.sourceFile || '/raw-documents/1_curriculum_ppct_global_success_2026_2027.md'}
              </span>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                Văn bản Tích hợp Quốc gia:
              </span>
              <p className="text-slate-700 font-medium">QĐ 2422/QĐ-BGDĐT & Thông tư 02/2025/TT-BGDĐT</p>
              <span className="text-[11px] font-mono text-indigo-600 block">
                Mã xác minh AI & Năng lực số chính thức
              </span>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Thông Tin Bài Học Trích Xuất:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-700 font-medium">
              <div><strong className="text-slate-900">Lớp:</strong> {lessonData.grade}</div>
              <div><strong className="text-slate-900">Tuần:</strong> {lessonData.week}</div>
              <div><strong className="text-slate-900">Tiết:</strong> {lessonData.period}</div>
              <div><strong className="text-slate-900">Unit:</strong> {lessonData.unit}</div>
              <div className="col-span-2"><strong className="text-slate-900">Tên Unit:</strong> {lessonData.unitTitle}</div>
              <div className="col-span-2"><strong className="text-slate-900">Tên Bài:</strong> {lessonData.title}</div>
            </div>
          </div>

          {/* Raw JSON Record */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bản Ghi Dữ Liệu Gốc Struct (JSON Data Record):
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao chép JSON'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
              {rawJsonSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-900 transition-all shadow-xs"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
