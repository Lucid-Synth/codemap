"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuChevronRight, LuX } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { useAnalysisStore } from "@/store/useAnalysisStore";

const EXAMPLE_REPOS = [
  { label: "expressjs/express", url: "https://github.com/expressjs/express", branch: "master" },
  { label: "reduxjs/redux", url: "https://github.com/reduxjs/redux", branch: "master" },
  { label: "colinhacks/zod", url: "https://github.com/colinhacks/zod", branch: "master" },
];

export function GithubForm() {
  const router = useRouter();
  const { stage, analyzeGithub } = useAnalysisStore();

  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [showBranch, setShowBranch] = useState(false);
  const [localError, setLocalError] = useState("");

  const isLoading = stage !== "idle" && stage !== "error" && stage !== "done";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setLocalError("Enter a GitHub repository URL");
      return;
    }

    if (!trimmedUrl.includes("github.com")) {
      setLocalError("Only github.com repository URLs are supported");
      return;
    }

    const success = await analyzeGithub(trimmedUrl, branch.trim() || undefined);
    if (success) {
      router.push("/explore");
    }
  };

  const handleSelectExample = (exampleUrl: string, exampleBranch: string) => {
    setUrl(exampleUrl);
    setBranch(exampleBranch);
    setLocalError("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
          <SiGithub className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (localError) setLocalError("");
          }}
          placeholder="github.com/owner/repository"
          disabled={isLoading}
          aria-label="GitHub repository URL"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-line bg-surface py-3.5 pl-11 pr-10 font-mono text-[14px] text-ink shadow-[0_1px_2px_rgba(20,22,26,0.04)] transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
        {url && !isLoading && (
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Clear URL"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-faint transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LuX className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowBranch((v) => !v)}
        aria-expanded={showBranch}
        className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink"
      >
        <span
          className={`transition-transform duration-150 ${
            showBranch ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          <LuChevronRight className="h-3 w-3" aria-hidden />
        </span>
        Branch or subfolder
      </button>

      {showBranch && (
        <input
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="main, dev, or v2/src/components"
          disabled={isLoading}
          aria-label="Branch or subfolder"
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 font-mono text-[13px] text-ink transition-colors placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
      )}

      {localError && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {localError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[14px] font-medium text-background transition-all hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
            <span>Analysing repository</span>
          </>
        ) : (
          <>
            <span>Build the graph</span>
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>

      <div className="pt-1">
        <div className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          Try one of these
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo.label}
              type="button"
              onClick={() => handleSelectExample(repo.url, repo.branch)}
              disabled={isLoading}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {repo.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
