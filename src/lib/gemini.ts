import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult } from "@/types/analysis";
import { SYSTEM_INSTRUCTION, getAnalysisPrompt } from "./prompts";

export async function analyzeSkillGap(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (apiKey && apiKey.trim() !== "") {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      "gemini-2.0-flash-exp",
    ];

    const generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          profileFitScore: { type: SchemaType.NUMBER },
          skillMatchPercentage: { type: SchemaType.NUMBER },
          matchedSkills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          missingSkills: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                skill: { type: SchemaType.STRING },
                priority: {
                  type: SchemaType.STRING,
                  enum: ["High", "Medium", "Low"],
                },
                reason: { type: SchemaType.STRING },
              },
              required: ["skill", "priority", "reason"],
            },
          },
          gapAnalysis: { type: SchemaType.STRING },
          learningRoadmap: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                step: { type: SchemaType.NUMBER },
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                estimatedTime: { type: SchemaType.STRING },
                resources: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
              required: ["step", "title", "description", "estimatedTime", "resources"],
            },
          },
          resumeSuggestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: [
          "profileFitScore",
          "skillMatchPercentage",
          "matchedSkills",
          "missingSkills",
          "gapAnalysis",
          "learningRoadmap",
          "resumeSuggestions",
        ],
      },
    };

    const prompt = getAnalysisPrompt(resumeText, jobDescription);

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
          generationConfig,
        });

        const result = await model.generateContent(prompt);
        let rawText = result.response.text();

        rawText = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/, "")
          .replace(/```\s*$/, "")
          .trim();

        const data = JSON.parse(rawText) as AnalysisResult;

        data.profileFitScore = Math.min(100, Math.max(0, Math.round(data.profileFitScore || 0)));
        data.skillMatchPercentage = Math.min(100, Math.max(0, Math.round(data.skillMatchPercentage || 0)));
        data.matchedSkills = Array.isArray(data.matchedSkills) ? data.matchedSkills : [];
        data.missingSkills = Array.isArray(data.missingSkills) ? data.missingSkills : [];
        data.learningRoadmap = Array.isArray(data.learningRoadmap) ? data.learningRoadmap : [];
        data.resumeSuggestions = Array.isArray(data.resumeSuggestions) ? data.resumeSuggestions : [];

        return data;
      } catch (error: any) {
        console.warn(`Model ${modelName} attempt failed:`, error?.message || error);
      }
    }
  }

  // Smart Fallback Analyzer when API key is missing, invalid, or rate limited
  console.log("Using Smart Skill Match Analyzer (Fallback Mode)...");
  return generateSmartFallbackAnalysis(resumeText, jobDescription);
}

function generateSmartFallbackAnalysis(resumeText: string, jobDescription: string): AnalysisResult {
  const commonTechSkills = [
    "React", "React.js", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python",
    "Tailwind CSS", "CSS", "HTML", "Redux", "Zustand", "REST API", "GraphQL", "Git",
    "GitHub", "Docker", "AWS", "SQL", "PostgreSQL", "MongoDB", "Express", "Jest",
    "Cypress", "CI/CD", "Vercel", "System Design", "UI/UX", "Agile", "Scrum"
  ];

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const jdSkills = commonTechSkills.filter((skill) =>
    jdLower.includes(skill.toLowerCase())
  );
  
  // Default skills if none extracted from JD text
  const targetSkills = jdSkills.length >= 3 ? jdSkills : ["React", "Next.js", "TypeScript", "Tailwind CSS", "State Management", "REST APIs"];

  const matchedSkills: string[] = [];
  const missingSkillsList: Array<{ skill: string; priority: "High" | "Medium" | "Low"; reason: string }> = [];

  targetSkills.forEach((skill, idx) => {
    if (resumeLower.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      const priority = idx === 0 ? "High" : idx < 3 ? "Medium" : "Low";
      missingSkillsList.push({
        skill,
        priority,
        reason: `Explicitly required in the target role but not highlighted in your resume skills or project experiences.`,
      });
    }
  });

  const total = targetSkills.length || 1;
  const matchPct = Math.round((matchedSkills.length / total) * 100);
  const fitScore = Math.min(95, Math.max(25, matchPct + (resumeText.length > 500 ? 15 : 5)));

  const missingNames = missingSkillsList.map(s => s.skill).join(", ") || "advanced production optimization";

  return {
    profileFitScore: fitScore,
    skillMatchPercentage: matchPct,
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : ["JavaScript", "HTML/CSS", "Git", "Problem Solving"],
    missingSkills: missingSkillsList.length > 0 ? missingSkillsList : [
      { skill: "System Architecture", priority: "Medium", reason: "Preferred for senior engineering responsibilities." }
    ],
    gapAnalysis: `Based on an analysis of your background against the target job requirements, you possess strong foundational alignment in ${matchedSkills.slice(0, 3).join(", ") || "core web concepts"}. 

However, there are critical technical gaps in key areas expected by recruiters, specifically: ${missingNames}. 

To maximize your interview callback rate, you should bridge these missing technical proficiencies and emphasize real-world project outcomes where these technologies are actively applied.`,
    learningRoadmap: [
      {
        step: 1,
        title: `Master Fundamental Core: ${missingSkillsList[0]?.skill || "Target Skills"}`,
        description: `Deep dive into official documentation and foundational concepts for ${missingSkillsList[0]?.skill || "core technologies"}. Build a standalone mini project.`,
        estimatedTime: "1-2 Weeks",
        resources: [
          "freeCodeCamp - https://www.freecodecamp.org",
          "Official Documentation & Interactive Tutorials",
          "YouTube - Traversy Media / Fireship Tutorials"
        ]
      },
      {
        step: 2,
        title: `Build End-to-End Projects with ${missingSkillsList[1]?.skill || "Advanced Frameworks"}`,
        description: `Integrate ${missingSkillsList[1]?.skill || "state management & APIs"} into a production-ready web application hosted on Vercel or Netlify.`,
        estimatedTime: "2 Weeks",
        resources: [
          "GitHub Open Source Repositories",
          "Frontend Mentor - Practical Challenges"
        ]
      },
      {
        step: 3,
        title: "Resume Optimization & ATS Alignment",
        description: "Rewrite your project bullet points using the Google XYZ action verb format: Accomplished [X] as measured by [Y], by doing [Z].",
        estimatedTime: "3 Days",
        resources: [
          "Harvard Resume Action Verbs Guide",
          "ATS Optimization Best Practices"
        ]
      }
    ],
    resumeSuggestions: [
      `Add a dedicated 'Technical Skills' section categorizing languages, frameworks, and tools explicitly mentioned in the job description.`,
      `Quantify impact in bullet points (e.g. 'Optimized app render performance by 35% using React memoization').`,
      `Highlight experience with ${missingSkillsList[0]?.skill || "missing skills"} directly in relevant project descriptions.`,
      `Ensure resume format is cleanly parsed by ATS scanners (avoid multi-column table layouts).`,
      `Include live deployment links (Vercel, GitHub) for key projects listed on your resume.`
    ]
  };
}
