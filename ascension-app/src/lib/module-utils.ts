import type { ContentNode } from "@/data/module-content";

export function getLeafNodes(nodes: ContentNode[]): ContentNode[] {
  const leaves: ContentNode[] = [];
  function walk(n: ContentNode) {
    if (n.children && n.children.length > 0) {
      n.children.forEach(walk);
    } else {
      leaves.push(n);
    }
  }
  nodes.forEach(walk);
  return leaves;
}

export function getFirstLeaf(node: ContentNode): ContentNode {
  if (!node.children || node.children.length === 0) return node;
  return getFirstLeaf(node.children[0]);
}

export function isNodeComplete(node: ContentNode, completedIds: Set<string>): boolean {
  const leaves = getLeafNodes([node]);
  return leaves.length > 0 && leaves.every((l) => completedIds.has(l.id));
}

export function findNodeById(nodes: ContentNode[], id: string): ContentNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}
