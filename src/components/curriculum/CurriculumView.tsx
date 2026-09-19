import React, { useState } from 'react';
import { CurriculumService } from '../../services/curriculumService';
import { BookOpen, Layers, Volume2, MessageSquare, CheckCircle2 } from 'lucide-react';

export const CurriculumView: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  const units = CurriculumService.getUnits(selectedGrade);
  const lessons = CurriculumService.getLessons(selectedGrade, selectedUnit);
  const activeLessonData = CurriculumService.getLessonData(selectedGrade, selectedUnit, lessons.length > 0 ? lessons[0].lesson : 1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Kho dữ liệu SGK Global Success (Curriculum Knowledge Base)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Dữ liệu chính thức chuẩn 100% Tiếng Anh Tiểu học Lớp 1–5 (NXB Giáo dục Việt Nam)</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex gap-4">
        {CurriculumService.getGrades().map((g) => (
          <button
            key={g}
            onClick={() => {
              setSelectedGrade(g);
              const uList = CurriculumService.getUnits(g);
              if (uList.length > 0) setSelectedUnit(uList[0].unit);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              selectedGrade === g
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Lớp {g}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Units Navigation List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Danh sách Unit</h3>
          {units.map((u) => (
            <button
              key={u.unit}
              onClick={() => setSelectedUnit(u.unit)}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border ${
                selectedUnit === u.unit
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
              }`}
            >
              Unit {u.unit}: {u.unitTitle}
            </button>
          ))}
        </div>

        {/* Lesson Data Viewer */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          {activeLessonData ? (
            <>
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">
                  Lớp {activeLessonData.grade} • Unit {activeLessonData.unit}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{activeLessonData.unitTitle}</h3>
                <p className="text-xs text-slate-500 font-medium">{activeLessonData.title}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-blue-600" /> Từ vựng chuẩn SGK
                  </h4>
                  <div className="space-y-2">
                    {activeLessonData.vocabulary.map((v, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs flex justify-between">
                        <span className="font-bold text-blue-900">{v.word} {v.pronunciation && <span className="font-serif text-slate-400">{v.pronunciation}</span>}</span>
                        <span className="text-slate-600">{v.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-600" /> Mẫu câu chuẩn SGK
                  </h4>
                  <div className="space-y-2">
                    {activeLessonData.sentencePatterns.map((p, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs space-y-1">
                        <p className="font-bold text-slate-900">{p.pattern}</p>
                        <p className="text-[11px] text-blue-700 italic">Ví dụ: {p.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 italic">Vui lòng chọn Unit để xem chi tiết.</p>
          )}
        </div>
      </div>
    </div>
  );
};
