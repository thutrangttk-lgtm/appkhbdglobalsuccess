import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { ExportService } from '../../services/exportService';
import { LessonPlanDocument, LessonPlanVersion } from '../../types/lessonPlan';
import {
  History,
  FileText,
  Copy,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

interface HistoryPanelProps {
  onOpenPlan: (plan: LessonPlanDocument) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onOpenPlan }) => {
  const [plans, setPlans] = useState<LessonPlanDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlanForVersion, setSelectedPlanForVersion] = useState<LessonPlanDocument | null>(null);
  const [versions, setVersions] = useState<LessonPlanVersion[]>([]);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const loadPlans = () => {
    const list = StorageService.getAllPlans();
    setPlans(list);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDuplicate = (id: string) => {
    StorageService.duplicatePlan(id);
    loadPlans();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa giáo án này không?')) {
      StorageService.deletePlan(id);
      loadPlans();
    }
  };

  const handleStartRename = (plan: LessonPlanDocument) => {
    setEditingTitleId(plan.id);
    setNewTitle(plan.title);
  };

  const handleSaveRename = (id: string) => {
    if (newTitle.trim()) {
      StorageService.renamePlan(id, newTitle);
      setEditingTitleId(null);
      loadPlans();
    }
  };

  const handleViewVersions = (plan: LessonPlanDocument) => {
    setSelectedPlanForVersion(plan);
    const verList = StorageService.getVersionsForPlan(plan.id);
    setVersions(verList);
  };

  const handleRestoreVersion = (ver: LessonPlanVersion) => {
    if (confirm(`Phục hồi phiên bản v${ver.version} (${new Date(ver.timestamp).toLocaleString('vi-VN')})?`)) {
      StorageService.savePlan(ver.doc);
      setSelectedPlanForVersion(null);
      loadPlans();
      onOpenPlan(ver.doc);
    }
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.header.unitTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.grade.toString().includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Giáo án của tôi (My Lesson Plans)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Quản lý các giáo án đã tạo, lịch sử chỉnh sửa và phục hồi phiên bản cũ</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, Unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Plans List Table/Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                    Lớp {plan.grade}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                    Tuần {plan.week}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    v{plan.version}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(plan.updatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                {editingTitleId === plan.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-sm font-bold text-slate-900 focus:bg-white"
                    />
                    <button
                      onClick={() => handleSaveRename(plan.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {plan.title}
                  </h3>
                )}

                <p className="text-xs text-slate-500 font-medium">
                  Unit {plan.unit}: {plan.header.unitTitle} – Lesson {plan.lesson}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onOpenPlan(plan)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" /> Mở
                </button>

                <button
                  onClick={() => handleDuplicate(plan.id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300"
                  title="Nhân bản giáo án"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleStartRename(plan)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300"
                  title="Đổi tên"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleViewVersions(plan)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-semibold border border-slate-300"
                  title="Lịch sử phiên bản"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => ExportService.exportToWord(plan)}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200"
                  title="Xuất file .docx"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Chưa có giáo án nào trong thư viện của bạn.</p>
            <p className="text-xs text-slate-400">Hãy chuyển sang Dashboard để chọn khối lớp và bấm 'Generate Lesson Plan'.</p>
          </div>
        )}
      </div>

      {/* Version Control History Modal */}
      {selectedPlanForVersion && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Lịch sử phiên bản: {selectedPlanForVersion.title}
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {versions.map((ver) => (
                <div key={ver.version} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900">Phiên bản v{ver.version}</span>
                    <p className="text-[11px] text-slate-500">
                      {new Date(ver.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestoreVersion(ver)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-700"
                  >
                    <RotateCcw className="w-3 h-3" /> Phục hồi
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPlanForVersion(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
