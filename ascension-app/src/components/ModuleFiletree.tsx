"use client";

import { motion } from "framer-motion";
import type { ContentNode } from "@/data/module-content";
import { isNodeComplete } from "@/lib/module-utils";

type ItemProps = {
  node: ContentNode;
  depth: number;
  activeId: string | null;
  completedIds: Set<string>;
  showAllComplete: boolean;
  onSelect: (id: string) => void;
};

function FiletreeItem({ node, depth, activeId, completedIds, showAllComplete, onSelect }: ItemProps) {
  const isActive = activeId === node.id;
  const isCompleted = showAllComplete || completedIds.has(node.id) || isNodeComplete(node, completedIds);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <button
        onClick={() => onSelect(node.id)}
        className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
          isActive
            ? "bg-[var(--gold-accent)]/20 text-[var(--gold-accent)]"
            : "text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--text-primary)]"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <span className="text-[10px] opacity-70">{isActive ? "▾" : "▸"}</span>
        ) : (
          <span className="w-3" />
        )}
        {isCompleted && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-green-400"
          >
            ✓
          </motion.span>
        )}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren &&
        node.children!.map((child) => (
          <FiletreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            activeId={activeId}
            completedIds={completedIds}
            showAllComplete={showAllComplete}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

type Props = {
  nodes: ContentNode[];
  activeId: string | null;
  completedIds: Set<string>;
  /** When true, show all topics as complete — e.g. after passing mini exam */
  showAllComplete?: boolean;
  onSelect: (id: string) => void;
};

export function ModuleFiletree({ nodes, activeId, completedIds, showAllComplete = false, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {nodes.map((node) => (
        <FiletreeItem
          key={node.id}
          node={node}
          depth={0}
          activeId={activeId}
          completedIds={completedIds}
          showAllComplete={showAllComplete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
