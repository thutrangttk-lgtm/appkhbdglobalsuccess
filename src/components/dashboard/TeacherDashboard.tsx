import React, { useState, useEffect } from 'react';
import { CurriculumSelectors } from './CurriculumSelectors';
import { LessonInfoCard } from './LessonInfoCard';
import { IntegrationPanel } from './IntegrationPanel';
import { DiagnosticPanel } from './DiagnosticPanel';
import { SourceViewerModal } from './SourceViewerModal';
import { CurriculumService } from '../../services/curriculumService';
import { AIGenerationEngine } from '../../services/aiGenerationEngine';
import { StorageService } from '../../services/storageService';
import { LessonData, IntegrationItem } from '../../types/curriculum';
import { LessonPlanDocument } from '../../types/lessonPlan';
import {
  Sparkles,
  Edit3,
  Save,
  Eye,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
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
  const [period, setPeriod] = useState<number>(1);

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSourceViewerOpen, setIsSourceViewerOpen] = useState<boolean>(false);

  // Sync lesson data whenever Grade, Week, or Period changes
  useEffect(() => {
    const availablePeriods = CurriculumService.getPeriodsForWeek(grade, week);
    if (availablePeriods.length > 0) {
      const matchPeriod = availablePeriods.find((p) => p.period === period);
      if (matchPeriod) {
        setLessonData(matchPeriod);
        setValidationError(null);
      } else {
        // Fallback to first period of the week
        setPeriod(availablePeriods[0].period);
        setLessonData(availablePeriods[0]);
        setValidationError(null);
      }
    } else {
      // Try direct period lookup fallback
      const fallback = CurriculumService.getLessonDataByWeekAndPeriod(grade, week, period);
      setLessonData(fallback);
      if (!fallback) {
        setValidationError('Chưa có dữ liệu PPCT xác minh cho bài học này.');
      } else {
        setValidationError(null);
      }
    }
  }, [grade, week, period]);

  // Handle Grade Change
  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    const newWeek = 1;
    setWeek(newWeek);
    const availablePeriods = CurriculumService.getPeriodsForWeek(newGrade, newWeek);
    const newPeriod = availablePeriods.length > 0 ? availablePeriods[0].period : 1;
    setPeriod(newPeriod);
  };

  // Handle Week Change
  const handleWeekChange = (newWeek: number) => {
    setWeek(newWeek);
    const availablePeriods = CurriculumService.getPeriodsForWeek(grade, newWeek);
    const newPeriod = availablePeriods.length > 0 ? availablePeriods[0].period : 1;
    setPeriod(newPeriod);
  };

  // Handle Period Change
  const handlePeriodChange = (newPeriod: number) => {
    setPeriod(newPeriod);
  };

  // Generate Lesson Plan Handler with Strict Validation Gate (Section K)
  const handleGeneratePlan = async () => {
    if (!lessonData) {
      setValidationError('Chưa có dữ liệu PPCT xác minh cho bài học này.');
      return;
    }

    // Validate required curriculum fields
    if (!lessonData.grade || !lessonData.week || !lessonData.unit || !lessonData.title) {
      setValidationError('Chưa có dữ liệu PPCT xác minh cho bài học này.');
      return;
    }

    setValidationError(null);
    setIsGenerating(true);

    try {
      const settings = StorageService.getSettings();
      // Map lesson's official integrations to IntegrationItem array for AI prompt engine
      const mappedIntegrations: IntegrationItem[] = (lessonData.integrations || []).map((i) => ({
        id: i.code || i.type,
        category: (i.type === 'AI Literacy' ? 'AI Literacy' : i.type === 'Digital Competence' ? 'Digital Competence' : 'Ethics') as any,
        code: i.code,
        title: i.name,
        description: i.description,
        suggestedActivities: [i.description],
      }));

      const plan = await AIGenerationEngine.generateLessonPlan(
        lessonData,
        settings.teacherName,
        settings.schoolName,
        settings.governingBody,
        mappedIntegrations
      );

      StorageService.savePlan(plan);
      onPlanCreated(plan);
    } catch (err) {
      console.error('Failed to generate lesson plan:', err);
      setValidationError('Lỗi khi khởi tạo giáo án AI. Vui lòng kiểm tra lại cấu hình.');
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
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">Đã lưu giáo án vào kho dữ liệu thành công!</span>
        </div>
      )}

      {/* Welcome & Main Application Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI LESSON PLAN STUDIO • CÔNG VĂN 2345/BGDĐT
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              ✓ Nguồn PPCT Lớp 1-5 Đã Tải (35 Tuần)
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            AI LESSON PLAN STUDIO – GLOBAL SUCCESS
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Hệ thống quản lý Phân Phối Chương Trình Tiếng Anh Tiểu Học & Khởi tạo Kế hoạch bài dạy chuẩn Công văn 2345/BGDĐT. Tích hợp trực tiếp mã AI Literacy (QĐ 2422) và Năng lực số (Thông tư 02/2025).
          </p>
        </div>
      </div>

      {/* Section J: Admin/Data Status & Diagnostic Panel */}
      <DiagnosticPanel />

      {/* Section F: Top Selectors (Grade, Week 1-35, Period, Unit, Lesson, Title, Duration) */}
      <CurriculumSelectors
        selectedGrade={grade}
        selectedWeek={week}
        selectedPeriod={period}
        currentLessonData={lessonData}
        onGradeChange={handleGradeChange}
        onWeekChange={handleWeekChange}
        onPeriodChange={handlePeriodChange}
      />

      {/* Section G: Lesson Information Card */}
      <LessonInfoCard
        lessonData={lessonData}
        onOpenSourceViewer={() => setIsSourceViewerOpen(true)}
      />

      {/* Section H: Large Integration Panel */}
      <IntegrationPanel
        lessonData={lessonData}
        onOpenSourceViewer={() => setIsSourceViewerOpen(true)}
      />

      {/* Section K & M: Generate Lesson Plan & Main Action Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-600 font-medium">
            Tất cả thông tin được rà soát từ Khung PPCT chính thức trước khi khởi tạo giáo án.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating || !lessonData}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95"
            >
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Đang tạo Giáo án CV 2345...' : 'GENERATE LESSON PLAN'}</span>
            </button>

            {currentPlan && (
              <>
                <button
                  onClick={onNavigateEditor}
                  className="px-4 py-3.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2 transition-all border border-slate-300"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Chỉnh Sửa Giáo Án</span>
                </button>

                <button
                  onClick={onNavigatePreview}
                  className="px-4 py-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem & Xuất File (Word/PDF)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section I: Source Viewer Modal */}
      <SourceViewerModal
        isOpen={isSourceViewerOpen}
        onClose={() => setIsSourceViewerOpen(false)}
        lessonData={lessonData}
      />
    </div>
  );
};
