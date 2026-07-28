"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types/analysis";
import { ScoreGauge } from "./score-gauge";
import { SkillBadges } from "./skill-badges";
import { GapAnalysis } from "./gap-analysis";
import { LearningRoadmap } from "./learning-roadmap";
import { ResumeSuggestions } from "./resume-suggestions";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { useAnalysisStore } from "@/store/analysis-store";
import { toast } from "sonner";

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const router = useRouter();
  const reset = useAnalysisStore((state) => state.reset);

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const margin = 20;
      let y = margin;
      const lineHeight = 6;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - margin * 2;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("AI Skill Gap Analysis Report", margin, y);
      y += lineHeight * 2;

      // Scores
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`Profile Fit Score: ${result.profileFitScore}%   |   Skill Match: ${result.skillMatchPercentage}%`, margin, y);
      y += lineHeight * 2;

      // Matched Skills
      if (result.matchedSkills && result.matchedSkills.length > 0) {
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Matched Skills", margin, y);
        y += lineHeight;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const matchedText = result.matchedSkills.join(", ");
        const splitMatched = doc.splitTextToSize(matchedText, contentWidth);
        checkPageBreak(splitMatched.length * lineHeight);
        doc.text(splitMatched, margin, y);
        y += splitMatched.length * lineHeight + lineHeight;
      }

      // Missing Skills
      if (result.missingSkills && result.missingSkills.length > 0) {
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Missing Skills & Priority", margin, y);
        y += lineHeight;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        result.missingSkills.forEach((skill) => {
          const itemText = `- ${skill.skill} [${skill.priority} Priority]: ${skill.reason}`;
          const splitItem = doc.splitTextToSize(itemText, contentWidth);
          checkPageBreak(splitItem.length * lineHeight + 2);
          doc.text(splitItem, margin, y);
          y += splitItem.length * lineHeight + 2;
        });
        y += lineHeight;
      }

      // Gap Analysis
      if (result.gapAnalysis) {
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Gap Analysis", margin, y);
        y += lineHeight;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const paragraphs = result.gapAnalysis.split("\n\n");
        paragraphs.forEach((p) => {
          const splitP = doc.splitTextToSize(p.trim(), contentWidth);
          checkPageBreak(splitP.length * lineHeight + 4);
          doc.text(splitP, margin, y);
          y += splitP.length * lineHeight + 4;
        });
        y += lineHeight;
      }

      // Learning Roadmap
      if (result.learningRoadmap && result.learningRoadmap.length > 0) {
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Learning Roadmap", margin, y);
        y += lineHeight;

        result.learningRoadmap.forEach((step) => {
          checkPageBreak(lineHeight * 4);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`Step ${step.step}: ${step.title} (${step.estimatedTime})`, margin, y);
          y += lineHeight;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const splitDesc = doc.splitTextToSize(step.description, contentWidth);
          checkPageBreak(splitDesc.length * lineHeight);
          doc.text(splitDesc, margin, y);
          y += splitDesc.length * lineHeight + 3;
        });
        y += lineHeight;
      }

      // Resume Suggestions
      if (result.resumeSuggestions && result.resumeSuggestions.length > 0) {
        checkPageBreak(lineHeight * 3);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Resume Improvement Tips", margin, y);
        y += lineHeight;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        result.resumeSuggestions.forEach((sug, idx) => {
          const itemText = `${idx + 1}. ${sug}`;
          const splitSug = doc.splitTextToSize(itemText, contentWidth);
          checkPageBreak(splitSug.length * lineHeight + 2);
          doc.text(splitSug, margin, y);
          y += splitSug.length * lineHeight + 2;
        });
      }

      doc.save("skill-gap-analysis-report.pdf");
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error", error);
      toast.error("Failed to generate PDF report.");
    }
  };

  const handleAnalyzeAnother = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Report Generated Successfully</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none border-white/10 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export PDF
          </Button>
          <Button
            size="sm"
            onClick={handleAnalyzeAnother}
            className="flex-1 sm:flex-none bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Metrics Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreGauge score={result.profileFitScore} label="Overall Profile Fit" />
        <ScoreGauge score={result.skillMatchPercentage} label="Core Skill Match" />
      </div>

      {/* Matched & Missing Skills Badges */}
      <SkillBadges matchedSkills={result.matchedSkills} missingSkills={result.missingSkills} />

      {/* Executive Gap Analysis */}
      <GapAnalysis analysis={result.gapAnalysis} />

      {/* Step-by-Step Learning Roadmap */}
      <LearningRoadmap steps={result.learningRoadmap} />

      {/* Resume Optimization Suggestions */}
      <ResumeSuggestions suggestions={result.resumeSuggestions} />
    </div>
  );
}
