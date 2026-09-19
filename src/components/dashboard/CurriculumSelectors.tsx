import React from 'react';
import { CurriculumService } from '../../services/curriculumService';
import { LessonData } from '../../types/curriculum';
import { BookOpen, Calendar, Clock, Layers, FileCode, CheckCircle, AlertCircle } from 'lucide-react';

interface CurriculumSelectorsProps {
  selectedGrade: number;
  selectedWeek: number;
  selectedPeriod: number;
  currentLessonData: LessonData | null;
  onGradeChange: (grade: number) => void;
  onWeekChange: (week: number) => void;
  onPeriodChange: (period: number) => void;
}

export const CurriculumSelectors: React.FC<CurriculumSelectorsProps> = ({
  selectedGrade,
  selectedWeek,
  selectedPeriod,
  currentLessonData,
  onGradeChange,
  onWeekChange,
  onPeriodChange,
}) => {
  const grades = CurriculumService.getGrades();
  const weeks = CurriculumService.getWeeksForGrade(selectedGrade);
  const availablePeriodLessons = CurriculumService.getPeriodsForWeek(selectedGrade, selectedWeek);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800">
            Khung Phân Phối Chương Trình Chính Thức (Official PPCT)
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Nguồn xác minh 35 tuần
        </span>
      </div>

      {/* Row 1: Selectors (Grade, Week, Period) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Grade Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>1. Khối Lớp (Grade)</span>
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
          >
            {grades.map((g) => (
              <option key={g} value={g}>
                Lớp {g} (Grade {g})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Week Selector (1 to 35) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>2. Tuần Học (Week 1–35)</span>
          </label>
          <select
            value={selectedWeek}
            onChange={(e) => onWeekChange(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>
                Tuần {w} (Week {w})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Period Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>3. Tiết Dạy (Period)</span>
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
          >
            {availablePeriodLessons.length > 0 ? (
              availablePeriodLessons.map((pl) => (
                <option key={pl.period} value={pl.period}>
                  Tiết {pl.period}: Unit {pl.unit} - {pl.lessonPart || `Lesson ${pl.lesson}`} ({pl.title})
                </option>
              ))
            ) : (
              <option value={selectedPeriod}>Tiết {selectedPeriod}</option>
            )}
          </select>
        </div>
      </div>

      {/* Row 2: Automatically Loaded Metadata Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
        {/* Unit */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Unit (Tự động)
          </span>
          <div className="text-sm font-bold text-slate-800 truncate" title={currentLessonData?.unitTitle || 'Đang tải...'}>
            {currentLessonData ? `Unit ${currentLessonData.unit}: ${currentLessonData.unitTitle}` : <span className="text-amber-600 text-xs italic">Chưa xác minh</span>}
          </div>
        </div>

        {/* Lesson */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            Lesson (Tự động)
          </span>
          <div className="text-sm font-bold text-slate-800 truncate">
            {currentLessonData ? (currentLessonData.lessonPart || `Lesson ${currentLessonData.lesson}`) : <span className="text-amber-600 text-xs italic">Chưa xác minh</span>}
          </div>
        </div>

        {/* Lesson Title */}
        <div className="space-y-1 md:col-span-1">
          <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Lesson Title (Tự động)
          </span>
          <div className="text-xs font-semibold text-slate-700 truncate" title={currentLessonData?.title}>
            {currentLessonData?.title || <span className="text-amber-600 text-xs italic">Chưa có dữ liệu PPCT</span>}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Thời lượng (Duration)
          </span>
          <div className="text-sm font-bold text-blue-700">
            35 phút (35 minutes)
          </div>
        </div>
      </div>
    </div>
  );
};
