import React from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';
import { Plus, Trash2, BookOpen, MessageSquare } from 'lucide-react';

interface ObjectivesEditorProps {
  plan: LessonPlanDocument;
  onChange: (updatedPlan: LessonPlanDocument) => void;
}

export const ObjectivesEditor: React.FC<ObjectivesEditorProps> = ({ plan, onChange }) => {
  // Vocabulary Handlers
  const handleAddVocab = () => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.vocabulary.push({ word: '', pronunciation: '', meaning: '' });
    onChange(updated);
  };

  const handleUpdateVocab = (index: number, field: 'word' | 'pronunciation' | 'meaning', value: string) => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.vocabulary[index][field] = value;
    onChange(updated);
  };

  const handleRemoveVocab = (index: number) => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.vocabulary.splice(index, 1);
    onChange(updated);
  };

  // Sentence Patterns Handlers
  const handleAddPattern = () => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.sentencePatterns.push({ pattern: '', example: '' });
    onChange(updated);
  };

  const handleUpdatePattern = (index: number, field: 'pattern' | 'example', value: string) => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.sentencePatterns[index][field] = value;
    onChange(updated);
  };

  const handleRemovePattern = (index: number) => {
    const updated = { ...plan };
    updated.objectives.languageKnowledge.sentencePatterns.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>I. OBJECTIVES (MỤC TIÊU BÀI DẠY)</span>
      </h3>

      {/* 1. Vocabulary Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Từ vựng Trọng tâm (Vocabulary)</span>
          </label>
          <button
            onClick={handleAddVocab}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm từ vựng
          </button>
        </div>

        <div className="space-y-2">
          {plan.objectives.languageKnowledge.vocabulary.map((vocab, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Từ vựng (word)"
                value={vocab.word}
                onChange={(e) => handleUpdateVocab(idx, 'word', e.target.value)}
                className="md:col-span-4 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phiên âm (/pronunciation/)"
                value={vocab.pronunciation || ''}
                onChange={(e) => handleUpdateVocab(idx, 'pronunciation', e.target.value)}
                className="md:col-span-3 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nghĩa tiếng Việt"
                value={vocab.meaning}
                onChange={(e) => handleUpdateVocab(idx, 'meaning', e.target.value)}
                className="md:col-span-4 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleRemoveVocab(idx)}
                className="md:col-span-1 text-slate-400 hover:text-red-600 flex justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sentence Patterns Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Mẫu câu Trọng tâm (Sentence Patterns)</span>
          </label>
          <button
            onClick={handleAddPattern}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm mẫu câu
          </button>
        </div>

        <div className="space-y-2">
          {plan.objectives.languageKnowledge.sentencePatterns.map((pattern, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="text"
                placeholder="Cấu trúc mẫu câu (pattern)"
                value={pattern.pattern}
                onChange={(e) => handleUpdatePattern(idx, 'pattern', e.target.value)}
                className="md:col-span-6 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Ví dụ minh họa (example)"
                value={pattern.example}
                onChange={(e) => handleUpdatePattern(idx, 'example', e.target.value)}
                className="md:col-span-5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-blue-800 italic focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleRemovePattern(idx)}
                className="md:col-span-1 text-slate-400 hover:text-red-600 flex justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
