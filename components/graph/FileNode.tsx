"use client";

// ---------------------------------------------------------------------------
// CodeMap – Custom React Flow Node: FileNode / FolderNode
// ---------------------------------------------------------------------------

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { LuFolder } from "react-icons/lu";
import { getFolderTheme } from "./graphHighlight";

export type FileNodeData = {
  label: string;
  fullPath: string;
  folder: string;
  lines: number;
  importsCount: number;
  importedByCount: number;
  isFolder?: boolean;
  itemCount?: number;
  isSelected?: boolean;
  isImpacted?: boolean;
  isInCycle?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  [key: string]: unknown;
};

export const FileNode = memo(function FileNode({
  data,
  selected,
}: NodeProps & { data: FileNodeData }) {
  const {
    label,
    fullPath,
    folder,
    lines,
    importsCount,
    importedByCount,
    isFolder,
    itemCount,
    isImpacted,
    isInCycle,
    isHighlighted,
    isDimmed,
  } = data;

  const theme = getFolderTheme(folder);
  const isSelfSelected = selected || data.isSelected;

  // Determine role in the dependency tree
  const isRoot = !isFolder && importedByCount === 0 && importsCount > 0;
  const isLeaf = !isFolder && importsCount === 0 && importedByCount > 0;
  const isOrphan = !isFolder && importsCount === 0 && importedByCount === 0;

  // Border & ring styling for the active state
  let borderStyle = theme.border;
  let ringStyle = "";

  if (isInCycle) {
    borderStyle = "border-danger";
    ringStyle = "ring-2 ring-danger/20";
  } else if (isImpacted) {
    borderStyle = "border-warning";
    ringStyle = "ring-2 ring-warning/20";
  } else if (isSelfSelected) {
    borderStyle = "border-accent";
    ringStyle = "ring-2 ring-accent/20";
  } else if (isHighlighted) {
    borderStyle = "border-accent/70";
    ringStyle = "ring-1 ring-accent/10";
  }

  // Folder Node Card (for File System Tree View)
  if (isFolder) {
    return (
      <div
        className={`relative min-w-[190px] max-w-[260px] cursor-pointer select-none rounded-lg border px-3 py-2.5 shadow-[0_1px_2px_rgba(20,22,26,0.05)] transition-all duration-150 ${theme.bg} ${borderStyle} ${ringStyle} ${
          isDimmed ? "opacity-30" : "opacity-100"
        }`}
        title={`Directory: ${fullPath}`}
      >
        <Handle
          type="target"
          id="target-top"
          position={Position.Top}
        />
        <Handle
          type="target"
          id="target-left"
          position={Position.Left}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <LuFolder className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} aria-hidden />
            <span
              className={`truncate font-mono text-[11px] font-semibold ${theme.text}`}
            >
              {label}
            </span>
          </div>
          {typeof itemCount === "number" && (
            <span
              className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] ${theme.badge}`}
            >
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <Handle
          type="source"
          id="source-bottom"
          position={Position.Bottom}
        />
        <Handle
          type="source"
          id="source-right"
          position={Position.Right}
        />
      </div>
    );
  }

  // File Node Card (for Dependency & File System Tree Views)
  return (
    <div
      className={`relative min-w-[185px] max-w-[245px] cursor-pointer select-none rounded-lg border px-3 py-2.5 shadow-[0_1px_2px_rgba(20,22,26,0.05)] transition-all duration-150 hover:shadow-[0_4px_14px_-6px_rgba(20,22,26,0.18)] ${
        theme.bg
      } ${borderStyle} ${ringStyle} ${
        isDimmed ? "opacity-30" : "opacity-100"
      }`}
      title={fullPath}
    >
      {/* Handles for Top-to-Bottom (TB) and Left-to-Right (LR) tree flow */}
      <Handle
        type="target"
        id="target-top"
        position={Position.Top}
      />
      <Handle
        type="target"
        id="target-left"
        position={Position.Left}
      />

      {/* Header: Folder badge + tree role */}
      <div className="mb-1.5 flex items-center justify-between gap-1.5 font-mono text-[10px]">
        <span
          className={`max-w-[100px] truncate rounded border px-1.5 py-0.5 font-medium ${theme.badge}`}
        >
          {folder}
        </span>

        {isRoot && (
          <span className="rounded border border-accent/25 bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-accent">
            root
          </span>
        )}
        {isLeaf && (
          <span className="rounded border border-success-line bg-success-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-success">
            leaf
          </span>
        )}
        {isOrphan && (
          <span className="rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-faint">
            isolated
          </span>
        )}
        {!isRoot && !isLeaf && !isOrphan && (
          <span className="text-faint">{lines} lines</span>
        )}
      </div>

      {/* Node label: file name */}
      <div className="truncate font-mono text-[12px] font-semibold tracking-tight text-ink">
        {label}
      </div>

      {/* Footer: connection counts */}
      <div className="mt-1.5 flex items-center justify-between border-t border-line/80 pt-1 font-mono text-[9px] text-faint">
        <span title="Imports count (dependencies)">
          ↓ <span className="font-medium text-ink">{importsCount}</span>
        </span>
        <span>{lines}L</span>
        <span title="Imported by count (dependents)">
          ↑ <span className="font-medium text-ink">{importedByCount}</span>
        </span>
      </div>

      {/* Outgoing handles */}
      <Handle
        type="source"
        id="source-bottom"
        position={Position.Bottom}
      />
      <Handle
        type="source"
        id="source-right"
        position={Position.Right}
      />
    </div>
  );
});
