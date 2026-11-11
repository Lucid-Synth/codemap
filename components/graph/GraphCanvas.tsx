"use client";

// ---------------------------------------------------------------------------
// CodeMap – Main React Flow Canvas (Hierarchical Tree Views)
// ---------------------------------------------------------------------------

import React, { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  type NodeMouseHandler,
  type Node,
  type Edge,
} from "@xyflow/react";
import { LuMoveDown, LuMoveRight, LuScan } from "react-icons/lu";

import { useAnalysisStore } from "@/store/useAnalysisStore";
import { FileNode, type FileNodeData } from "./FileNode";
import {
  computeDagreLayout,
  computeFileSystemTree,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "./useGraphLayout";
import { getConnectedElements } from "./graphHighlight";

const nodeTypes = {
  fileNode: FileNode,
};

const EDGE_DEFAULT = "#b6b7ae";
const EDGE_HIGHLIGHT = "#bf4220";
const EDGE_CYCLE = "#b23a22";
const EDGE_TREE = "#b9bab1";

const CONTROL_BUTTON =
  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30";

function FlowInner() {
  const {
    result,
    selectedNodeId,
    selectNode,
    impactedNodes,
    highlightedNodes,
    highlightedEdges,
    cycleHighlightNodes,
    cycleHighlightEdges,
    treeViewMode,
    treeOrientation,
    setTreeViewMode,
    setTreeOrientation,
    setHighlight,
    clearHighlight,
  } = useAnalysisStore();

  const { fitView } = useReactFlow();

  // 1. Dependency Tree: Compute centered Dagre positions with isolated orphans separated
  const depPositions = useMemo(() => {
    if (!result || result.nodes.length === 0) {
      return new Map<string, { x: number; y: number }>();
    }
    return computeDagreLayout(result.nodes, result.edges, treeOrientation);
  }, [result, treeOrientation]);

  // 2. File System Tree: Compute folder hierarchy tree
  const fileSystemData = useMemo(() => {
    if (!result || result.nodes.length === 0) {
      return { nodes: [] as Node<FileNodeData>[], edges: [] as Edge[] };
    }
    return computeFileSystemTree(result.nodes, result.repo.name, treeOrientation);
  }, [result, treeOrientation]);

  // 3. Determine final Nodes array based on active view mode
  const nodes: Node<FileNodeData>[] = useMemo(() => {
    if (!result || result.nodes.length === 0) return [];

    // A. File System Tree Mode
    if (treeViewMode === "filesystem") {
      return fileSystemData.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedNodeId === node.id,
        },
      }));
    }

    // B. Dependency Tree Mode
    const hasActiveSelection =
      Boolean(selectedNodeId) ||
      highlightedNodes.size > 0 ||
      cycleHighlightNodes.size > 0;

    return result.nodes.map((node) => {
      const pos = depPositions.get(node.id) || { x: 0, y: 0 };
      const isSelected = selectedNodeId === node.id;
      const isImpacted = impactedNodes.has(node.id);
      const isInCycle = cycleHighlightNodes.has(node.id);
      const isHighlighted = highlightedNodes.has(node.id);

      const isDimmed =
        hasActiveSelection &&
        !isSelected &&
        !isImpacted &&
        !isInCycle &&
        !isHighlighted;

      const label = node.id.split("/").pop() || node.id;

      return {
        id: node.id,
        type: "fileNode",
        position: pos,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        data: {
          label,
          fullPath: node.id,
          folder: node.folder,
          lines: node.lines,
          importsCount: node.imports.length,
          importedByCount: node.importedBy.length,
          isSelected,
          isImpacted,
          isInCycle,
          isHighlighted,
          isDimmed,
        },
      };
    });
  }, [
    result,
    treeViewMode,
    fileSystemData.nodes,
    depPositions,
    selectedNodeId,
    impactedNodes,
    cycleHighlightNodes,
    highlightedNodes,
  ]);

  // 4. Determine final Edges array with tree arrowheads
  const edges: Edge[] = useMemo(() => {
    if (!result) return [];

    // A. File System Tree Mode Edges
    if (treeViewMode === "filesystem") {
      return fileSystemData.edges.map((edge) => ({
        ...edge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: EDGE_TREE,
        },
      }));
    }

    // B. Dependency Tree Mode Edges
    if (result.edges.length === 0) return [];

    const hasActiveSelection =
      Boolean(selectedNodeId) ||
      highlightedNodes.size > 0 ||
      cycleHighlightNodes.size > 0;

    const sourceHandleId =
      treeOrientation === "TB" ? "source-bottom" : "source-right";
    const targetHandleId =
      treeOrientation === "TB" ? "target-top" : "target-left";

    return result.edges.map((edge) => {
      const edgeId = `${edge.source}->${edge.target}`;
      const isCycleEdge = cycleHighlightEdges.has(edgeId);
      const isHighlighted = highlightedEdges.has(edgeId);
      const isSourceSelected = selectedNodeId === edge.source;
      const isTargetSelected = selectedNodeId === edge.target;

      let stroke = EDGE_DEFAULT;
      let strokeWidth = 1.4;
      let animated = false;
      let opacity = 0.6;

      if (isCycleEdge) {
        stroke = EDGE_CYCLE;
        strokeWidth = 2.4;
        animated = true;
        opacity = 1;
      } else if (isHighlighted || isSourceSelected || isTargetSelected) {
        stroke = EDGE_HIGHLIGHT;
        strokeWidth = 2.1;
        animated = true;
        opacity = 1;
      } else if (hasActiveSelection) {
        opacity = 0.12;
      }

      return {
        id: edgeId,
        source: edge.source,
        target: edge.target,
        sourceHandle: sourceHandleId,
        targetHandle: targetHandleId,
        type: "smoothstep",
        animated,
        style: {
          stroke,
          strokeWidth,
          opacity,
          transition: "all 0.2s ease",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: stroke,
        },
      };
    });
  }, [
    result,
    treeViewMode,
    treeOrientation,
    fileSystemData.edges,
    selectedNodeId,
    cycleHighlightEdges,
    highlightedEdges,
    highlightedNodes.size,
    cycleHighlightNodes.size,
  ]);

  // 5. Automatically fit view on repository load, mode switch, or orientation switch
  useEffect(() => {
    if (nodes.length > 0) {
      const timeout = setTimeout(() => {
        fitView({ padding: 0.18, duration: 400 });
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [result, treeViewMode, treeOrientation, fitView, nodes.length]);

  // Click & hover interactions
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.data.isFolder) {
        return;
      }
      selectNode(node.id === selectedNodeId ? null : node.id);
    },
    [selectNode, selectedNodeId],
  );

  const handleNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => {
      if (!result || treeViewMode === "filesystem") return;
      const { nodeIds, edgeIds } = getConnectedElements(node.id, result.nodes);
      setHighlight(nodeIds, edgeIds);
    },
    [result, treeViewMode, setHighlight],
  );

  const handleNodeMouseLeave = useCallback(() => {
    clearHighlight();
  }, [clearHighlight]);

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    clearHighlight();
  }, [selectNode, clearHighlight]);

  return (
    <div className="relative h-full w-full bg-background">
      {/* Floating tree controls */}
      <div className="absolute bottom-3 left-1/2 z-20 flex w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-xl border border-line bg-surface/90 p-1 shadow-[0_1px_2px_rgba(20,22,26,0.04),0_16px_32px_-24px_rgba(20,22,26,0.35)] backdrop-blur-md sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0 sm:justify-start">
        {/* View mode: dependency tree vs directory tree */}
        <div className="flex rounded-lg border border-line bg-surface-2/70 p-0.5">
          <button
            type="button"
            onClick={() => setTreeViewMode("dependency")}
            aria-pressed={treeViewMode === "dependency"}
            className={`${CONTROL_BUTTON} ${
              treeViewMode === "dependency"
                ? "bg-ink text-background shadow-sm"
                : "text-muted hover:bg-surface hover:text-ink"
            }`}
          >
            Dependencies
          </button>
          <button
            type="button"
            onClick={() => setTreeViewMode("filesystem")}
            aria-pressed={treeViewMode === "filesystem"}
            className={`${CONTROL_BUTTON} ${
              treeViewMode === "filesystem"
                ? "bg-ink text-background shadow-sm"
                : "text-muted hover:bg-surface hover:text-ink"
            }`}
          >
            Directories
          </button>
        </div>

        {/* Orientation: top-down vs left-right */}
        <div className="flex rounded-lg border border-line bg-surface-2/70 p-0.5">
          <button
            type="button"
            onClick={() => setTreeOrientation("TB")}
            aria-pressed={treeOrientation === "TB"}
            className={`${CONTROL_BUTTON} flex items-center gap-1 ${
              treeOrientation === "TB"
                ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                : "text-muted hover:text-ink"
            }`}
            title="Top-to-bottom hierarchy"
          >
            <LuMoveDown className="h-3 w-3" aria-hidden />
            <span className="hidden sm:inline">Top-down</span>
          </button>
          <button
            type="button"
            onClick={() => setTreeOrientation("LR")}
            aria-pressed={treeOrientation === "LR"}
            className={`${CONTROL_BUTTON} flex items-center gap-1 ${
              treeOrientation === "LR"
                ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                : "text-muted hover:text-ink"
            }`}
            title="Left-to-right dendrogram"
          >
            <LuMoveRight className="h-3 w-3" aria-hidden />
            <span className="hidden sm:inline">Left-right</span>
          </button>
        </div>

        {/* Fit view */}
        <button
          type="button"
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
          className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          title="Recenter and fit view"
        >
          <LuScan className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Fit</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        minZoom={0.03}
        maxZoom={2.5}
        defaultEdgeOptions={{ type: "smoothstep" }}
        nodesDraggable={false}
        className="codemap-flow"
      >
        <Background color="#deded7" gap={22} size={1.2} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor="#b6b7ae"
          maskColor="rgba(20, 22, 26, 0.05)"
          className="hidden md:block"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
