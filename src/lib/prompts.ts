export const SYSTEM_INSTRUCTION = `You are an expert career counselor and technical recruiter. Your goal is to analyze a candidate's resume against a specific job description and provide a comprehensive, actionable skill gap analysis. Be thorough, honest, and constructive.`;

export function getAnalysisPrompt(resumeText: string, jobDescription: string): string {
  return `
Please analyze the following resume against the provided job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Instructions:
1. Identify all matching skills and missing skills. Prioritize missing skills as "High" (core/required), "Medium" (important/preferred), or "Low" (nice-to-have). Provide a brief reason for each.
2. Write a detailed 3-5 paragraph gap analysis.
3. Create a 4-7 step learning roadmap ordered by priority with REAL free resources (YouTube channels, freeCodeCamp, official docs, Coursera/edX free courses, GitHub repos).
4. Provide 5-8 specific, actionable resume rewrite suggestions.
5. Provide a profileFitScore (0-100) based on overall alignment.
6. Provide a skillMatchPercentage (0-100) based on skills overlap.
`;
}
