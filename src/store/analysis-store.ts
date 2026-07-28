"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  setResult: (result: AnalysisResult) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null,
      isLoading: false,
      error: null,
      setResult: (result) => set({ result, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      reset: () => set({ result: null, isLoading: false, error: null }),
    }),
    {
      name: "skill-gap-analysis-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.sessionStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({ result: state.result }),
    }
  )
);
