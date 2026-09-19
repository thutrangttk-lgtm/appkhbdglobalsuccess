export interface VocabularyItem {
  word: string;
  pronunciation?: string;
  meaning: string;
}

export interface SentencePatternItem {
  pattern: string;
  example: string;
}

export interface OfficialIntegration {
  type: string; // 'AI Literacy' | 'Digital Competence' | 'Đạo đức' | 'An toàn giao thông' | 'Bảo vệ môi trường' | 'STEM' | 'Chuyển đổi số' | 'Quyền trẻ em'
  code?: string;
  name: string;
  description: string;
  source: string;
  sourceReference?: string;
}

export interface ActivityStage {
  stageName: string; // "1. Warm-up", "2. Presentation", "3. Practice & Application", "4. Consolidation & Homework"
  durationMinutes: number; // 5, 10, 15, 5
  teacherActivities: string[];
  pupilActivities: string[];
  expectedOutcomes: string[];
  postLessonAdjustments?: string;
}

export interface IntegrationItem {
  id: string;
  category: 'AI Literacy' | 'Digital Competence' | 'Ethics' | 'Children Rights' | 'Environmental Education' | 'STEM' | 'Digital Transformation' | 'Life Skills' | 'Citizenship';
  code?: string; // Official verified code, or undefined if pending
  title: string;
  description: string;
  suggestedActivities: string[];
  requiresCodeVerification?: boolean;
}

export type CurriculumContentType = 'STARTER' | 'UNIT_LESSON' | 'REVIEW' | 'EXTENSION' | 'OTHER';

export interface LessonData {
  grade: number; // 1, 2, 3, 4, 5
  week: number; // 1 -> 35
  period: number; // e.g. 1, 2, 3...

  contentType?: CurriculumContentType; // STARTER | UNIT_LESSON | REVIEW | EXTENSION | OTHER
  contentTypeLabel?: string; // "Starter" | "Unit 1" | "Review 1" | "Extension" | "Fun time 1"

  unit?: number; // Optional (undefined for Starter, Review, Extension)
  unitTitle?: string; // Optional (undefined for Starter, Review, Extension)
  lesson?: number; // Optional (undefined for Starter, Review, Extension)
  lessonPart?: string; // e.g. "Lesson 1"
  title: string; // e.g. "Look, listen and repeat; Point and say" or "Review 1" or "Starter"
  durationMinutes?: number; // 35
  duration?: number; // 35
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePatternItem[];
  languageSkills: string[];
  objectives: {
    languageKnowledge?: string[];
    languageSkills?: string[];
    generalCompetences?: string[];
    qualities?: string[];
  } | string[];
  activities?: ActivityStage[];
  integrations?: OfficialIntegration[];
  integrationCandidates?: IntegrationItem[];
  source?: string;
  sourceFile?: string;
}

export interface CurriculumDataStore {
  grade: number;
  totalWeeks: number;
  totalPeriods: number;
  source: string;
  sourceFile: string;
  units: {
    unit: number;
    unitTitle: string;
    weeks: number[];
    lessons: LessonData[];
  }[];
}

