export interface MissingSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
  resources: string[];
}

export interface AnalysisResult {
  profileFitScore: number;
  skillMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  gapAnalysis: string;
  learningRoadmap: RoadmapStep[];
  resumeSuggestions: string[];
}
