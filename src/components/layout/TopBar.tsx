import React from 'react';
import { Sparkles, Check, RefreshCw, FileCheck2, Download, Printer, FileText } from 'lucide-react';
import { LessonPlanDocument } from '../../types/lessonPlan';

interface TopBarProps {
  currentPlan: LessonPlanDocument | null;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onExportWord: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onPreviewToggle: () => void;
  isPreviewMode: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPlan,
  saveStatus,
  onExportWord,
  onExportPDF,
  onPrint,
  onPreviewToggle,
  isPreviewMode,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs no-print">
      {/* Title & Plan Metadata */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI LESSON PLAN STUDIO</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              GLOBAL SUCCESS 2026
            </span>
          </h2>
          {currentPlan ? (
            <p className="text-xs text-slate-500 font-medium truncate max-w-md">
              Lớp {currentPlan.grade} • Tuần {currentPlan.week} • Unit {currentPlan.unit}: {currentPlan.header.unitTitle} – Lesson {currentPlan.lesson}
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">Hệ thống Soạn Kế hoạch Bài dạy Tiếng Anh Tiểu học chuẩn CV 2345</p>
          )}
        </div>

        {/* Auto Save Status Badge */}
        {currentPlan && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200">
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                <span className="text-amber-700">Đang lưu...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Saved ✓</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentPlan && (
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviewToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isPreviewMode
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Chỉnh sửa' : 'Xem trước A4'}</span>
          </button>

          <button
            onClick={onExportWord}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 transition-all shadow-xs border border-blue-800"
            title="Xuất file .docx thực tế"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Word</span>
          </button>

          <button
            onClick={onExportPDF}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-all shadow-xs border border-emerald-800"
            title="Xuất file PDF chuẩn A4"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 transition-all shadow-xs"
            title="In bài dạy"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      )}
    </header>
  );
};
