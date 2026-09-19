import React, { useState } from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';
import { IntegrationItem } from '../../types/curriculum';
import allIntegrations from '../../data/integrations.json';
import { Layers, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface IntegrationPanelProps {
  plan: LessonPlanDocument;
  onChange: (updatedPlan: LessonPlanDocument) => void;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ plan, onChange }) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleRemoveIntegration = (id: string) => {
    const updated = { ...plan };
    updated.objectives.integrations = updated.objectives.integrations.filter((i) => i.id !== id);
    onChange(updated);
  };

  const handleAddIntegration = (item: IntegrationItem) => {
    const updated = { ...plan };
    if (!updated.objectives.integrations.some((i) => i.id === item.id)) {
      updated.objectives.integrations.push({ ...item });
      onChange(updated);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>2. INTEGRATION (TÍCH HỢP LIÊN MÔN NỘI DUNG)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Nội dung tích hợp được đề xuất dựa theo nội dung bài học SGK</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 border border-blue-200"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm Tích hợp
        </button>
      </div>

      {/* Selected Integrations List */}
      <div className="space-y-3">
        {plan.objectives.integrations && plan.objectives.integrations.length > 0 ? (
          plan.objectives.integrations.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                    {item.category}
                  </span>
                  {item.code ? (
                    <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Suggested integration – code requires verification.
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleRemoveIntegration(item.id)}
                className="text-slate-400 hover:text-red-600 p-1"
                title="Loại bỏ gợi ý này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 italic">Chưa có nội dung tích hợp liên môn nào được chọn.</p>
          </div>
        )}
      </div>

      {/* Add Integration Selection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Chọn Nội dung Tích hợp Liên môn
            </h3>
            <div className="space-y-2">
              {(allIntegrations as IntegrationItem[]).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddIntegration(item)}
                  className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800">{item.category}</span>
                    <span className="text-[10px] text-slate-400">{item.code || 'Chưa xác thực mã'}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  <p className="text-[11px] text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
