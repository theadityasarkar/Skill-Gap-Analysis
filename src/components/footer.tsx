import * as React from "react";
import { ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#070a12] py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-400 font-sans">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Private & Secure
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Free Tier Powered
          </span>
        </div>
        <p className="text-xs text-slate-500 text-center md:text-right">
          &copy; {currentYear} SkillGap.AI • Next.js & Gemini Intelligence Engine.
        </p>
      </div>
    </footer>
  );
}
