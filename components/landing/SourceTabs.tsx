"use client";

import React, { useState } from "react";
import { GithubForm } from "./GithubForm";
import { ZipDropzone } from "./ZipDropzone";
import { ProgressStages } from "./ProgressStages";
import { useAnalysisStore } from "@/store/useAnalysisStore";

export function SourceTabs() {
  const [activeTab, setActiveTab] = useState<"github" | "zip">("github");
  const { stage } = useAnalysisStore();
  const isAnalyzing = stage !== "idle" && stage !== "done" && stage !== "error";

  const tabs = [
    { id: "github" as const, label: "GitHub repository" },
    { id: "zip" as const, label: "ZIP archive" },
  ];

  return (
    <div className="w-full">
      <div className="rounded-xl border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(20,22,26,0.04)]">
        <div
          role="tablist"
          aria-label="Source to analyse"
          className="grid grid-cols-2 gap-1"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                disabled={isAnalyzing}
                className={`rounded-lg px-4 py-2.5 text-[13px] font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isActive
                    ? "bg-ink text-background shadow-sm"
                    : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "github" ? <GithubForm /> : <ZipDropzone />}
      </div>

      <ProgressStages />
    </div>
  );
}
