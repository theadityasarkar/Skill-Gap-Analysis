"use client";

import React from "react";
import { ExternalLink, BookOpen, Clock } from "lucide-react";
import { RoadmapStep } from "@/types/analysis";

interface LearningRoadmapProps {
  steps: RoadmapStep[];
}

export function LearningRoadmap({ steps }: LearningRoadmapProps) {
  return (
    <div className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Personalized Learning Roadmap</h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">{steps.length} Milestones</span>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {steps.map((step, index) => (
          <div key={index} className="relative group">
            {/* Step Timeline Node */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 text-white flex items-center justify-center text-[10px] font-mono font-bold group-hover:border-white/50 group-hover:scale-110 transition-all">
              {step.step}
            </div>

            {/* Step Card */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-zinc-100">{step.title}</h4>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-white/10 text-[11px] font-mono text-zinc-400 w-fit">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{step.estimatedTime}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-normal">
                {step.description}
              </p>

              {step.resources && step.resources.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Curated Free Resources:</span>
                  <div className="flex flex-col gap-1.5">
                    {step.resources.map((resource, idx) => (
                      <div key={idx} className="text-xs">
                        {resource.startsWith("http") ? (
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="truncate max-w-[280px] sm:max-w-[450px]">{resource}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-zinc-400">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span>{resource}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
