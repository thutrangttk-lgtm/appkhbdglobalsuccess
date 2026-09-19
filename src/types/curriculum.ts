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

export interface LessonData {
  grade: number; // 1, 2, 3, 4, 5
  week: number; // 1 -> 35
  period: number; // e.g. 1, 2, 3...
  unit: number; // e.g. 1
  unitTitle: string; // e.g. "In the school playground"
  lesson: number; // e.g. 1, 2, 3
  lessonPart?: string; // e.g. "Lesson 1"
  title: string; // e.g. "Lesson 1 - Look, listen and repeat; Point and say"
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

