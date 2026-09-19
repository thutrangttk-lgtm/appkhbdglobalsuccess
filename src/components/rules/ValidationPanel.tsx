import React from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';
import { RulesEngine } from '../../services/rulesEngine';
import { CheckCircle2, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface ValidationPanelProps {
  plan: LessonPlanDocument;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ plan }) => {
  const report = RulesEngine.validate(plan);

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      report.isValid ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          {report.isValid ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Rules Engine (Kiểm duyệt Chuẩn CV 2345)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Độ hoàn thiện:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            report.score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {report.score}/100 Điểm
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {report.issues.length > 0 ? (
          report.issues.map((issue) => (
            <div key={issue.id} className="flex items-start gap-2 text-xs">
              {issue.severity === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
              {issue.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
              {issue.severity === 'info' && <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />}
              <span className={`${
                issue.severity === 'error' ? 'text-red-800 font-semibold' :
                issue.severity === 'warning' ? 'text-amber-900 font-medium' : 'text-blue-900'
              }`}>
                {issue.message}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Giáo án đạt chuẩn 100% về thời lượng (35 phút), cấu trúc 3 cột và dữ liệu SGK Global Success!</span>
          </div>
        )}
      </div>
    </div>
  );
};
