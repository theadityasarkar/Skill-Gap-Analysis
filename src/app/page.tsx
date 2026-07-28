"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeUploader } from "@/components/resume-uploader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2, FileText, Target, Zap, CheckCircle } from "lucide-react";
import { useAnalysisStore } from "@/store/analysis-store";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const { setLoading, setResult, setError } = useAnalysisStore();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyze = async () => {
    if ((!file && !resumeText.trim()) || !jobDescription.trim()) {
      toast.error("Please provide both your resume and the job description.");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      } else if (resumeText.trim()) {
        formData.append("resumeText", resumeText);
      }
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        router.push("/results");
      } else {
        toast.error(data.error || "Analysis failed. Please try again.");
        setError(data.error || "Analysis failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
      setError("Network error.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const isFormValid = (file !== null || resumeText.trim().length > 0) && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden pt-12 pb-24">
      {/* Vibrant Ambient Glow Nodes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-blue-500/15 to-cyan-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-80 right-10 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>AI Candidate Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Bridge the Gap Between Your Resume &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Target Role
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, paste a job description, and get instant AI-powered compatibility scoring, skill gap diagnostics, and step-by-step learning roadmaps.
          </p>
        </div>

        {/* Interactive Feature Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="glass-card glass-card-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1.5">1. Upload Resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Supports PDF, DOCX, DOC, or TXT format with instant text extraction.</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-indigo-400">
              <CheckCircle className="w-3.5 h-3.5" /> Fast Parsing Engine
            </div>
          </div>

          <div className="glass-card glass-card-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1.5">2. AI Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Gemini AI evaluates missing skills, priority gaps, and ATS alignment.</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-blue-400">
              <CheckCircle className="w-3.5 h-3.5" /> Contextual NLP Matching
            </div>
          </div>

          <div className="glass-card glass-card-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1.5">3. Actionable Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Receive personalized learning paths, free course links, and PDF exports.</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-cyan-400">
              <CheckCircle className="w-3.5 h-3.5" /> Instant PDF Generation
            </div>
          </div>
        </div>

        {/* Main Analysis Form Workspace */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step 1: Resume Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-600/30">1</span>
                  Your Resume
                </label>
              </div>
              <ResumeUploader
                onFileSelect={setFile}
                onTextChange={setResumeText}
                isLoading={isSubmitting}
              />
            </div>

            {/* Step 2: Job Description Input */}
            <div className="space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-600/30">2</span>
                  Target Job Description
                </label>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  placeholder="Paste the target job description or core skills requirements here..."
                  className="flex-1 min-h-[220px] resize-y rounded-2xl bg-slate-950/60 border-white/10 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 font-sans"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="text-[11px] font-mono text-slate-500 text-right">
                  {jobDescription.trim().split(/\s+/).filter(w => w.length > 0).length} words
                </div>
              </div>
            </div>
          </div>

          {/* Action Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-xl shadow-indigo-500/25 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleAnalyze}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                  Running AI Evaluation Engine...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span>Run Skill Analysis</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
