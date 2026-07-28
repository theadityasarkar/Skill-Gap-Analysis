"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysisStore } from "@/store/analysis-store";
import { ResultsDashboard } from "@/components/results-dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { result, isLoading, error } = useAnalysisStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !result && !isLoading && !error) {
      router.replace("/");
    }
  }, [isMounted, result, isLoading, error, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-grid-pattern pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid-pattern relative overflow-hidden pt-12 pb-24">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Evaluation Report</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Skill Compatibility & Roadmap
          </h1>
          <p className="text-sm text-zinc-400">
            Algorithmic score evaluation based on current resume capabilities vs job requirements.
          </p>
        </div>

        {isLoading && <LoadingSkeleton />}

        {error && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 max-w-xl mx-auto text-center space-y-4 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-rose-300">Analysis Error</h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline" className="border-white/10 text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Analyzer
            </Button>
          </div>
        )}

        {!result && !isLoading && !error && (
          <div className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 max-w-xl mx-auto text-center space-y-4 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-zinc-200">No Evaluation Found</h2>
            <p className="text-xs text-zinc-400">Please provide a resume and job description to generate a report.</p>
            <Button onClick={() => router.push("/")} className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs">
              Go to Analyzer
            </Button>
          </div>
        )}

        {result && !isLoading && <ResultsDashboard result={result} />}
      </div>
    </div>
  );
}
