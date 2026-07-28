import React from "react";
import { Lightbulb } from "lucide-react";

interface ResumeSuggestionsProps {
  suggestions: string[];
}

export function ResumeSuggestions({ suggestions }: ResumeSuggestionsProps) {
  return (
    <div className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <h3 className="text-sm font-semibold text-zinc-100">High-Impact Resume Rewrite Recommendations</h3>
      </div>

      <div className="flex flex-col gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex items-start gap-3 hover:border-white/20 transition-all"
          >
            <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-white/10 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {suggestion}
              </p>
            </div>
            <Lightbulb className="w-4 h-4 text-amber-400/60 shrink-0 hidden sm:block mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
