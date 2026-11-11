"use client";

import React from "react";
import { useAnalysisStore } from "@/store/useAnalysisStore";

export function StatsBar() {
  const { result } = useAnalysisStore();

  if (!result) return null;

  const { stats, repo } = result;

  return (
    <div className="z-10 flex w-full flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-surface/70 px-4 py-2 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2 font-mono sm:hidden">
        <span className="max-w-48 truncate rounded border border-line bg-surface px-1.5 py-0.5 text-[11px] font-medium text-ink">
          {repo.owner}/{repo.name}
        </span>
        <span className="text-[10px] text-faint">@{repo.branch}</span>
      </div>

      <dl className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-faint">
            Files
          </dt>
          <dd className="font-mono text-[12px] font-semibold tabular-nums text-ink">
            {stats.files}
          </dd>
        </div>

        <div className="h-3.5 w-px bg-line" aria-hidden />

        <div className="flex items-baseline gap-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-faint">
            Lines
          </dt>
          <dd className="font-mono text-[12px] font-semibold tabular-nums text-ink">
            {stats.lines.toLocaleString()}
          </dd>
        </div>

        <div className="h-3.5 w-px bg-line" aria-hidden />

        <div className="flex items-center gap-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-faint">
            Cycles
          </dt>
          <dd>
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                stats.cycles > 0
                  ? "border-danger-line bg-danger-soft text-danger"
                  : "border-success-line bg-success-soft text-success"
              }`}
            >
              {stats.cycles}
            </span>
          </dd>
        </div>

        {stats.mostConnected && (
          <>
            <div className="hidden h-3.5 w-px bg-line md:block" aria-hidden />
            <div className="hidden items-baseline gap-1.5 md:flex">
              <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-faint">
                Top hub
              </dt>
              <dd
                className="max-w-40 truncate font-mono text-[12px] font-medium text-ink"
                title={`${stats.mostConnected} (${stats.mostConnectedCount} connections)`}
              >
                {stats.mostConnected.split("/").pop()}
              </dd>
              <span className="font-mono text-[10px] text-faint">
                {stats.mostConnectedCount}
              </span>
            </div>
          </>
        )}

        {stats.orphans.length > 0 && (
          <>
            <div className="hidden h-3.5 w-px bg-line lg:block" aria-hidden />
            <div className="hidden items-baseline gap-1.5 lg:flex">
              <dt className="text-[10px] font-medium uppercase tracking-[0.08em] text-faint">
                Isolated
              </dt>
              <dd className="font-mono text-[12px] font-semibold tabular-nums text-ink">
                {stats.orphans.length}
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
