"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="mb-3 rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden transition-colors hover:border-slate-600/50">
      <button
        type="button"
        className="flex w-full items-center justify-between p-5 text-left transition-colors focus-visible:outline-none focus-visible:bg-slate-800/80"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex-1">{title}</div>
        <ChevronDown
          className={cn("h-5 w-5 text-slate-400 transition-transform duration-300 ml-4 shrink-0", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      <div
        className={cn("overflow-hidden transition-all duration-300 ease-in-out", {
          "max-h-0 opacity-0": !isOpen,
          "max-h-[1000px] opacity-100": isOpen,
        })}
      >
        <div className="p-5 pt-0 mt-2 border-t border-slate-700/30">
          {children}
        </div>
      </div>
    </div>
  );
}
