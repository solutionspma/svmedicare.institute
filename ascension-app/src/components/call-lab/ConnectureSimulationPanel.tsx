"use client";

import { useMemo, useState } from "react";
import type { ChecklistItemState } from "@/types/compliance";

type Props = {
  checklist: ChecklistItemState[];
};

export function ConnectureSimulationPanel({ checklist }: Props) {
  const unlocked = useMemo(() => {
    const need = ["zip_collected", "recording_consent", "multi_plan_disclaimer", "scope_appointment"] as const;
    return need.every((id) => checklist.find((c) => c.id === id)?.status === "completed");
  }, [checklist]);

  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [callDate, setCallDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [recConsent, setRecConsent] = useState("");
  const [scopeMa, setScopeMa] = useState(false);
  const [scopeMedigap, setScopeMedigap] = useState(false);
  const [scopePd, setScopePd] = useState(false);
  const [scopeDvh, setScopeDvh] = useState(false);
  const [scopeInd, setScopeInd] = useState(false);
  const [prefs, setPrefs] = useState("");
  const [providers, setProviders] = useState("");
  const [rx, setRx] = useState("");
  const [lis, setLis] = useState("");
  const [medicaid, setMedicaid] = useState("");
  const [health, setHealth] = useState("");

  return (
    <div className="relative rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/40 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Enrollment workspace (simulation)
      </p>
      <p className="mt-1 text-[10px] text-[var(--text-muted)]">
        Generic fields for training — not a replica of any vendor product.
      </p>

      <div className="mt-4 grid gap-3 text-xs">
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Beneficiary name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">ZIP</span>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Date of call</span>
          <input
            type="date"
            value={callDate}
            onChange={(e) => setCallDate(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Recording consent note</span>
          <input
            value={recConsent}
            onChange={(e) => setRecConsent(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>

        <fieldset className="space-y-2 rounded-sm border border-[var(--border-gold)]/25 p-2">
          <legend className="px-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Scope categories discussed
          </legend>
          {(
            [
              ["Medicare Advantage / Part C", scopeMa, setScopeMa],
              ["Medigap / Supplement", scopeMedigap, setScopeMedigap],
              ["Part D", scopePd, setScopePd],
              ["Dental / Vision / Hearing", scopeDvh, setScopeDvh],
              ["Hospital indemnity", scopeInd, setScopeInd],
            ] as const
          ).map(([label, val, set]) => (
            <label key={label} className="flex items-center gap-2 text-[var(--text-primary)]/90">
              <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="accent-[var(--gold-accent)]" />
              {label}
            </label>
          ))}
        </fieldset>

        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Preferences</span>
          <textarea
            value={prefs}
            onChange={(e) => setPrefs(e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Provider info</span>
          <textarea
            value={providers}
            onChange={(e) => setProviders(e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Prescriptions</span>
          <textarea
            value={rx}
            onChange={(e) => setRx(e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">LIS / subsidy</span>
          <input
            value={lis}
            onChange={(e) => setLis(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Medicaid</span>
          <input
            value={medicaid}
            onChange={(e) => setMedicaid(e.target.value)}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Health considerations</span>
          <textarea
            value={health}
            onChange={(e) => setHealth(e.target.value)}
            rows={2}
            className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/40 px-2 py-1.5 text-[var(--text-primary)]"
          />
        </label>
      </div>

      <div
        className={`relative mt-4 rounded-sm border border-dashed p-4 ${
          unlocked ? "border-emerald-800/40 bg-emerald-950/10" : "border-amber-800/45 bg-amber-950/15"
        }`}
      >
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Plan comparison workspace
        </p>
        {!unlocked ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-sm bg-black/70 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-400/95">Locked</p>
            <p className="mt-2 max-w-xs text-[11px] text-[var(--text-muted)]">
              Complete ZIP, recording consent, multi-plan disclaimer, and scope of appointment on the call before
              plan comparison.
            </p>
          </div>
        ) : null}
        <p className={`mt-2 text-xs text-[var(--text-muted)] ${!unlocked ? "blur-[2px]" : ""}`}>
          Simulated plan grid / quoting — training placeholder only.
        </p>
      </div>
    </div>
  );
}
