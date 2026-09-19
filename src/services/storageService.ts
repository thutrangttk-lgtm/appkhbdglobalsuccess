import { LessonPlanDocument, LessonPlanVersion } from '../types/lessonPlan';

const STORAGE_KEY_PLANS = 'ai_lesson_studio_plans_v1';
const STORAGE_KEY_VERSIONS = 'ai_lesson_studio_versions_v1';
const STORAGE_KEY_SETTINGS = 'ai_lesson_studio_settings_v1';

export interface UserSettings {
  teacherName: string;
  schoolName: string;
  governingBody: string;
  schoolAdminName: string;
  headTeacherName: string;
  aiProvider: 'local' | 'gemini' | 'openai';
  apiKey: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  teacherName: 'Tran Thi Thu Trang',
  schoolName: 'TRAN TAN KHUONG PRIMARY SCHOOL',
  governingBody: "HIEP PHUOC COMMUNE PEOPLE'S COMMITTEE",
  schoolAdminName: 'Trương Thị Lệ Hằng',
  headTeacherName: 'Nguyễn Thị Ngà',
  aiProvider: 'local',
  apiKey: '',
};

export class StorageService {
  // --- Lesson Plans Storage ---
  public static getAllPlans(): LessonPlanDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PLANS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getPlanById(id: string): LessonPlanDocument | null {
    const plans = this.getAllPlans();
    return plans.find((p) => p.id === id) || null;
  }

  public static savePlan(plan: LessonPlanDocument): boolean {
    try {
      const plans = this.getAllPlans();
      const existingIndex = plans.findIndex((p) => p.id === plan.id);

      const updatedPlan = {
        ...plan,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        plans[existingIndex] = updatedPlan;
      } else {
        plans.unshift(updatedPlan);
      }

      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
      this.createVersionSnapshot(updatedPlan);
      return true;
    } catch (err) {
      console.error('Failed to save plan to storage:', err);
      return false;
    }
  }

  public static deletePlan(id: string): boolean {
    try {
      const plans = this.getAllPlans().filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
      return true;
    } catch {
      return false;
    }
  }

  public static duplicatePlan(id: string): LessonPlanDocument | null {
    const original = this.getPlanById(id);
    if (!original) return null;

    const copy: LessonPlanDocument = {
      ...JSON.parse(JSON.stringify(original)),
      id: `LP-COPY-${Date.now()}`,
      title: `${original.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    this.savePlan(copy);
    return copy;
  }

  public static renamePlan(id: string, newTitle: string): boolean {
    const plan = this.getPlanById(id);
    if (!plan) return false;

    plan.title = newTitle;
    return this.savePlan(plan);
  }

  // --- Version Control ---
  public static getVersionsForPlan(planId: string): LessonPlanVersion[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_VERSIONS}_${planId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static createVersionSnapshot(plan: LessonPlanDocument): void {
    try {
      const versions = this.getVersionsForPlan(plan.id);
      const newVersion: LessonPlanVersion = {
        version: versions.length + 1,
        timestamp: new Date().toISOString(),
        doc: JSON.parse(JSON.stringify(plan)),
        note: `Bản lưu v${versions.length + 1}`,
      };

      // Keep maximum 10 recent version snapshots
      versions.unshift(newVersion);
      if (versions.length > 10) versions.pop();

      localStorage.setItem(`${STORAGE_KEY_VERSIONS}_${plan.id}`, JSON.stringify(versions));
    } catch (err) {
      console.warn('Failed to snapshot version:', err);
    }
  }

  // --- Settings ---
  public static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: UserSettings): boolean {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  }
}
