import React from "react";

interface GapAnalysisProps {
  analysis: string;
}

export function GapAnalysis({ analysis }: GapAnalysisProps) {
  const paragraphs = analysis.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <div className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <h3 className="text-sm font-semibold text-zinc-100">Executive Gap Analysis Report</h3>
      </div>

      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="pl-4 border-l-2 border-white/10 hover:border-white/30 transition-colors text-zinc-300"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
