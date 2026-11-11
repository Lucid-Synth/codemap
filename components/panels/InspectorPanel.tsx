"use client";

import React from "react";
import {
  LuArrowDown,
  LuArrowRight,
  LuArrowUp,
  LuExternalLink,
  LuRadar,
  LuX,
} from "react-icons/lu";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { getFolderTheme } from "../graph/graphHighlight";

export function InspectorPanel() {
  const {
    selectedNodeId,
    selectNode,
    result,
    showImpact,
    toggleImpact,
    impactedNodes,
  } = useAnalysisStore();

  if (!selectedNodeId || !result) return null;

  const node = result.nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const fileName = node.id.split("/").pop() || node.id;
  const theme = getFolderTheme(node.folder);
  const githubUrl = `https://github.com/${result.repo.owner}/${result.repo.name}/blob/${result.repo.branch}/${node.id}`;

  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex h-full w-full max-w-sm shrink-0 flex-col border-l border-line bg-surface shadow-[-24px_0_48px_-32px_rgba(20,22,26,0.45)] md:static md:z-20 md:w-96 md:max-w-none md:shadow-none">
      <div className="flex items-start justify-between gap-3 border-b border-line p-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium ${theme.badge}`}
            >
              {node.folder}
            </span>
            <span className="font-mono text-[11px] text-faint">
              {node.lines} lines
            </span>
          </div>
          <h2
            className="truncate font-mono text-[13px] font-semibold text-ink"
            title={node.id}
          >
            {fileName}
          </h2>
          <p
            className="mt-0.5 truncate font-mono text-[11px] text-faint"
            title={node.id}
          >
            {node.id}
          </p>
        </div>

        <button
          type="button"
          onClick={() => selectNode(null)}
          className="rounded-md p-1 text-faint transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          title="Close inspector"
          aria-label="Close inspector"
        >
          <LuX className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 p-3">
        <button
          type="button"
          onClick={toggleImpact}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
            showImpact
              ? "border-warning-line bg-warning-soft text-warning"
              : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink"
          }`}
          title="Highlight every direct and transitive dependent of this file"
        >
          <LuRadar className="h-3.5 w-3.5" aria-hidden />
          <span>{showImpact ? "Hide blast radius" : "Show blast radius"}</span>
          {showImpact && (
            <span className="rounded bg-[#f2e6c9] px-1.5 py-0.5 font-mono text-[10px] font-semibold">
              {impactedNodes.size}
            </span>
          )}
        </button>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          title="View file on GitHub"
        >
          <LuExternalLink className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4 font-mono text-xs">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              <LuArrowDown className="h-3 w-3 text-faint" aria-hidden />
              Imports
            </h3>
            <span className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint">
              {node.imports.length}
            </span>
          </div>

          {node.imports.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line px-3 py-3 text-[11px] italic leading-relaxed text-faint">
              No project imports — this is a leaf module.
            </p>
          ) : (
            <ul className="space-y-1">
              {node.imports.map((imp) => {
                const impName = imp.split("/").pop() || imp;
                return (
                  <li key={imp}>
                    <button
                      type="button"
                      onClick={() => selectNode(imp)}
                      className="group w-full rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-line hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-ink transition-colors group-hover:text-accent">
                          {impName}
                        </span>
                        <span className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100">
                          <LuArrowRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[10px] text-faint">
                        {imp}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              <LuArrowUp className="h-3 w-3 text-faint" aria-hidden />
              Imported by
            </h3>
            <span className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint">
              {node.importedBy.length}
            </span>
          </div>

          {node.importedBy.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line px-3 py-3 text-[11px] italic leading-relaxed text-faint">
              Nothing imports this file — it is an entry point or isolated.
            </p>
          ) : (
            <ul className="space-y-1">
              {node.importedBy.map((dep) => {
                const depName = dep.split("/").pop() || dep;
                return (
                  <li key={dep}>
                    <button
                      type="button"
                      onClick={() => selectNode(dep)}
                      className="group w-full rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-line hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-ink transition-colors group-hover:text-accent">
                          {depName}
                        </span>
                        <span className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100">
                          <LuArrowRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[10px] text-faint">
                        {dep}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {showImpact && impactedNodes.size > 0 && (
          <div className="border-t border-line pt-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-warning">
              <LuRadar className="h-3 w-3" aria-hidden />
              Affected files
              <span className="rounded bg-[#f2e6c9] px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                {impactedNodes.size}
              </span>
            </h3>
            <ul className="space-y-0.5">
              {Array.from(impactedNodes).map((impId) => (
                <li key={impId}>
                  <button
                    type="button"
                    onClick={() => selectNode(impId)}
                    className="w-full truncate rounded px-1.5 py-1 text-left text-[11px] text-muted transition-colors hover:bg-warning-soft hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                    title={impId}
                  >
                    {impId}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
