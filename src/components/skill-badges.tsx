import React from "react";
import { MissingSkill } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface SkillBadgesProps {
  matchedSkills: string[];
  missingSkills: MissingSkill[];
}

export function SkillBadges({ matchedSkills, missingSkills }: SkillBadgesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Matched Skills Card */}
      <div className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-semibold text-zinc-100">Matched Skills</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
              {matchedSkills.length} Verified
            </span>
          </div>

          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/80 border border-white/10 text-xs font-medium text-zinc-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono py-4 text-center">No explicit skill overlap detected.</p>
          )}
        </div>
      </div>

      {/* Missing Skills Card */}
      <div className="p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Missing Skill Gaps</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs">
              {missingSkills.length} Action Items
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-col gap-3">
              {missingSkills.map((item, idx) => {
                let dotColor = "bg-zinc-400";
                let badgeStyle = "bg-zinc-800 border-zinc-700 text-zinc-300";

                if (item.priority === "High") {
                  dotColor = "bg-rose-500";
                  badgeStyle = "bg-rose-500/10 border-rose-500/20 text-rose-400";
                } else if (item.priority === "Medium") {
                  dotColor = "bg-amber-400";
                  badgeStyle = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                }

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
                        <span className="text-xs font-semibold text-zinc-100">{item.skill}</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-md border text-[10px] font-mono uppercase tracking-wider", badgeStyle)}>
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-normal pl-3.5">
                      {item.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono py-4 text-center">Zero skill gaps found! Candidate profile fully meets requirements.</p>
          )}
        </div>
      </div>
    </div>
  );
}
