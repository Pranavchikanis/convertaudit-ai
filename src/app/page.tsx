import { AuditForm } from "@/components/audit-form";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConvertAudit AI | Drop your link, double your conversions",
  description: "Instant, AI-driven CRO landing page audits powered by Google Gemini.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-900/50 flex flex-col relative overflow-hidden print:bg-white print:text-black print:min-h-fit">
      
      {/* Abstract Background Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 print:hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800/50 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ConvertAudit<span className="text-blue-500">.ai</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-32 w-full print:p-0 print:block">
        
        <div className="text-center space-y-8 max-w-4xl mx-auto mb-16 print:hidden">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300 backdrop-blur-sm shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 mr-2.5 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
            Powered by Google Gemini AI
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
            Drop your link. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Double your conversions.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            ConvertAudit AI acts as your autonomous Staff Product Designer. Instantly translate your landing page into a prioritized, revenue-driving UX checklist.
          </p>
        </div>

        <div className="w-full relative z-20 print:bg-white">
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl rounded-[3rem] -z-10 print:hidden" />
          <AuditForm />
        </div>

      </section>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-slate-900 py-8 text-center text-slate-500 text-sm print:hidden">
        <p>&copy; {new Date().getFullYear()} ConvertAudit AI. Built for the modern web.</p>
      </footer>
    </main>
  );
}
