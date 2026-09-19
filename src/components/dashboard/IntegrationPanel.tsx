import React from 'react';
import { LessonData, OfficialIntegration } from '../../types/curriculum';
import { Cpu, Code2, ShieldCheck, CheckCircle2, Info, FileText, Sparkles } from 'lucide-react';

interface IntegrationPanelProps {
  lessonData: LessonData | null;
  onOpenSourceViewer: () => void;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  lessonData,
  onOpenSourceViewer,
}) => {
  if (!lessonData) return null;

  const integrations = lessonData.integrations || [];

  // Categorize verified integrations
  const aiIntegration = integrations.find((i) => i.type === 'AI Literacy');
  const digitalCompetenceIntegration = integrations.find((i) => i.type === 'Digital Competence' || i.type === 'Năng lực số');
  const otherIntegrations = integrations.filter((i) => i.type !== 'AI Literacy' && i.type !== 'Digital Competence' && i.type !== 'Năng lực số');

  // Badge mapping function
  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ai literacy':
      case 'ai':
        return 'bg-blue-600 text-white border-blue-700';
      case 'digital competence':
      case 'năng lực số':
        return 'bg-indigo-600 text-white border-indigo-700';
      case 'đạo đức':
      case 'ethics':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'an toàn giao thông':
        return 'bg-amber-600 text-white border-amber-700';
      case 'bảo vệ môi trường':
      case 'môi trường':
        return 'bg-teal-600 text-white border-teal-700';
      case 'stem':
        return 'bg-purple-600 text-white border-purple-700';
      case 'chuyển đổi số':
        return 'bg-cyan-600 text-white border-cyan-700';
      case 'quyền trẻ em':
        return 'bg-rose-600 text-white border-rose-700';
      default:
        return 'bg-slate-700 text-white border-slate-800';
    }
  };

  const hasAnyIntegration = integrations.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-5 p-6">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
              TÍCH HỢP TRONG BÀI HỌC (CROSS-CURRICULAR INTEGRATIONS)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tích hợp bắt buộc theo QĐ 2422/QĐ-BGDĐT (AI) & TT 02/2025/TT-BGDĐT (Năng lực số)
          </p>
        </div>

        {/* Active Badges */}
        {hasAnyIntegration && (
          <div className="flex flex-wrap items-center gap-1.5">
            {integrations.map((item, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border shadow-2xs ${getBadgeStyle(item.type)}`}
              >
                {item.type}
              </span>
            ))}
          </div>
        )}
      </div>

      {!hasAnyIntegration ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-2">
          <Info className="w-6 h-6 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">
            Không có nội dung tích hợp bắt buộc được xác định từ nguồn dữ liệu.
          </h4>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Tiết học này trong Khung Phân phân phối chương trình chính thức không có yêu cầu tích hợp bắt buộc. Hệ thống tuân thủ nghiêm ngặt nguyên tắc không tự tạo hoặc cưỡng ép mã tích hợp.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: AI Literacy */}
          <div className={`p-5 rounded-2xl border transition-all ${aiIntegration ? 'bg-gradient-to-b from-blue-50/70 to-white border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-900 uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-blue-600" />
                AI LITERACY
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                QĐ 2422/QĐ-BGDĐT
              </span>
            </div>

            {aiIntegration ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-blue-700 block">Mã xác minh (Code):</span>
                  <div className="inline-block px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-mono font-bold shadow-2xs">
                    {aiIntegration.code || 'Chưa có mã được xác minh từ nguồn dữ liệu.'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Nội dung (Content):</span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-blue-100">
                    {aiIntegration.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Applicable to this lesson
                  </span>
                  <button onClick={onOpenSourceViewer} className="text-blue-600 hover:underline font-semibold">
                    [Xem nguồn]
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-500">
                  Không có nội dung tích hợp AI cho tiết học này.
                </p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Source: QĐ 2422/QĐ-BGDĐT
                </span>
              </div>
            )}
          </div>

          {/* Card 2: Digital Competence */}
          <div className={`p-5 rounded-2xl border transition-all ${digitalCompetenceIntegration ? 'bg-gradient-to-b from-indigo-50/70 to-white border-indigo-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-900 uppercase tracking-wide">
                <Code2 className="w-4 h-4 text-indigo-600" />
                DIGITAL COMPETENCE (NLS)
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                TT 02/2025/TT-BGDĐT
              </span>
            </div>

            {digitalCompetenceIntegration ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-indigo-700 block">Mã xác minh (Code):</span>
                  <div className="inline-block px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-mono font-bold shadow-2xs">
                    {digitalCompetenceIntegration.code || 'Chưa có mã được xác minh từ nguồn dữ liệu.'}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Nội dung (Content):</span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-indigo-100">
                    {digitalCompetenceIntegration.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Applicable to this lesson
                  </span>
                  <button onClick={onOpenSourceViewer} className="text-indigo-600 hover:underline font-semibold">
                    [Xem nguồn]
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-500">
                  Không có nội dung Năng lực số cho tiết học này.
                </p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Source: Thông tư 02/2025 & CV 3456
                </span>
              </div>
            )}
          </div>

          {/* Card 3: Other Integrations */}
          <div className={`p-5 rounded-2xl border transition-all ${otherIntegrations.length > 0 ? 'bg-gradient-to-b from-teal-50/70 to-white border-teal-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-900 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                TÍCH HỢP KHÁC (OTHER INTEGRATIONS)
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                PPCT Quốc Gia
              </span>
            </div>

            {otherIntegrations.length > 0 ? (
              <div className="space-y-3">
                {otherIntegrations.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-teal-100 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-teal-950 uppercase">{item.type}</span>
                      <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {item.code || 'Mã PPCT'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                ))}

                <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Applicable to this lesson
                  </span>
                  <button onClick={onOpenSourceViewer} className="text-teal-600 hover:underline font-semibold">
                    [Xem nguồn]
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-500">
                  Không có nội dung tích hợp liên môn khác cho tiết học này.
                </p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Source: Khung PPCT Lớp {lessonData.grade}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
