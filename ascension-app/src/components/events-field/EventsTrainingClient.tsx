"use client";

import { useMemo, useState } from "react";
import {
  complianceForType,
  eventTrainingHubData,
} from "@/lib/eventsField/eventTrainingHub";
import { eventTypeLabel } from "@/lib/eventsField/eventTypeLabels";

export function EventsTrainingClient() {
  const [selectedTypeId, setSelectedTypeId] = useState(
    () => eventTrainingHubData.eventTypes[0]?.id ?? "community"
  );
  const block = useMemo(() => complianceForType(selectedTypeId), [selectedTypeId]);
  const scenarios = useMemo(
    () =>
      eventTrainingHubData.scenarios.filter((s) => s.eventTypeId === selectedTypeId),
    [selectedTypeId]
  );

  return (
    <div className="space-y-14">
      <section aria-labelledby="evt-types-heading">
        <h2 id="evt-types-heading" className="font-display text-sm uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          Event types
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Select a context to view tailored compliance rules and practice scenarios.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {eventTrainingHubData.eventTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTypeId(t.id)}
              className={`event-type w-full text-left text-[var(--text-primary)] ${
                selectedTypeId === t.id ? "active" : ""
              }`}
            >
              <p className="font-display text-[11px] uppercase tracking-[0.15em] text-[var(--accent-primary)]">
                {t.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{t.summary}</p>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="evt-rules-heading">
        <h2 id="evt-rules-heading" className="font-display text-sm uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          Compliance rules · {eventTypeLabel(selectedTypeId)}
        </h2>
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

      <section aria-labelledby="evt-scenarios-heading">
        <h2 id="evt-scenarios-heading" className="font-display text-sm uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          Scenario training
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Read each scenario and follow the instructions—structured practice only, no automation.
        </p>
        <ul className="mt-6 space-y-4">
          {scenarios.length ? (
            scenarios.map((s) => (
              <li
                key={s.id}
                className="rounded-sm border border-[var(--border-gold)]/30 bg-black/25 p-4 sm:p-5"
              >
                <p className="font-medium text-[var(--text-primary)]">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{s.instructions}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-[var(--text-muted)]">No scenarios for this event type in the current pack.</li>
          )}
        </ul>
      </section>

      <section aria-labelledby="evt-checklist-heading">
        <h2 id="evt-checklist-heading" className="font-display text-sm uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          Event checklist
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <ChecklistColumn title="Before" items={eventTrainingHubData.checklist.before} />
          <ChecklistColumn title="During" items={eventTrainingHubData.checklist.during} />
          <ChecklistColumn title="After" items={eventTrainingHubData.checklist.after} />
        </div>
      </section>
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
      ? "allowed-box"
      : variant === "prohibited"
        ? "prohibited-box"
        : "rounded-sm border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-4 backdrop-blur-sm";

  return (
    <div className={shellClass}>
      <h3 className={`font-display text-[10px] uppercase tracking-[0.2em] ${labelTint}`}>{title}</h3>
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
    <div className="card">
      <h3 className="font-display text-xs uppercase tracking-[0.18em] text-[var(--text-primary)]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2 leading-relaxed">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded border border-[var(--border-gold)]/50 bg-black/30" aria-hidden />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
