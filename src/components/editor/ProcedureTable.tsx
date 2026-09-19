import React from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';
import { ActivityStage } from '../../types/curriculum';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface ProcedureTableProps {
  plan: LessonPlanDocument;
  onChange: (updatedPlan: LessonPlanDocument) => void;
}

export const ProcedureTable: React.FC<ProcedureTableProps> = ({ plan, onChange }) => {
  const handleUpdateStageActivity = (
    stageIdx: number,
    type: 'teacherActivities' | 'pupilActivities' | 'expectedOutcomes',
    actIdx: number,
    value: string
  ) => {
    const updated = { ...plan };
    updated.procedures.stages[stageIdx][type][actIdx] = value;
    onChange(updated);
  };

  const handleAddActivityItem = (
    stageIdx: number,
    type: 'teacherActivities' | 'pupilActivities' | 'expectedOutcomes'
  ) => {
    const updated = { ...plan };
    updated.procedures.stages[stageIdx][type].push('');
    onChange(updated);
  };

  const handleRemoveActivityItem = (
    stageIdx: number,
    type: 'teacherActivities' | 'pupilActivities' | 'expectedOutcomes',
    actIdx: number
  ) => {
    const updated = { ...plan };
    updated.procedures.stages[stageIdx][type].splice(actIdx, 1);
    onChange(updated);
  };

  const handleUpdateAdjustment = (stageIdx: number, value: string) => {
    const updated = { ...plan };
    updated.procedures.stages[stageIdx].postLessonAdjustments = value;
    onChange(updated);
  };

  const handleUpdateDuration = (stageIdx: number, duration: number) => {
    const updated = { ...plan };
    updated.procedures.stages[stageIdx].durationMinutes = duration;
    onChange(updated);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">III. TEACHING PROCEDURES (TIẾN TRÌNH BÀI DẠY - 3 CỘT)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Tiến trình dạy học gồm 4 bước bắt buộc theo Công văn 2345 (Tổng: 35 phút)</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold">
          4 Bước • 3 Cột Chuẩn
        </div>
      </div>

      <div className="space-y-6">
        {plan.procedures.stages.map((stage, sIdx) => (
          <div key={sIdx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
            {/* Stage Header */}
            <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="font-bold text-slate-900 text-sm">{stage.stageName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600">Thời lượng:</span>
                <input
                  type="number"
                  min={1}
                  max={35}
                  value={stage.durationMinutes}
                  onChange={(e) => handleUpdateDuration(sIdx, Number(e.target.value))}
                  className="w-14 bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-bold text-center text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-500">phút</span>
              </div>
            </div>

            {/* 3 Columns Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Column 1: LEARNING ACTIVITIES (45% -> 5 cols) */}
              <div className="md:col-span-5 p-4 space-y-4 bg-white">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  1. LEARNING ACTIVITIES
                </h4>

                {/* Teacher Activities */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">• Teacher Activities</span>
                    <button
                      onClick={() => handleAddActivityItem(sIdx, 'teacherActivities')}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      + Thêm hoạt động GV
                    </button>
                  </div>
                  {stage.teacherActivities.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-1.5">
                      <textarea
                        rows={2}
                        value={act}
                        onChange={(e) => handleUpdateStageActivity(sIdx, 'teacherActivities', aIdx, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemoveActivityItem(sIdx, 'teacherActivities', aIdx)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pupil Activities */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">• Pupil Activities</span>
                    <button
                      onClick={() => handleAddActivityItem(sIdx, 'pupilActivities')}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      + Thêm hoạt động HS
                    </button>
                  </div>
                  {stage.pupilActivities.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-1.5">
                      <textarea
                        rows={2}
                        value={act}
                        onChange={(e) => handleUpdateStageActivity(sIdx, 'pupilActivities', aIdx, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemoveActivityItem(sIdx, 'pupilActivities', aIdx)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: EXPECTED OUTCOMES & INTEGRATION (35% -> 4 cols) */}
              <div className="md:col-span-4 p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    2. EXPECTED OUTCOMES
                  </h4>
                  <button
                    onClick={() => handleAddActivityItem(sIdx, 'expectedOutcomes')}
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    + Thêm kết quả
                  </button>
                </div>

                {stage.expectedOutcomes.map((eo, eIdx) => (
                  <div key={eIdx} className="flex items-start gap-1.5">
                    <textarea
                      rows={3}
                      value={eo}
                      onChange={(e) => handleUpdateStageActivity(sIdx, 'expectedOutcomes', eIdx, e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleRemoveActivityItem(sIdx, 'expectedOutcomes', eIdx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Column 3: POST-LESSON ADJUSTMENTS (20% -> 3 cols) */}
              <div className="md:col-span-3 p-4 space-y-2 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                  3. ADJUSTMENTS
                </h4>
                <textarea
                  rows={6}
                  placeholder="Điều chỉnh sau tiết dạy (nếu có)..."
                  value={stage.postLessonAdjustments || ''}
                  onChange={(e) => handleUpdateAdjustment(sIdx, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
