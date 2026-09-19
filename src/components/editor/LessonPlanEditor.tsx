import React from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';
import { ObjectivesEditor } from './ObjectivesEditor';
import { IntegrationPanel } from './IntegrationPanel';
import { ProcedureTable } from './ProcedureTable';
import { ValidationPanel } from '../rules/ValidationPanel';
import { FileText, Save, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface LessonPlanEditorProps {
  plan: LessonPlanDocument;
  onChange: (updatedPlan: LessonPlanDocument) => void;
  onSave: () => void;
  onPreview: () => void;
}

export const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({
  plan,
  onChange,
  onSave,
  onPreview,
}) => {
  const handleUpdateHeader = (field: string, value: any) => {
    const updated = { ...plan };
    (updated.header as any)[field] = value;
    onChange(updated);
  };

  const handleUpdateAids = (type: 'teacherEquipment' | 'pupilEquipment', text: string) => {
    const updated = { ...plan };
    updated.teachingAids[type] = text.split('\n').filter((t) => t.trim().length > 0);
    onChange(updated);
  };

  const handleUpdateReflection = (text: string) => {
    const updated = { ...plan };
    updated.postLessonReflection = text;
    onChange(updated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Control */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
            Visual Lesson Editor
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Chỉnh sửa Giáo án: {plan.title}
          </h2>
          <p className="text-xs text-slate-500">Mọi thay đổi sẽ tự động lưu và cập nhật bản xem trước A4 chuẩn</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            onClick={onPreview}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" /> Xem trước A4
          </button>
        </div>
      </div>

      {/* Rules Engine Validation Monitor */}
      <ValidationPanel plan={plan} />

      {/* 1. Header Information Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">
          Thông tin Hành chính Giáo án (Header)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Cơ quan Quản lý</label>
            <input
              type="text"
              value={plan.header.governingBody}
              onChange={(e) => handleUpdateHeader('governingBody', e.target.value)}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Tên Trường Tiểu học</label>
            <input
              type="text"
              value={plan.header.schoolName}
              onChange={(e) => handleUpdateHeader('schoolName', e.target.value)}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Tên Giáo viên Dạy</label>
            <input
              type="text"
              value={plan.header.teacherName}
              onChange={(e) => handleUpdateHeader('teacherName', e.target.value)}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 2. Objectives Editor */}
      <ObjectivesEditor plan={plan} onChange={onChange} />

      {/* 3. Integration Recommendation Panel */}
      <IntegrationPanel plan={plan} onChange={onChange} />

      {/* 4. Teaching Aids Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">
          II. TEACHING AIDS AND LEARNING MATERIALS (THIẾT BỊ DẠY HỌC)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">• Thiết bị của Giáo viên (Mỗi dòng 1 mục)</label>
            <textarea
              rows={4}
              value={plan.teachingAids.teacherEquipment.join('\n')}
              onChange={(e) => handleUpdateAids('teacherEquipment', e.target.value)}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">• Thiết bị của Học sinh (Mỗi dòng 1 mục)</label>
            <textarea
              rows={4}
              value={plan.teachingAids.pupilEquipment.join('\n')}
              onChange={(e) => handleUpdateAids('pupilEquipment', e.target.value)}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 5. Teaching Procedures 3-Column Table */}
      <ProcedureTable plan={plan} onChange={onChange} />

      {/* 6. Post-Lesson Reflection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider">
          RÚT KINH NGHIỆM SAU TIẾT DẠY (POST-LESSON REFLECTION)
        </h3>
        <textarea
          rows={3}
          value={plan.postLessonReflection}
          onChange={(e) => handleUpdateReflection(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white"
        />
      </div>
    </div>
  );
};
