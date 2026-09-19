import { VocabularyItem, SentencePatternItem, ActivityStage, IntegrationItem } from './curriculum';

export interface HeaderInfo {
  governingBody: string; // "HIEP PHUOC COMMUNE PEOPLE'S COMMITTEE"
  schoolName: string; // "TRAN TAN KHUONG PRIMARY SCHOOL"
  teacherName: string; // "Tran Thi Thu Trang"
  grade: number;
  unitNumber: number;
  unitTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  period: number;
  durationMinutes: number; // 35
}

export interface SectionObjectives {
  languageKnowledge: {
    vocabulary: VocabularyItem[];
    sentencePatterns: SentencePatternItem[];
  };
  languageSkills: string[];
  generalCompetencesAndQualities: string[];
  integrations: IntegrationItem[];
}

export interface SectionTeachingAids {
  teacherEquipment: string[];
  pupilEquipment: string[];
}

export interface SectionProcedures {
  stages: ActivityStage[];
}

export interface SignaturesInfo {
  schoolAdminRole: string; // "BAN GIÁM HIỆU"
  schoolAdminName: string; // "Trương Thị Lệ Hằng"
  headTeacherRole: string; // "TỔ TRƯỜNG"
  headTeacherName: string; // "Nguyễn Thị Ngà"
}

export interface LessonPlanDocument {
  id: string;
  title: string;
  grade: number;
  week: number;
  unit: number;
  lesson: number;
  header: HeaderInfo;
  objectives: SectionObjectives;
  teachingAids: SectionTeachingAids;
  procedures: SectionProcedures;
  postLessonReflection: string;
  signatures: SignaturesInfo;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: 'draft' | 'validated' | 'exported';
}

export interface LessonPlanVersion {
  version: number;
  timestamp: string;
  doc: LessonPlanDocument;
  note?: string;
}
