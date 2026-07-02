"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  score: number;
  label: string;
  className?: string;
}

export function ProgressRing({ score, label, className }: ProgressRingProps) {
  const [mounted, setMounted] = React.useState(false);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Animate from 0 on mount
  const displayScore = mounted ? score : 0;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  
  let colorClass = "text-red-500";
  if (score >= 80) colorClass = "text-emerald-500";
  else if (score >= 50) colorClass = "text-amber-500";

  React.useEffect(() => {
    // Slight delay to trigger animation
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <div className="relative flex items-center justify-center mb-4">
        <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-white">
          <span className="text-3xl font-bold tracking-tighter">{score}</span>
        </div>
      </div>
      <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">{label}</span>
    </div>
  );
}
