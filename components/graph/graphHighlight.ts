import type { GraphNode } from "@/types/graph";

export function getConnectedElements(
  nodeId: string,
  nodes: GraphNode[],
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  const targetNode = nodes.find((n) => n.id === nodeId);
  if (!targetNode) return { nodeIds, edgeIds };

  nodeIds.add(nodeId);

  // Files this node imports: edge is nodeId -> imp
  for (const imp of targetNode.imports) {
    nodeIds.add(imp);
    edgeIds.add(`${nodeId}->${imp}`);
  }

  // Files that import this node: edge is dep -> nodeId
  for (const dep of targetNode.importedBy) {
    nodeIds.add(dep);
    edgeIds.add(`${dep}->${nodeId}`);
  }

  return { nodeIds, edgeIds };
}

export const FOLDER_COLORS: Record<
  string,
  { bg: string; border: string; text: string; badge: string }
> = {
  src: {
    bg: "bg-[#f2f7f3]",
    border: "border-[#c8d9cc]",
    text: "text-[#3c6247]",
    badge: "bg-[#e3eee5] text-[#3c6247] border-[#c8d9cc]",
  },
  app: {
    bg: "bg-[#f1f6fa]",
    border: "border-[#c9dbe6]",
    text: "text-[#3e6075]",
    badge: "bg-[#e2eef5] text-[#3e6075] border-[#c9dbe6]",
  },
  lib: {
    bg: "bg-[#faf6ec]",
    border: "border-[#e4d6b8]",
    text: "text-[#755823]",
    badge: "bg-[#f3e9d2] text-[#755823] border-[#e4d6b8]",
  },
  components: {
    bg: "bg-[#f8f4f8]",
    border: "border-[#ded1e1]",
    text: "text-[#654a6c]",
    badge: "bg-[#efe7f2] text-[#654a6c] border-[#ded1e1]",
  },
  utils: {
    bg: "bg-[#eff6f5]",
    border: "border-[#c6dad6]",
    text: "text-[#33625c]",
    badge: "bg-[#e1efec] text-[#33625c] border-[#c6dad6]",
  },
  hooks: {
    bg: "bg-[#fbf3f3]",
    border: "border-[#e7d0d0]",
    text: "text-[#804343]",
    badge: "bg-[#f5e5e5] text-[#804343] border-[#e7d0d0]",
  },
  pages: {
    bg: "bg-[#f4f5fb]",
    border: "border-[#d7d9ea]",
    text: "text-[#50547a]",
    badge: "bg-[#e9eaf5] text-[#50547a] border-[#d7d9ea]",
  },
  routes: {
    bg: "bg-[#fbf4ea]",
    border: "border-[#ead6bd]",
    text: "text-[#7c5528]",
    badge: "bg-[#f5e9d7] text-[#7c5528] border-[#ead6bd]",
  },
  models: {
    bg: "bg-[#f7f3f9]",
    border: "border-[#dfd2e5]",
    text: "text-[#5f4a6d]",
    badge: "bg-[#efe7f3] text-[#5f4a6d] border-[#dfd2e5]",
  },
  controllers: {
    bg: "bg-[#fbf3ed]",
    border: "border-[#e8d4c4]",
    text: "text-[#7b4e30]",
    badge: "bg-[#f5e7db] text-[#7b4e30] border-[#e8d4c4]",
  },
  services: {
    bg: "bg-[#f1f6f8]",
    border: "border-[#cbdbe2]",
    text: "text-[#3d5f6b]",
    badge: "bg-[#e3eef2] text-[#3d5f6b] border-[#cbdbe2]",
  },
  test: {
    bg: "bg-[#f5f5f1]",
    border: "border-[#dcdcd2]",
    text: "text-[#5c5e54]",
    badge: "bg-[#ebebe4] text-[#5c5e54] border-[#dcdcd2]",
  },
  tests: {
    bg: "bg-[#f5f5f1]",
    border: "border-[#dcdcd2]",
    text: "text-[#5c5e54]",
    badge: "bg-[#ebebe4] text-[#5c5e54] border-[#dcdcd2]",
  },
  "(root)": {
    bg: "bg-[#f4f4ef]",
    border: "border-[#d6d6cc]",
    text: "text-[#4d5048]",
    badge: "bg-[#e9e9e2] text-[#4d5048] border-[#d6d6cc]",
  },
};

const DEFAULT_COLOR = {
  bg: "bg-surface-2",
  border: "border-line-strong",
  text: "text-muted",
  badge: "bg-surface-3 text-muted border-line-strong",
};

export function getFolderTheme(folder: string) {
  const key = folder.toLowerCase();
  return FOLDER_COLORS[key] || DEFAULT_COLOR;
}
