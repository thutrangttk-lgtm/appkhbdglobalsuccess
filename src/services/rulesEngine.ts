import { LessonPlanDocument } from '../types/lessonPlan';
import { RuleValidationIssue, ValidationReport } from '../types/rules';

export class RulesEngine {
  public static validate(doc: LessonPlanDocument): ValidationReport {
    const issues: RuleValidationIssue[] = [];

    // 1. Validate Header & Basic Curriculum Information
    if (!doc.header.grade || doc.header.grade < 1 || doc.header.grade > 5) {
      issues.push({
        id: 'ERR-GRADE',
        severity: 'error',
        category: 'curriculum',
        message: 'Khối lớp không hợp lệ (Phải từ Lớp 1 đến Lớp 5).',
        field: 'header.grade',
      });
    }

    if (!doc.header.unitNumber || doc.header.unitNumber < 1) {
      issues.push({
        id: 'ERR-UNIT',
        severity: 'error',
        category: 'curriculum',
        message: 'Thông tin Unit chưa được chọn hoặc không hợp lệ.',
        field: 'header.unitNumber',
      });
    }

    if (!doc.header.lessonNumber || doc.header.lessonNumber < 1) {
      issues.push({
        id: 'ERR-LESSON',
        severity: 'error',
        category: 'curriculum',
        message: 'Thông tin Bài học (Lesson) chưa được chọn.',
        field: 'header.lessonNumber',
      });
    }

    // 2. Validate Duration (Primary English total duration must equal exactly 35 minutes)
    const totalStageMinutes = doc.procedures.stages.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    if (doc.header.durationMinutes !== 35) {
      issues.push({
        id: 'ERR-DURATION-TOTAL',
        severity: 'error',
        category: 'timing',
        message: `Thời lượng tiết học Tiếng Anh Tiểu học phải đúng 35 phút (hiện tại: ${doc.header.durationMinutes} phút).`,
        field: 'header.durationMinutes',
      });
    }

    if (totalStageMinutes !== 35) {
      issues.push({
        id: 'ERR-STAGE-MINUTES',
        severity: 'error',
        category: 'timing',
        message: `Tổng thời lượng 4 bước tiến trình dạy học phải bằng 35 phút (hiện tại: ${totalStageMinutes} phút).`,
        field: 'procedures.stages',
      });
    }

    // 3. Validate Vocabulary & Sentence Patterns
    if (!doc.objectives.languageKnowledge.vocabulary || doc.objectives.languageKnowledge.vocabulary.length === 0) {
      issues.push({
        id: 'WARN-VOCAB-EMPTY',
        severity: 'warning',
        category: 'curriculum',
        message: 'Bài học chưa có từ vựng trọng tâm SGK.',
        field: 'objectives.languageKnowledge.vocabulary',
      });
    }

    if (!doc.objectives.languageKnowledge.sentencePatterns || doc.objectives.languageKnowledge.sentencePatterns.length === 0) {
      issues.push({
        id: 'WARN-PATTERN-EMPTY',
        severity: 'warning',
        category: 'curriculum',
        message: 'Bài học chưa có mẫu câu trọng tâm SGK.',
        field: 'objectives.languageKnowledge.sentencePatterns',
      });
    }

    // 4. Validate Procedure Stages & Duplications
    const stageNames = doc.procedures.stages.map((s) => s.stageName.trim().toLowerCase());
    const uniqueStageNames = new Set(stageNames);
    if (stageNames.length !== uniqueStageNames.size) {
      issues.push({
        id: 'ERR-DUPLICATE-STAGES',
        severity: 'error',
        category: 'structure',
        message: 'Phát hiện các bước dạy học bị trùng lặp.',
        field: 'procedures.stages',
      });
    }

    // Mandatory 4 stages in CV 2345
    const requiredKeywords = ['warm-up', 'presentation', 'practice', 'consolidation'];
    requiredKeywords.forEach((kw) => {
      const hasStage = stageNames.some((name) => name.includes(kw));
      if (!hasStage) {
        issues.push({
          id: `WARN-MISSING-STAGE-${kw.toUpperCase()}`,
          severity: 'warning',
          category: 'structure',
          message: `Tiến trình bài dạy nên có bước '${kw}'.`,
          field: 'procedures.stages',
        });
      }
    });

    // 5. Validate Integration Section Duplication
    if (doc.objectives.integrations && doc.objectives.integrations.length > 0) {
      const integrationTitles = doc.objectives.integrations.map((i) => i.title.toLowerCase());
      const uniqueIntegrations = new Set(integrationTitles);
      if (integrationTitles.length !== uniqueIntegrations.size) {
        issues.push({
          id: 'WARN-DUPLICATE-INTEGRATION',
          severity: 'warning',
          category: 'integration',
          message: 'Phát hiện nội dung Tích hợp liên môn bị trùng lặp.',
          field: 'objectives.integrations',
        });
      }

      // Check for code verification warnings
      doc.objectives.integrations.forEach((item) => {
        if (item.requiresCodeVerification || !item.code) {
          issues.push({
            id: `INFO-INTEGRATION-CODE-${item.id}`,
            severity: 'info',
            category: 'integration',
            message: `Gợi ý tích hợp '${item.title}' – Mã năng lực cần xác thực trước khi ban hành chính thức.`,
            field: 'objectives.integrations',
          });
        }
      });
    }

    // Calculate score
    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    
    let score = 100 - errorCount * 25 - warningCount * 10;
    if (score < 0) score = 0;

    return {
      isValid: errorCount === 0,
      score,
      issues,
      validatedAt: new Date().toISOString(),
    };
  }
}
