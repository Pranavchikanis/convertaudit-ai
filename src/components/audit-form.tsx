"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProgressiveLoader } from "./progressive-loader";
import { ReportDashboard } from "./report-dashboard";
import { AuditReport } from "@/types";
import { ArrowRight, AlertTriangle } from "lucide-react";

export function AuditForm() {
  const [url, setUrl] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [report, setReport] = React.useState<AuditReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUrl = url.trim();
    if (!targetUrl) return;
    
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
      setUrl(targetUrl);
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred.");
      }

      setReport(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to analyze the URL. Please try again.");
      setStatus("error");
    }
  };

  if (status === "loading") {
    return <ProgressiveLoader />;
  }

  if (status === "success" && report) {
    return (
      <div className="w-full flex flex-col items-center space-y-12 animate-in fade-in duration-700">
        <ReportDashboard report={report} />
        <Button variant="outline" size="lg" onClick={() => {
          setStatus("idle");
          setUrl("");
          setReport(null);
        }}>
          Audit Another Website
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label htmlFor="url-input" className="sr-only">Website URL</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-medium sm:text-sm text-base">https://</span>
          </div>
          <Input 
            id="url-input"
            type="text"
            placeholder="your-startup.com"
            value={url.replace(/^https?:\/\//i, '')}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="h-14 pl-16 text-lg bg-slate-900/80 backdrop-blur-md border-slate-700 hover:border-slate-600 focus-visible:ring-blue-500 shadow-inner rounded-xl"
          />
        </div>
        <Button type="submit" size="lg" className="h-14 text-base font-bold px-8 shadow-xl shadow-blue-900/20 rounded-xl">
          Analyze Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
      
      {status === "error" && (
        <div className="flex items-start gap-3 text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-900/50">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
