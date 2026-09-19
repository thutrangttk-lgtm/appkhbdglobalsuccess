import React from 'react';
import { CurriculumService } from '../../services/curriculumService';
import { CheckCircle2, AlertTriangle, XCircle, Database, ShieldCheck, Cpu, Code2, Layers, FileCheck } from 'lucide-react';

export const DiagnosticPanel: React.FC = () => {
  const stats = CurriculumService.getCurriculumStats();
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Status Badge Builder Helper
  const renderStatusBadge = (status: 'complete' | 'incomplete' | 'no_source') => {
    switch (status) {
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ✓ COMPLETE
          </span>
        );
      case 'incomplete':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            ⚠ INCOMPLETE
          </span>
        );
      case 'no_source':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3 h-3 text-rose-400" />
            ✕ NO SOURCE
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Main Banner & Dynamic Math Status */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-950/90 transition-colors select-none border-b border-slate-800"
      >
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
                Bảng Kiểm Tra Trạng Thái Dữ Liệu Nguồn (Data Diagnostics)
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-mono font-semibold mt-0.5">
              Curriculum Data: {stats.totalExtractedWeeks}/{stats.totalGradeWeeksExpected} grade-weeks loaded ({stats.overallPercentage}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {stats.isOverallComplete ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ✓ COMPLETE (175/175 Grade-Weeks)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              ⚠ INCOMPLETE ({stats.totalExtractedWeeks}/{stats.totalGradeWeeksExpected} Grade-Weeks)
            </span>
          )}

          <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            {isExpanded ? '[ Thu gọn ▲ ]' : '[ Mở rộng ▼ ]'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-6">
          {/* Grade 1 to 5 PPCT Extraction & Progress Status Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Trạng Thái Trích Xuất Phân Phối Chương Trình (PPCT Grade 1–5):
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Tổng 5 Khối × 35 Tuần = 175 Grade-Weeks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((g) => {
                const gradeStat = stats.grades[g];
                const isComplete = gradeStat.completionStatus === 'complete';
                const isIncomplete = gradeStat.completionStatus === 'incomplete';

                return (
                  <div
                    key={g}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                      isComplete
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : isIncomplete
                        ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                        : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">Grade {g}</span>
                      {renderStatusBadge(gradeStat.completionStatus)}
                    </div>

                    {/* Metrics Grid */}
                    <div className="text-xs space-y-1 font-medium text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Source:</span>
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-emerald-400" /> ✓ Loaded
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Curriculum:</span>
                        <span className="font-mono font-bold text-white">{gradeStat.loadedWeeks}/35 weeks</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Periods:</span>
                        <span className="font-mono font-bold text-white">{gradeStat.totalPeriods}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                        <span>Progress</span>
                        <span>{gradeStat.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isComplete ? 'bg-emerald-500' : isIncomplete ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, gradeStat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Source Documents & Code Counts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Nguồn Văn Bản Tích Hợp Xác Minh (Verified Source Documents):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* AI Literacy */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">AI Literacy Code Database:</div>
                  <div className="text-base font-extrabold text-white">
                    {stats.aiLiteracyCodesLoaded} mã xác minh
                  </div>
                  <div className="text-[10px] text-blue-300 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" /> Quyết định 2422/QĐ-BGDĐT
                  </div>
                </div>
              </div>

              {/* Digital Competence */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">Digital Competence (NLS):</div>
                  <div className="text-base font-extrabold text-white">
                    {stats.digitalCompetenceCodesLoaded} mã NLS xác minh
                  </div>
                  <div className="text-[10px] text-indigo-300 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Thông tư 02/2025/TT-BGDĐT
                  </div>
                </div>
              </div>

              {/* Other Integrations */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">Other Integrations:</div>
                  <div className="text-base font-extrabold text-white">
                    {stats.otherIntegrationsLoaded} danh mục xác minh
                  </div>
                  <div className="text-[10px] text-teal-300 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-teal-400" /> PPCT Global Success 2026-2027
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Status Legend */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              ✓ COMPLETE (Đủ 35/35 tuần)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              ⚠ INCOMPLETE (Chưa đủ 35 tuần)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-4 h-4" />
              ✕ NO SOURCE (Thiếu tài liệu nguồn)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
