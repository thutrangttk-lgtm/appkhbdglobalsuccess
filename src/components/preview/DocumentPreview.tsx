import React from 'react';
import { LessonPlanDocument } from '../../types/lessonPlan';

interface DocumentPreviewProps {
  plan: LessonPlanDocument;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ plan }) => {
  return (
    <div className="py-8 px-4 flex justify-center bg-slate-200/70 min-h-screen">
      {/* A4 Paper Container */}
      <div className="a4-document-container bg-white w-[210mm] min-h-[297mm] p-[20mm_15mm_20mm_20mm] shadow-2xl rounded-xs text-black font-serif border border-slate-300 text-[13pt] leading-normal select-text">
        {/* Header Block */}
        <div className="text-center mb-4 space-y-0.5">
          <p className="font-bold text-[11pt] uppercase">{plan.header.governingBody}</p>
          <p className="font-bold text-[11pt] uppercase">{plan.header.schoolName}</p>
          <p className="italic text-[12pt]">Teacher: {plan.header.teacherName}</p>
        </div>

        {/* Title Area */}
        <div className="text-center my-6">
          <h1 className="font-bold text-[15pt] uppercase text-blue-950">
            LESSON PLAN GRADE {plan.header.grade} – GLOBAL SUCCESS
          </h1>
          <h2 className="font-bold text-[14pt] uppercase mt-1">
            UNIT {plan.header.unitNumber}: {plan.header.unitTitle} - LESSON {plan.header.lessonNumber}
          </h2>
          <p className="italic text-[12pt] mt-0.5">
            Period: {plan.header.period} | Duration: {plan.header.durationMinutes} minutes
          </p>
        </div>

        {/* Section I: OBJECTIVES */}
        <div className="mb-6">
          <h3 className="font-bold text-[13pt] uppercase mb-2">I. OBJECTIVES</h3>
          <p className="italic mb-2">By the end of the lesson, pupils are able to:</p>
          
          <p className="font-bold text-[13pt] mt-2">1. Language Knowledge & Skills</p>
          <p className="font-bold italic text-[13pt] pl-4">a. Language Knowledge:</p>
          
          {plan.objectives.languageKnowledge.vocabulary.length > 0 && (
            <p className="pl-8 text-[13pt]">
              <span className="font-bold">• Vocabulary: </span>
              {plan.objectives.languageKnowledge.vocabulary
                .map((v) => `${v.word}${v.pronunciation ? ' ' + v.pronunciation : ''} (${v.meaning})`)
                .join('; ')}
            </p>
          )}

          {plan.objectives.languageKnowledge.sentencePatterns.length > 0 && (
            <p className="pl-8 text-[13pt]">
              <span className="font-bold">• Sentence Patterns: </span>
              {plan.objectives.languageKnowledge.sentencePatterns.map((p) => p.pattern).join('; ')}
            </p>
          )}

          <p className="font-bold italic text-[13pt] pl-4 mt-2">b. Language Skills:</p>
          <p className="pl-8 text-[13pt]">
            Listening, Speaking, Reading, and Writing integrated. Thereby contributing to the development of pupils' general competences and qualities such as autonomy, communication and cooperation.
          </p>

          {plan.objectives.integrations && plan.objectives.integrations.length > 0 && (
            <div className="mt-3">
              <p className="font-bold text-[13pt]">2. Integration:</p>
              {plan.objectives.integrations.map((item) => (
                <p key={item.id} className="pl-4 text-[13pt]">
                  <span className="font-bold">• [{item.category}] {item.title}: </span>
                  {item.description}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Section II: TEACHING AIDS */}
        <div className="mb-6">
          <h3 className="font-bold text-[13pt] uppercase mb-2">II. TEACHING AIDS AND LEARNING MATERIALS</h3>
          <p className="pl-4 text-[13pt]">
            <span className="font-bold">• Teacher: </span>
            {plan.teachingAids.teacherEquipment.join(', ')}
          </p>
          <p className="pl-4 text-[13pt]">
            <span className="font-bold">• Pupils: </span>
            {plan.teachingAids.pupilEquipment.join(', ')}
          </p>
        </div>

        {/* Section III: TEACHING PROCEDURES (3 COLUMNS TABLE) */}
        <div className="mb-6">
          <h3 className="font-bold text-[13pt] uppercase mb-3">III. TEACHING PROCEDURES</h3>
          
          <table className="w-full border-collapse border border-black text-[11pt]">
            <thead>
              <tr className="bg-slate-100 font-bold text-center">
                <th className="border border-black p-2 w-[45%]">LEARNING ACTIVITIES</th>
                <th className="border border-black p-2 w-[35%]">EXPECTED OUTCOMES & EVIDENCE OF INTEGRATION</th>
                <th className="border border-black p-2 w-[20%]">POST-LESSON ADJUSTMENTS</th>
              </tr>
            </thead>
            <tbody>
              {plan.procedures.stages.map((stage, idx) => (
                <tr key={idx} className="align-top">
                  {/* Column 1: Activities */}
                  <td className="border border-black p-2.5 space-y-2">
                    <p className="font-bold text-[12pt] text-blue-900">
                      {stage.stageName} ({stage.durationMinutes} mins)
                    </p>
                    <div className="space-y-1">
                      {stage.teacherActivities.map((ta, tIdx) => (
                        <p key={tIdx}>• <span className="font-semibold">Teacher:</span> {ta}</p>
                      ))}
                    </div>
                    <div className="space-y-1 pt-1 border-t border-slate-200">
                      {stage.pupilActivities.map((pa, pIdx) => (
                        <p key={pIdx}>• <span className="font-semibold">Pupils:</span> {pa}</p>
                      ))}
                    </div>
                  </td>

                  {/* Column 2: Expected Outcomes */}
                  <td className="border border-black p-2.5 space-y-1.5">
                    {stage.expectedOutcomes.map((eo, eIdx) => (
                      <p key={eIdx}>• {eo}</p>
                    ))}
                  </td>

                  {/* Column 3: Adjustments */}
                  <td className="border border-black p-2.5 italic text-slate-700">
                    {stage.postLessonAdjustments || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Post-Lesson Reflection */}
        <div className="mb-8">
          <p className="font-bold text-[13pt]">Post-lesson Reflection:</p>
          <p className="italic pl-4 text-[13pt]">{plan.postLessonReflection || 'None.'}</p>
        </div>

        {/* Signatures Area (2 Columns) */}
        <table className="w-full border-none mt-12">
          <tbody>
            <tr>
              <td className="w-1/2 text-center align-top border-none">
                <p className="font-bold text-[13pt] uppercase">{plan.signatures.schoolAdminRole}</p>
                <div className="h-20"></div>
                <p className="font-bold text-[13pt]">{plan.signatures.schoolAdminName}</p>
              </td>
              <td className="w-1/2 text-center align-top border-none">
                <p className="font-bold text-[13pt] uppercase">{plan.signatures.headTeacherRole}</p>
                <div className="h-20"></div>
                <p className="font-bold text-[13pt]">{plan.signatures.headTeacherName}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
