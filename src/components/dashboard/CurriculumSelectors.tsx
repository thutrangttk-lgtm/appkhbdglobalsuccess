import React from 'react';
import { CurriculumService } from '../../services/curriculumService';
import { BookOpen, Calendar, Layers, FileCode } from 'lucide-react';

interface CurriculumSelectorsProps {
  selectedGrade: number;
  selectedWeek: number;
  selectedUnit: number;
  selectedLesson: number;
  onGradeChange: (grade: number) => void;
  onWeekChange: (week: number) => void;
  onUnitChange: (unit: number) => void;
  onLessonChange: (lesson: number) => void;
}

export const CurriculumSelectors: React.FC<CurriculumSelectorsProps> = ({
  selectedGrade,
  selectedWeek,
  selectedUnit,
  selectedLesson,
  onGradeChange,
  onWeekChange,
  onUnitChange,
  onLessonChange,
}) => {
  const grades = CurriculumService.getGrades();
  const weeks = CurriculumService.getWeeksForGrade(selectedGrade);
  const units = CurriculumService.getUnits(selectedGrade, selectedWeek);
  const lessons = CurriculumService.getLessons(selectedGrade, selectedUnit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* 1. Grade Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>1. Chọn Khối Lớp (Grade)</span>
        </label>
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {grades.map((g) => (
            <option key={g} value={g}>
              Lớp {g} (Grade {g})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Week Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>2. Chọn Tuần (Week)</span>
        </label>
        <select
          value={selectedWeek}
          onChange={(e) => onWeekChange(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              Tuần {w} (Week {w})
            </option>
          ))}
        </select>
      </div>

      {/* 3. Unit Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>3. Chọn Bài học (Unit)</span>
        </label>
        <select
          value={selectedUnit}
          onChange={(e) => onUnitChange(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {units.length > 0 ? (
            units.map((u) => (
              <option key={u.unit} value={u.unit}>
                Unit {u.unit}: {u.unitTitle}
              </option>
            ))
          ) : (
            <option value={0}>Curriculum data not available – please verify.</option>
          )}
        </select>
      </div>

      {/* 4. Lesson Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-blue-600" />
          <span>4. Chọn Tiết dạy (Lesson)</span>
        </label>
        <select
          value={selectedLesson}
          onChange={(e) => onLessonChange(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {lessons.length > 0 ? (
            lessons.map((l) => (
              <option key={l.lesson} value={l.lesson}>
                Lesson {l.lesson} - {l.title}
              </option>
            ))
          ) : (
            <option value={0}>Curriculum data not available – please verify.</option>
          )}
        </select>
      </div>
    </div>
  );
};
