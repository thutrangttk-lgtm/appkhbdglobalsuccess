export interface VocabularyItem {
  word: string;
  pronunciation?: string;
  meaning: string;
}

export interface SentencePatternItem {
  pattern: string;
  example: string;
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
  unitTitle: string; // e.g. "ALL ABOUT ME!"
  lesson: number; // e.g. 1, 2, 3
  title: string; // e.g. "Lesson 2 - Activity 1, 2, 3"
  durationMinutes: number; // Always 35 for primary
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePatternItem[];
  languageSkills: string[];
  objectives: {
    languageKnowledge: string[];
    languageSkills: string[];
    generalCompetences: string[];
    qualities: string[];
  };
  activities: ActivityStage[];
  integrationCandidates: IntegrationItem[];
}

export interface CurriculumDataStore {
  grade: number;
  units: {
    unit: number;
    unitTitle: string;
    weeks: number[];
    lessons: LessonData[];
  }[];
}
