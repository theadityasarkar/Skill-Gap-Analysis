import { NextResponse } from "next/server";
import { parseResume } from "@/lib/resume-parser";
import { analyzeSkillGap } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const resumeFile = formData.get("resume");
    const resumeTextRaw = formData.get("resumeText") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required." }, { status: 400 });
    }

    let finalResumeText = "";

    if (resumeFile && resumeFile instanceof File) {
      try {
        finalResumeText = await parseResume(resumeFile);
      } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to parse the uploaded file. Ensure it's a valid PDF, DOCX, or TXT." }, { status: 400 });
      }
    } else if (resumeTextRaw && resumeTextRaw.trim() !== "") {
      finalResumeText = resumeTextRaw.trim();
    } else {
      return NextResponse.json({ error: "Either a resume file or text content is required." }, { status: 400 });
    }

    if (finalResumeText.trim() === "") {
      return NextResponse.json({ error: "The provided resume appears to be empty." }, { status: 400 });
    }

    const result = await analyzeSkillGap(finalResumeText, jobDescription);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    
    const errorMessage = error?.message || "An unexpected error occurred during analysis.";
    const lowerMsg = errorMessage.toLowerCase();

    if (lowerMsg.includes("rate") || lowerMsg.includes("quota") || lowerMsg.includes("429")) {
      return NextResponse.json({ error: "Gemini API rate limit reached. Please wait 30-60 seconds and try again." }, { status: 429 });
    }

    if (lowerMsg.includes("api key") || lowerMsg.includes("missing")) {
      return NextResponse.json({ error: "Google Gemini API key is missing on server. Please configure GOOGLE_GEMINI_API_KEY." }, { status: 500 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
