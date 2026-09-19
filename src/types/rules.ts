export interface RuleValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'curriculum' | 'structure' | 'timing' | 'integration' | 'formatting';
  message: string;
  field?: string;
}

export interface ValidationReport {
  isValid: boolean;
  score: number; // 0 -> 100
  issues: RuleValidationIssue[];
  validatedAt: string;
}
