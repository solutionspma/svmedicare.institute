"use client";

import type { ChecklistItemState } from "@/types/compliance";

const dot = (s: ChecklistItemState["status"]) => {
  if (s === "completed") return "bg-emerald-500/80";
  if (s === "violation") return "bg-red-500/80";
  if (s === "missed") return "bg-amber-500/75";
  return "bg-[var(--text-muted)]/30";
};

export function ComplianceChecklist({ items }: { items: ChecklistItemState[] }) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Compliance checkpoints
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-2 text-xs text-[var(--text-primary)]/88">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot(it.status)}`} />
            <span>
              <span className="font-medium uppercase tracking-wider text-[10px] text-[var(--text-muted)]">
                {it.status}
              </span>
              <br />
              {it.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
