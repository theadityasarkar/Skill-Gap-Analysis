"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

export function ScoreGauge({ score, label, size = 160 }: ScoreGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 150);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  let strokeColor = "stroke-emerald-400";
  let textColor = "text-emerald-400";
  let badgeText = "Excellent";

  if (score <= 35) {
    strokeColor = "stroke-rose-500";
    textColor = "text-rose-500";
    badgeText = "Low Alignment";
  } else if (score <= 65) {
    strokeColor = "stroke-amber-400";
    textColor = "text-amber-400";
    badgeText = "Moderate Alignment";
  } else if (score <= 85) {
    strokeColor = "stroke-emerald-400";
    textColor = "text-emerald-400";
    badgeText = "Strong Alignment";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-sm">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-zinc-800"
          />
          {/* Score gauge circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", strokeColor)}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
            {score}<span className="text-lg text-zinc-400 ml-0.5">%</span>
          </span>
          <span className={cn("text-[10px] font-mono uppercase tracking-wider mt-0.5", textColor)}>
            {badgeText}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs font-mono uppercase tracking-wider text-zinc-400">{label}</p>
    </div>
  );
}
