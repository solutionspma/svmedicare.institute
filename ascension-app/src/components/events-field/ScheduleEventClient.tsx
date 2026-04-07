"use client";

import { useState } from "react";
import { EVENT_TYPE_OPTIONS } from "@/lib/eventsField/eventTypeLabels";
import { submitScheduleRequest } from "@/services/eventScheduleRequestsStore";

const INITIAL = {
  name: "",
  eventType: "community",
  location: "",
  dateTime: "",
  notes: "",
};

export function ScheduleEventClient() {
  const [form, setForm] = useState(INITIAL);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.dateTime) return;
    const rec = submitScheduleRequest({
      name: form.name.trim(),
      eventType: form.eventType,
      location: form.location.trim(),
      dateTime: form.dateTime,
      notes: form.notes.trim(),
    });
    setSubmittedId(rec.id);
    setForm(INITIAL);
  };

  return (
    <div className="mx-auto max-w-xl">
      {submittedId ? (
        <div
          className="mb-8 rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100/95"
          role="status"
        >
          <p className="font-medium">Request received — pending approval</p>
          <p className="mt-2 text-emerald-200/85">
            Reference <span className="font-mono text-xs">{submittedId}</span>. Your request is stored on this device for
            supervisor review (demo workflow).
          </p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]/45"
            placeholder="Agent or team lead"
          />
        </label>

        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Event type
          <select
            value={form.eventType}
            onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
            className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-accent)]/45"
          >
            {EVENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Location
          <input
            required
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-accent)]/45"
            placeholder="Venue, city, or virtual"
          />
        </label>

        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Date &amp; time
          <input
            required
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
            className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-accent)]/45"
          />
        </label>

        <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Notes
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={4}
            className="mt-1 w-full resize-y rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold-accent)]/45"
            placeholder="Audience, staffing, carrier involvement…"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-sm bg-[var(--gold-accent)]/90 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-95 sm:w-auto sm:px-10"
        >
          Submit request
        </button>
      </form>
    </div>
  );
}
