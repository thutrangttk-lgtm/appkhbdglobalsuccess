import React from 'react';
import { LessonData } from '../../types/curriculum';
import { BookOpen, Key, MessageSquare, Target, Clock, ShieldCheck, Eye, Layers } from 'lucide-react';

interface LessonInfoCardProps {
  lessonData: LessonData | null;
  onOpenSourceViewer: () => void;
}

export const LessonInfoCard: React.FC<LessonInfoCardProps> = ({
  lessonData,
  onOpenSourceViewer,
}) => {
  if (!lessonData) {
    return (
      <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto font-bold text-xl">
          !
        </div>
        <h3 className="font-bold text-slate-800 text-base">Chưa có dữ liệu PPCT xác minh cho bài học này.</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Vui lòng chọn Khối Lớp (Grade 1–5), Tuần (Week 1–35) và Tiết dạy (Period) tương ứng từ Khung Phân phân phối chương trình chính thức.
        </p>
      </div>
    );
  }

  // Parse objectives if object or array
  let objectivesList: string[] = [];
  if (Array.isArray(lessonData.objectives)) {
    objectivesList = lessonData.objectives;
  } else if (lessonData.objectives && typeof lessonData.objectives === 'object') {
    const obj = lessonData.objectives as any;
    objectivesList = [
      ...(obj.languageKnowledge || []),
      ...(obj.languageSkills || []),
      ...(obj.generalCompetences || []),
      ...(obj.qualities || []),
    ];
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
      {/* Top Banner with Source Badge */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-400/30">
              Grade {lessonData.grade} • Tuần {lessonData.week} • Tiết {lessonData.period}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Nguồn: PPCT Grade {lessonData.grade}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Unit {lessonData.unit}: {lessonData.unitTitle} — {lessonData.title}
          </h2>
        </div>

        <button
          onClick={onOpenSourceViewer}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Eye className="w-4 h-4" />
          [Xem nguồn dữ liệu gốc]
        </button>
      </div>

      {/* Main Grid Info */}
      <div className="p-6 space-y-6">
        {/* Basic Meta Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Khối Lớp (Grade):</span>
            <span className="font-extrabold text-slate-900 text-sm">Lớp {lessonData.grade}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Tuần / Tiết:</span>
            <span className="font-extrabold text-slate-900 text-sm">Tuần {lessonData.week} — Tiết {lessonData.period}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Bài học (Unit & Lesson):</span>
            <span className="font-extrabold text-slate-900 text-sm">Unit {lessonData.unit} ({lessonData.lessonPart || `Lesson ${lessonData.lesson}`})</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Thời lượng (Duration):</span>
            <span className="font-extrabold text-blue-700 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 35 phút
            </span>
          </div>
        </div>

        {/* Language Focus Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Key className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              TRỌNG TÂM NGÔN NGỮ (LANGUAGE FOCUS)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vocabulary */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Từ Vựng (Vocabulary):
              </span>
              {lessonData.vocabulary && lessonData.vocabulary.length > 0 ? (
                <div className="space-y-1.5">
                  {lessonData.vocabulary.map((vocab, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 text-xs bg-white px-3 py-2 rounded-lg border border-blue-200/60 shadow-2xs">
                      <span className="font-extrabold text-blue-950">{vocab.word}</span>
                      {vocab.pronunciation && (
                        <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {vocab.pronunciation}
                        </span>
                      )}
                      <span className="text-slate-600 text-[11px] italic">({vocab.meaning})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Không có từ vựng mới bắt buộc cho tiết học này.</p>
              )}
            </div>

            {/* Sentence Patterns */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Mẫu Câu & Cấu Trúc (Sentence Patterns):
              </span>
              {lessonData.sentencePatterns && lessonData.sentencePatterns.length > 0 ? (
                <div className="space-y-1.5">
                  {lessonData.sentencePatterns.map((sp, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-200/60 space-y-1 text-xs shadow-2xs">
                      <div className="font-bold text-indigo-950 font-mono">{sp.pattern}</div>
                      {sp.example && (
                        <div className="text-slate-600 text-[11px] italic">Ví dụ: "{sp.example}"</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Không có mẫu câu mới bắt buộc cho tiết học này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Objectives & Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              MỤC TIÊU BÀI HỌC & KỸ NĂNG (OBJECTIVES & SKILLS)
            </h3>
          </div>
          {objectivesList.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {objectivesList.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Chưa có thông tin mục tiêu bài học.</p>
          )}
        </div>
      </div>
    </div>
  );
};
