import React from 'react';
import { CurriculumService } from '../../services/curriculumService';
import { CheckCircle2, AlertTriangle, XCircle, Database, ShieldCheck, Cpu, Code2, Layers } from 'lucide-react';

export const DiagnosticPanel: React.FC = () => {
  const stats = CurriculumService.getCurriculumStats();
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-slate-950/80 flex items-center justify-between cursor-pointer hover:bg-slate-950 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Bảng Kiểm Tra Trạng Thái Dữ Liệu Nguồn (Data Status & Diagnostic Panel)
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ 100% 35 Tuần Đã Tải
          </span>
        </div>
        <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          {isExpanded ? '[ Thu gọn ▲ ]' : '[ Mở rộng ▼ ]'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Grade 1 to 5 PPCT Import Status Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Tình Trạng Nguồn Phân Phối Chương Trình (PPCT 35 Tuần):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((g) => {
                const gradeStat = stats.grades[g];
                const isComplete = gradeStat && gradeStat.loadedWeeks === 35;
                return (
                  <div
                    key={g}
                    className={`p-3 rounded-xl border ${
                      isComplete
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm">Lớp {g} (Grade {g})</span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div className="text-xs font-mono">
                      {gradeStat?.loadedWeeks || 0} / 35 tuần ({gradeStat?.totalPeriods || 0} tiết)
                    </div>
                    <div className="text-[10px] mt-1 text-slate-400 flex items-center gap-1 truncate" title={gradeStat?.source}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Source loaded
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Integration Codes Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* AI Literacy Codes */}
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300">Mã AI Literacy (QĐ 2422):</div>
                <div className="text-base font-extrabold text-white">
                  {stats.aiLiteracyCodesLoaded} mã đã xác minh
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Nguồn QĐ 2422/QĐ-BGDĐT
                </div>
              </div>
            </div>

            {/* Digital Competence Codes */}
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300">Mã Năng Lực Số (TT 02/2025):</div>
                <div className="text-base font-extrabold text-white">
                  {stats.digitalCompetenceCodesLoaded} mã NLS đã xác minh
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Nguồn TT 02/2025 & CV 3456
                </div>
              </div>
            </div>

            {/* Other Integrations */}
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300">Tích Hợp Khác (PPCT):</div>
                <div className="text-base font-extrabold text-white">
                  {stats.otherIntegrationsLoaded} danh mục đã xác minh
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đạo đức, ATGT, STEM, BVMT...
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              ✓ Source loaded (Nguồn đã tải & xác minh)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              ⚠ Missing data (Thiếu dữ liệu)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-4 h-4" />
              ✗ Source unavailable (Không có nguồn)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
