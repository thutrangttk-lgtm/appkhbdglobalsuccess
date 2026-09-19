import { LessonData, CurriculumDataStore } from '../types/curriculum';
import grade1Data from '../data/grade1.json';
import grade2Data from '../data/grade2.json';
import grade3Data from '../data/grade3.json';
import grade4Data from '../data/grade4.json';
import grade5Data from '../data/grade5.json';
import aiLiteracyData from '../data/integrations/ai-literacy.json';
import digitalCompetenceData from '../data/integrations/digital-competence.json';
import otherIntegrationsData from '../data/integrations/other-integrations.json';

const curriculumDatabase: Record<number, CurriculumDataStore> = {
  1: grade1Data as unknown as CurriculumDataStore,
  2: grade2Data as unknown as CurriculumDataStore,
  3: grade3Data as unknown as CurriculumDataStore,
  4: grade4Data as unknown as CurriculumDataStore,
  5: grade5Data as unknown as CurriculumDataStore,
};

export class CurriculumService {
  public static getGrades(): number[] {
    return [1, 2, 3, 4, 5];
  }

  public static getWeeksForGrade(grade: number): number[] {
    const weeks: number[] = [];
    for (let i = 1; i <= 35; i++) {
      weeks.push(i);
    }
    return weeks;
  }

  public static getPeriodsForWeek(grade: number, week: number): LessonData[] {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return [];

    const periodLessons: LessonData[] = [];
    gradeData.units.forEach((u) => {
      if (u.lessons) {
        u.lessons.forEach((l) => {
          if (l.week === week) {
            periodLessons.push(l as LessonData);
          }
        });
      }
    });

    return periodLessons.sort((a, b) => a.period - b.period);
  }

  public static getUnits(grade: number, week?: number): { unit: number; unitTitle: string }[] {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return [];

    const unitMap = new Map<number, string>();
    gradeData.units.forEach((u) => {
      if (!week || (u.weeks && u.weeks.includes(week))) {
        unitMap.set(u.unit, u.unitTitle);
      }
    });

    // Fallback: list all units for grade if none match specific week
    if (unitMap.size === 0) {
      gradeData.units.forEach((u) => {
        unitMap.set(u.unit, u.unitTitle);
      });
    }

    return Array.from(unitMap.entries()).map(([unit, unitTitle]) => ({
      unit,
      unitTitle,
    })).sort((a, b) => a.unit - b.unit);
  }

  public static getLessons(grade: number, unitNumber: number): { lesson: number; title: string }[] {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return [];

    const targetUnit = gradeData.units.find((u) => u.unit === unitNumber);
    if (!targetUnit || !targetUnit.lessons) return [];

    return targetUnit.lessons.map((l) => ({
      lesson: l.lesson ?? 0,
      title: l.title,
    }));
  }

  public static getLessonDataByWeekAndPeriod(grade: number, week: number, period: number): LessonData | null {
    const periods = this.getPeriodsForWeek(grade, week);
    const target = periods.find((p) => p.period === period);
    if (target) return target;

    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return null;
    for (const u of gradeData.units) {
      for (const l of u.lessons) {
        if (l.period === period) return l;
      }
    }
    return null;
  }

  public static getLessonData(grade: number, unitNumber: number, lessonNumber: number): LessonData | null {
    const gradeData = curriculumDatabase[grade];
    if (!gradeData || !gradeData.units) return null;

    const targetUnit = gradeData.units.find((u) => u.unit === unitNumber);
    if (!targetUnit || !targetUnit.lessons) return null;

    const targetLesson = targetUnit.lessons.find((l) => l.lesson === lessonNumber);
    if (!targetLesson) return null;

    return targetLesson as LessonData;
  }

  public static getCurriculumStats() {
    const statsByGrade: Record<number, {
      loadedWeeks: number;
      totalPeriods: number;
      source: string;
      sourceStatus: 'loaded' | 'unavailable';
      completionStatus: 'complete' | 'incomplete' | 'no_source';
      percentage: number;
    }> = {};

    let totalExtractedWeeks = 0;

    [1, 2, 3, 4, 5].forEach((g) => {
      const gData = curriculumDatabase[g];
      let periodCount = 0;
      const weekSet = new Set<number>();
      if (gData && gData.units) {
        gData.units.forEach((u) => {
          u.lessons?.forEach((l) => {
            if (l.week) weekSet.add(l.week);
            periodCount++;
          });
        });
      }
      const loadedWeeks = weekSet.size;
      totalExtractedWeeks += loadedWeeks;
      const sourceStatus: 'loaded' | 'unavailable' = gData ? 'loaded' : 'unavailable';
      const completionStatus: 'complete' | 'incomplete' | 'no_source' = loadedWeeks === 35 ? 'complete' : loadedWeeks > 0 ? 'incomplete' : 'no_source';
      const percentage = Math.round((loadedWeeks / 35) * 100);

      statsByGrade[g] = {
        loadedWeeks,
        totalPeriods: periodCount,
        source: gData?.source || `PPCT Grade ${g}`,
        sourceStatus,
        completionStatus,
        percentage,
      };
    });

    const totalGradeWeeksExpected = 175; // 5 grades * 35 weeks
    const overallPercentage = Math.round((totalExtractedWeeks / totalGradeWeeksExpected) * 1000) / 10;

    return {
      grades: statsByGrade,
      totalExtractedWeeks,
      totalGradeWeeksExpected,
      overallPercentage,
      isOverallComplete: totalExtractedWeeks === totalGradeWeeksExpected,
      aiLiteracyCodesLoaded: aiLiteracyData.length,
      digitalCompetenceCodesLoaded: digitalCompetenceData.length,
      otherIntegrationsLoaded: otherIntegrationsData.length,
    };
  }
}

