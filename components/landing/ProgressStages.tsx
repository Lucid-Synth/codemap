"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import type { AnalysisStage } from "@/types/graph";

interface StageConfig {
  key: AnalysisStage;
  label: string;
}

const STAGES: StageConfig[] = [
  { key: "fetching-tree", label: "Reading file list" },
  { key: "fetching-files", label: "Fetching source files" },
  { key: "parsing", label: "Resolving imports" },
  { key: "detecting-cycles", label: "Detecting circular dependencies" },
];

function getStageStatus(
  currentStage: AnalysisStage,
  stageKey: AnalysisStage,
): "pending" | "active" | "done" {
  const order: AnalysisStage[] = [
    "fetching-tree",
    "fetching-files",
    "parsing",
    "detecting-cycles",
    "done",
  ];

  const currentIndex = order.indexOf(currentStage);
  const stageIndex = order.indexOf(stageKey);

  if (currentStage === "done" || currentIndex > stageIndex) {
    return "done";
  }
  if (currentIndex === stageIndex) {
    return "active";
  }
  return "pending";
}

export function ProgressStages() {
  const { stage, progress, error } = useAnalysisStore();

  if (stage === "idle") return null;

  return (
    <div className="mt-4 rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(20,22,26,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-medium text-ink">
          {stage === "error" ? "Analysis failed" : "Analysing codebase"}
        </h3>
        {progress && (
          <span className="font-mono text-[12px] tabular-nums text-accent">
            {progress.percent}%
          </span>
        )}
      </div>

      {stage !== "error" && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progress?.percent || 15}%` }}
          />
        </div>
      )}

      <ul className="mt-5 space-y-3">
        {STAGES.map((s) => {
          const status = getStageStatus(stage, s.key);
          return (
            <li
              key={s.key}
              className={`flex items-center gap-3 text-[13px] transition-colors ${
                status === "done"
                  ? "text-muted"
                  : status === "active"
                  ? "font-medium text-ink"
                  : "text-faint"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center">
                {status === "done" ? (
                  <LuCheck
                    className="h-3.5 w-3.5 text-accent"
                    aria-hidden
                  />
                ) : status === "active" ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                )}
              </span>
              {s.label}
            </li>
          );
        })}
      </ul>

      {progress?.message && stage !== "error" && (
        <p className="mt-4 truncate border-t border-line pt-3 font-mono text-[12px] text-faint">
          {progress.message}
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] leading-relaxed text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}
