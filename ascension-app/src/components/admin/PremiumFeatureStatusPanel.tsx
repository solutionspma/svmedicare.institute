"use client";

import { FEATURES } from "@/config/features";

export function PremiumFeatureStatusPanel() {
  const rows: { k: string; on: boolean }[] = [
    { k: "AI_LIVE_CALL", on: FEATURES.AI_LIVE_CALL },
    { k: "AI_CALL_MODE (legacy alias)", on: FEATURES.AI_CALL_MODE },
    { k: "TELNYX_TRAINING", on: FEATURES.TELNYX_TRAINING },
    { k: "COMPLIANCE_REPORTS", on: FEATURES.COMPLIANCE_REPORTS },
    { k: "COMPLY_TRACK (static training)", on: FEATURES.COMPLY_TRACK },
  ];
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Feature activation
      </p>
      <ul className="mt-3 space-y-2 font-mono text-[11px]">
        {rows.map((r) => (
          <li key={r.k} className="flex justify-between gap-2 text-[var(--text-primary)]/88">
            <span>{r.k}</span>
            <span className={r.on ? "text-emerald-400/90" : "text-amber-400/85"}>{r.on ? "ON" : "OFF"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
