import React, { useState, useEffect } from 'react';
import { CurriculumSelectors } from './CurriculumSelectors';
import { CurriculumService } from '../../services/curriculumService';
import { AIGenerationEngine } from '../../services/aiGenerationEngine';
import { IntegrationEngine } from '../../services/integrationEngine';
import { StorageService } from '../../services/storageService';
import { ExportService } from '../../services/exportService';
import { LessonData, IntegrationItem } from '../../types/curriculum';
import { LessonPlanDocument } from '../../types/lessonPlan';
import {
  Sparkles,
  Edit3,
  Save,
  Eye,
  FileSpreadsheet,
  FileCheck2,
  Printer,
  BookOpen,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface TeacherDashboardProps {
  onPlanCreated: (plan: LessonPlanDocument) => void;
  onNavigateEditor: () => void;
  onNavigatePreview: () => void;
  currentPlan: LessonPlanDocument | null;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onPlanCreated,
  onNavigateEditor,
  onNavigatePreview,
  currentPlan,
}) => {
  const [grade, setGrade] = useState<number>(5);
  const [week, setWeek] = useState<number>(1);
  const [unit, setUnit] = useState<number>(1);
  const [lesson, setLesson] = useState<number>(2);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [selectedIntegrations, setSelectedIntegrations] = useState<IntegrationItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Auto load curriculum data whenever selector changes
  useEffect(() => {
    const data = CurriculumService.getLessonData(grade, unit, lesson);
    setLessonData(data);
    if (data) {
      const recs = IntegrationEngine.recommendIntegrations(data);
      setSelectedIntegrations(recs);
    } else {
      setSelectedIntegrations([]);
    }
  }, [grade, unit, lesson]);

  // Handle selector hierarchy updates
  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    const weeks = CurriculumService.getWeeksForGrade(newGrade);
    const newWeek = weeks.length > 0 ? weeks[0] : 1;
    setWeek(newWeek);

    const units = CurriculumService.getUnits(newGrade, newWeek);
    const newUnit = units.length > 0 ? units[0].unit : 1;
    setUnit(newUnit);

    const lessons = CurriculumService.getLessons(newGrade, newUnit);
    const newLesson = lessons.length > 0 ? lessons[0].lesson : 1;
    setLesson(newLesson);
  };

  const handleWeekChange = (newWeek: number) => {
    setWeek(newWeek);
    const units = CurriculumService.getUnits(grade, newWeek);
    if (units.length > 0) {
      setUnit(units[0].unit);
      const lessons = CurriculumService.getLessons(grade, units[0].unit);
      if (lessons.length > 0) setLesson(lessons[0].lesson);
    }
  };

  const handleUnitChange = (newUnit: number) => {
    setUnit(newUnit);
    const lessons = CurriculumService.getLessons(grade, newUnit);
    if (lessons.length > 0) setLesson(lessons[0].lesson);
  };

  const handleLessonChange = (newLesson: number) => {
    setLesson(newLesson);
  };

  // Generate Lesson Plan Handler
  const handleGeneratePlan = async () => {
    if (!lessonData) return;
    setIsGenerating(true);

    try {
      const settings = StorageService.getSettings();
      const plan = await AIGenerationEngine.generateLessonPlan(
        lessonData,
        settings.teacherName,
        settings.schoolName,
        settings.governingBody,
        selectedIntegrations
      );

      StorageService.savePlan(plan);
      onPlanCreated(plan);
    } catch (err) {
      console.error('Failed to generate lesson plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!currentPlan) return;
    StorageService.savePlan(currentPlan);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome & Dashboard Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Powered EdTech Studio • Công văn 2345/BGDĐT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI LESSON PLAN STUDIO – GLOBAL SUCCESS</h1>
          <p className="text-sm text-blue-100 max-w-2xl">
            Tự động khởi tạo, tinh chỉnh, tích hợp liên môn thông minh và xuất giáo án Tiếng Anh Tiểu học chuẩn Microsoft Word & PDF cho Lớp 1 đến Lớp 5.
          </p>
        </div>
      </div>

      {/* Curriculum Selectors Bar */}
      <CurriculumSelectors
        selectedGrade={grade}
        selectedWeek={week}
        selectedUnit={unit}
        selectedLesson={lesson}
        onGradeChange={handleGradeChange}
        onWeekChange={handleWeekChange}
        onUnitChange={handleUnitChange}
        onLessonChange={handleLessonChange}
      />

      {/* Selected Lesson Overview & Action Dashboard */}
      {lessonData ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                  LỚP {lessonData.grade}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  TUẦN {lessonData.week}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  TIẾT {lessonData.period}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                UNIT {lessonData.unit}: {lessonData.unitTitle} – LESSON {lessonData.lesson}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{lessonData.title}</p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Đang khởi tạo AI...' : 'Generate Lesson Plan'}</span>
              </button>

              {currentPlan && (
                <>
                  <button
                    onClick={onNavigateEditor}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all border border-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all border border-slate-300"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    onClick={onNavigatePreview}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-all border border-slate-300"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => ExportService.exportToWord(currentPlan)}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export Word</span>
                  </button>

                  <button
                    onClick={() => ExportService.exportToPDF()}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          {saveToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bản nháp đã được lưu thành công (Saved ✓)</span>
            </div>
          )}

          {/* Detailed Curriculum Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Target Vocabulary */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Từ vựng Trọng tâm (Vocabulary)</span>
              </h3>
              <div className="space-y-2">
                {lessonData.vocabulary.map((v, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-blue-900">{v.word}</span>
                      {v.pronunciation && <span className="text-slate-400 text-[11px] ml-1.5 font-serif">{v.pronunciation}</span>}
                    </div>
                    <span className="text-slate-600 font-medium">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Target Sentence Patterns */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Mẫu câu Trọng tâm (Sentence Patterns)</span>
              </h3>
              <div className="space-y-2">
                {lessonData.sentencePatterns.map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{p.pattern}</p>
                    <p className="text-[11px] text-blue-700 italic">Ví dụ: {p.example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Cross-Curricular Integration */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Gợi ý Tích hợp Liên môn (Integration)</span>
              </h3>
              <div className="space-y-2">
                {selectedIntegrations.length > 0 ? (
                  selectedIntegrations.map((item) => (
                    <div key={item.id} className="p-2.5 bg-white rounded-lg border border-blue-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                          {item.category}
                        </span>
                        {item.code ? (
                          <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                        ) : (
                          <span className="text-[10px] text-amber-600 italic">Cần xác thực mã</span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-600">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Không có gợi ý tích hợp đặc biệt cho bài này.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-semibold">Curriculum data not available – please verify.</p>
        </div>
      )}
    </div>
  );
};
