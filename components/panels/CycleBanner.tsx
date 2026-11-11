"use client";

import React, { useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import { useAnalysisStore } from "@/store/useAnalysisStore";

export function CycleBanner() {
  const { result, focusCycle, clearCycleHighlight, cycleHighlightNodes } =
    useAnalysisStore();
  const [expanded, setExpanded] = useState(false);

  if (!result || result.cycles.length === 0) return null;

  const cycleCount = result.cycles.length;
  const isHighlighting = cycleHighlightNodes.size > 0;

  return (
    <div className="absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] sm:left-4 sm:top-4 sm:max-w-md">
      <div className="rounded-xl border border-danger-line bg-danger-soft/95 p-3 text-xs text-danger shadow-[0_12px_32px_-24px_rgba(120,40,20,0.55)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#f3dcd5] text-danger">
              <LuTriangleAlert className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="truncate font-medium text-[#6f2618]">
              {cycleCount} circular{" "}
              {cycleCount === 1 ? "dependency" : "dependencies"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {isHighlighting && (
              <button
                type="button"
                onClick={clearCycleHighlight}
                className="rounded border border-danger-line bg-surface/70 px-2 py-1 text-[10px] font-medium text-danger transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/25"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="rounded px-1.5 py-1 text-[10px] font-medium text-danger/80 transition-colors hover:bg-[#f3dcd5] hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/25"
            >
              {expanded ? "Hide" : "View"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto border-t border-danger-line/70 pt-2.5">
            {result.cycles.map((cycle, index) => (
              <button
                key={index}
                type="button"
                onClick={() => focusCycle(cycle)}
                className="w-full rounded-lg border border-danger-line/60 bg-surface/55 px-2.5 py-2 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/25"
                title="Highlight this cycle on the canvas"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-danger">
                    Cycle #{index + 1} · {cycle.length} files
                  </span>
                  <span className="text-[10px] text-muted">Inspect</span>
                </div>
                <div className="break-all font-mono text-[11px] leading-relaxed text-muted">
                  {cycle.map((filePath, i) => (
                    <span key={filePath}>
                      <span className="font-medium text-ink">
                        {filePath.split("/").pop()}
                      </span>
                      {i < cycle.length - 1 ? (
                        <span className="text-faint"> → </span>
                      ) : (
                        <span className="text-danger"> → loop</span>
                      )}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
