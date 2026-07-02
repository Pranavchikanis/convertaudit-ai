"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

const PHASES = [
  "Scraping Target DOM Structure...",
  "Extracting Core Copy & Headers...",
  "Executing Gemini AI CRO Brainstorming...",
  "Hydrating Report Dashboard..."
];

export function ProgressiveLoader() {
  const [phaseIndex, setPhaseIndex] = React.useState(0);

  React.useEffect(() => {
    // 0 -> 1 at 2s
    const t1 = setTimeout(() => setPhaseIndex(1), 2000);
    // 1 -> 2 at 4s
    const t2 = setTimeout(() => setPhaseIndex(2), 4000);
    // 2 -> 3 at 8s
    const t3 = setTimeout(() => setPhaseIndex(3), 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-8 animate-in fade-in duration-500 w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        <Loader2 className="h-14 w-14 animate-spin text-blue-500 relative z-10" />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white transition-opacity duration-300">
          {PHASES[phaseIndex]}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Our AI is reading your page like a human expert. This process takes around 10-15 seconds.
        </p>
      </div>
      
      <div className="w-full max-w-sm bg-slate-800 rounded-full h-2 mt-8 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${((phaseIndex + 1) / PHASES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
