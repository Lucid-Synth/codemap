"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { StatsBar } from "@/components/panels/StatsBar";
import { InspectorPanel } from "@/components/panels/InspectorPanel";
import { CycleBanner } from "@/components/panels/CycleBanner";
import { BrandMark } from "@/components/BrandMark";

export default function ExplorePage() {
  const router = useRouter();
  const { result, reset } = useAnalysisStore();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (!result && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background text-muted">
        <div className="flex items-center gap-3 text-[13px]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
          Loading analysis…
        </div>
      </div>
    );
  }

  const handleReset = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-ink">
      <header className="z-30 shrink-0 border-b border-line bg-background/90 backdrop-blur-md">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            onClick={reset}
            className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            aria-label="Back to CodeMap home"
          >
            <BrandMark className="h-7 w-7 transition-transform duration-200 group-hover:-rotate-6" />
            <span className="text-[14px] font-semibold tracking-tight text-ink">
              CodeMap
            </span>
          </Link>

          <span className="hidden text-line-strong sm:inline" aria-hidden>
            /
          </span>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="max-w-64 truncate font-mono text-[12px] text-muted">
              {result.repo.owner}/{result.repo.name}
            </span>
            <span className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint">
              @{result.repo.branch}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <LuArrowLeft className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">New analysis</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      <StatsBar />

      <main className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1">
          <CycleBanner />
          <GraphCanvas />
        </div>

        <InspectorPanel />
      </main>
    </div>
  );
}
