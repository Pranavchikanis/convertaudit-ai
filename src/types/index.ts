export interface Recommendation {
  category: "Critical Fix" | "Quick Win" | "Strategic Improvement";
  issue: string;
  impact: string;
  solution: string;
}

export interface AuditScores {
  ux: number;
  copy: number;
  conversionProbability: number;
}

export interface AuditReport {
  scores: AuditScores;
  recommendations: Recommendation[];
}
