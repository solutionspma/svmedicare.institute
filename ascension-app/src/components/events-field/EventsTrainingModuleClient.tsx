"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  complianceForType,
  eventTrainingHubData,
} from "@/lib/eventsField/eventTrainingHub";
import { eventTypeLabel } from "@/lib/eventsField/eventTypeLabels";

export function EventsTrainingModuleClient() {
  const [selectedTypeId, setSelectedTypeId] = useState(
    () => eventTrainingHubData.eventTypes[0]?.id ?? "community"
  );
  const [completedTypes, setCompletedTypes] = useState<string[]>([]);

  const block = useMemo(() => complianceForType(selectedTypeId), [selectedTypeId]);
  const scenarios = useMemo(
    () =>
      eventTrainingHubData.scenarios.filter((s) => s.eventTypeId === selectedTypeId),
    [selectedTypeId]
  );

  const pct = Math.round((completedTypes.length / eventTrainingHubData.eventTypes.length) * 100);

  const markTypeComplete = () => {
    if (!completedTypes.includes(selectedTypeId)) {
      setCompletedTypes([...completedTypes, selectedTypeId]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      {/* Top Navigation Header */}
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)] transition-opacity hover:opacity-90"
              >
                ← Home
              </Link>
              <span className="text-[var(--border-gold)]/40">|</span>
              <Link
                href="/dashboard"
                className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
              >
                Command deck
              </Link>
            </div>
            <nav className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider">
              <Link
                href="/training/comply-track"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                ComplyTrack
              </Link>
              <Link
                href="/training/lis"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                LIS / Extra Help
              </Link>
              <Link
                href="/events-training"
                className="text-[var(--gold-accent)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Events &amp; Field
              </Link>
            </nav>
          </div>
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              CMS-Regulated Marketing Training
            </p>
            <h1 className="mt-1 font-display text-2xl uppercase tracking-[0.06em] sm:text-3xl">
              Events &amp; Field Compliance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Reference materials, scenario prompts, and field checklists for CMS-regulated marketing settings.
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full bg-gradient-to-b from-[var(--bg-primary)] to-[#0a1628] px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-auto lg:px-6">
          <div className="mb-6 flex items-center gap-3 lg:mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#1c63b7] to-[#d99b20] font-display text-sm font-black text-white">
              EF
            </div>
            <div>
              <p className="font-display font-bold text-white">SV Medicare Institute</p>
              <p className="text-xs text-[#b9c7dc]">Events &amp; Field Training</p>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/12 bg-white/8 p-3.5 lg:mb-8">
            <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-gradient-to-r from-[#d99b20] to-[#fff0a6] transition-all duration-250"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2.5 text-[10px] leading-relaxed text-[#d7e5fb]">
              {pct}% complete • {completedTypes.length}/{eventTrainingHubData.eventTypes.length} event types reviewed
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {eventTrainingHubData.eventTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTypeId(t.id)}
                className={`text-left rounded-2xl px-3 py-3 transition-colors ${
                  t.id === selectedTypeId ? "bg-white/16" : "bg-white/6 hover:bg-white/12"
                } ${completedTypes.includes(t.id) ? "border border-[var(--success)]/40" : ""}`}
              >
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white/38 text-[10px] font-bold text-white/90">
                    {completedTypes.includes(t.id) ? "✓" : "•"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#dbe7f7]">
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[#b8c8dc]">{t.summary}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:py-10">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Event Type Overview */}
            <section className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
              <h2 className="font-display text-2xl font-black">
                {eventTrainingHubData.eventTypes.find((t) => t.id === selectedTypeId)?.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {eventTrainingHubData.eventTypes.find((t) => t.id === selectedTypeId)?.summary}
              </p>
            </section>

            {/* Compliance Rules */}
            <section className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
              <h3 className="font-display text-xl font-black">Compliance Rules</h3>
              {block ? (
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <RuleList title="Allowed actions" items={block.allowed} variant="allowed" />
                  <RuleList title="Prohibited actions" items={block.prohibited} variant="prohibited" />
                  <RuleList title="Required disclaimers" items={block.disclaimers} variant="neutral" />
                  <RuleList title="SOA rules" items={block.soaRules} variant="neutral" />
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--text-muted)]">No rules loaded for this type.</p>
              )}
            </section>

            {/* Scenario Training */}
            <section className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
              <h3 className="font-display text-xl font-black">Scenario Training</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Read each scenario and follow the instructions—structured practice only, no automation.
              </p>
              <ul className="mt-6 space-y-4">
                {scenarios.length ? (
                  scenarios.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-lg border border-[var(--border-gold)]/30 bg-black/30 p-4"
                    >
                      <p className="font-medium text-[var(--text-primary)]">{s.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {s.instructions}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--text-muted)]">
                    No scenarios for this event type in the current pack.
                  </li>
                )}
              </ul>
            </section>

            {/* Event Checklist */}
            <section className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
              <h3 className="font-display text-xl font-black">Event Checklist</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ChecklistColumn title="Before" items={eventTrainingHubData.checklist.before} />
                <ChecklistColumn title="During" items={eventTrainingHubData.checklist.during} />
                <ChecklistColumn title="After" items={eventTrainingHubData.checklist.after} />
              </div>
            </section>

            {/* Mark Complete Button */}
            <div className="flex gap-3">
              <button
                onClick={markTypeComplete}
                className="rounded-lg bg-[var(--success)] px-6 py-2 font-display text-sm font-black uppercase text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                {completedTypes.includes(selectedTypeId) ? "✓ Type Reviewed" : "Mark As Reviewed"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function RuleList({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "allowed" | "prohibited" | "neutral";
}) {
  const labelTint =
    variant === "allowed"
      ? "text-[var(--success)]"
      : variant === "prohibited"
        ? "text-[var(--danger)]"
        : "text-[var(--accent-primary)]";

  const shellClass =
    variant === "allowed"
      ? "rounded-lg border border-[var(--success)]/40 bg-[var(--success-bg)]"
      : variant === "prohibited"
        ? "rounded-lg border border-[var(--danger)]/40 bg-[var(--danger-bg)]"
        : "rounded-lg border border-[var(--border-subtle)] bg-black/20";

  return (
    <div className={shellClass + " p-4"}>
      <h4 className={`font-display text-[10px] uppercase tracking-[0.2em] ${labelTint}`}>{title}</h4>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--text-secondary)]">
        {items.map((x, i) => (
          <li key={i} className="leading-relaxed">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-black/20 p-4">
      <h4 className="font-display text-xs uppercase tracking-[0.18em] text-[var(--text-primary)]">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2 leading-relaxed">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded border border-[var(--border-gold)]/50 bg-black/30" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
