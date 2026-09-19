import { LessonData } from '../types/curriculum';
import grade1Data from '../data/grade1.json';
import grade2Data from '../data/grade2.json';
import grade3Data from '../data/grade3.json';
import grade4Data from '../data/grade4.json';
import grade5Data from '../data/grade5.json';

const curriculumDatabase: Record<number, any> = {
  1: grade1Data,
  2: grade2Data,
  3: grade3Data,
  4: grade4Data,
  5: grade5Data,
};

export class CurriculumService {
  public static getGrades(): number[] {
    return [1, 2, 3, 4, 5];
  }

  public static getWeeksForGrade(grade: number): number[] {
    const weeks: Set<number> = new Set();
    const gradeData = curriculumDatabase[grade];
    if (gradeData && gradeData.units) {
      gradeData.units.forEach((unitItem: any) => {
        if (unitItem.weeks) {
          unitItem.weeks.forEach((w: number) => weeks.add(w));
        }
      });
    }
    // Fallback: Default primary school has weeks 1 to 35
    if (weeks.size === 0) {
      for (let i = 1; i <= 35; i++) weeks.add(i);
    }
    return Array.from(weeks).sort((a, b) => a - b);
  }

  public static getUnits(grade: number, week?: number): { unit: number; unitTitle: string }[] {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return [];
    
    return gradeData.units
      .filter((u: any) => !week || (u.weeks && u.weeks.includes(week)))
      .map((u: any) => ({
        unit: u.unit,
        unitTitle: u.unitTitle,
      }));
  }

  public static getLessons(grade: number, unitNumber: number): { lesson: number; title: string }[] {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return [];
    
    const targetUnit = gradeData.units.find((u: any) => u.unit === unitNumber);
    if (!targetUnit || !targetUnit.lessons) return [];

    return targetUnit.lessons.map((l: any) => ({
      lesson: l.lesson,
      title: l.title,
    }));
  }

  public static getLessonData(grade: number, unitNumber: number, lessonNumber: number): LessonData | null {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return null;

    const targetUnit = gradeData.units.find((u: any) => u.unit === unitNumber);
    if (!targetUnit || !targetUnit.lessons) return null;

    const targetLesson = targetUnit.lessons.find((l: any) => l.lesson === lessonNumber);
    if (!targetLesson) return null;

    return targetLesson as LessonData;
  }
}
