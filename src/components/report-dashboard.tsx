"use client";

import * as React from "react";
import { AuditReport } from "@/types";
import { ProgressRing } from "./ui/progress-ring";
import { AccordionItem } from "./ui/accordion";
import { AlertCircle, Zap, TrendingUp, CheckCircle2, Download } from "lucide-react";
import { Button } from "./ui/button";

export function ReportDashboard({ report }: { report: AuditReport }) {
  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Critical Fix": return <AlertCircle className="h-5 w-5 text-red-500 mr-3 shrink-0" />;
      case "Quick Win": return <Zap className="h-5 w-5 text-yellow-500 mr-3 shrink-0" />;
      case "Strategic Improvement": return <TrendingUp className="h-5 w-5 text-blue-500 mr-3 shrink-0" />;
      default: return <CheckCircle2 className="h-5 w-5 text-slate-500 mr-3 shrink-0" />;
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 transition-all duration-700 ease-out print:space-y-8 print:bg-white print:text-black">
      
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white print:text-black">Your CRO Audit Results</h2>
          <p className="text-slate-400 text-lg print:text-black">Based on our advanced AI heuristic analysis.</p>
        </div>
        <Button onClick={handleExportPDF} className="print:hidden" variant="default" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Export as PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm print:bg-white print:border-slate-300 print:shadow-none print:break-inside-avoid">
        <ProgressRing score={report.scores.ux} label="UX Score" />
        <ProgressRing score={report.scores.copy} label="Copy Score" />
        <ProgressRing score={report.scores.conversionProbability} label="Conversion Probability" />
      </div>

      <div className="space-y-6 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 print:bg-white print:border-none print:shadow-none print:p-0">
        <h3 className="text-2xl font-bold text-white mb-6 border-slate-800 pb-2 print:text-black print:border-slate-300 print:border-b-2">Prioritized Recommendations</h3>
        
        <div className="space-y-2 print:space-y-4">
          {report.recommendations.map((rec, i) => (
            <div key={i} className="print:break-inside-avoid">
              <AccordionItem 
                defaultOpen={true} // Always open all items for printing, though state is managed inside AccordionItem
                title={
                  <div className="flex items-center">
                    {getIconForCategory(rec.category)}
                    <span className="font-semibold text-white mr-2 md:mr-4 shrink-0 print:text-black">{rec.category}:</span>
                    <span className="text-slate-300 font-normal truncate print:text-slate-700 print:whitespace-normal">{rec.issue}</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-slate-700">The Impact</h4>
                    <p className="text-slate-200 leading-relaxed text-sm md:text-base print:text-black">{rec.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 print:text-slate-700">How to Fix</h4>
                    <p className="text-blue-50 bg-blue-900/30 p-5 rounded-xl border border-blue-800/40 leading-relaxed text-sm md:text-base print:bg-slate-100 print:text-black print:border-slate-300">
                      {rec.solution}
                    </p>
                  </div>
                </div>
              </AccordionItem>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
