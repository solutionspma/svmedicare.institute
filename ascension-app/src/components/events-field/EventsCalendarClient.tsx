"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTrainingRole } from "@/hooks/useTrainingRole";
import { canAccessAdminComplyTrack } from "@/lib/complyTrackAccess";
import { EVENT_TYPE_OPTIONS, eventTypeLabel } from "@/lib/eventsField/eventTypeLabels";
import {
  addCalendarEvent,
  deleteCalendarEvent,
  loadCalendarEvents,
  type StoredCalendarEvent,
  updateCalendarEvent,
} from "@/services/eventsCalendarStore";

function formatRange(startAt: string, endAt?: string): string {
  try {
    const a = new Date(startAt);
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    if (!endAt) return a.toLocaleString(undefined, opts);
    const b = new Date(endAt);
    return `${a.toLocaleString(undefined, opts)} — ${b.toLocaleString(undefined, opts)}`;
  } catch {
    return startAt;
  }
}

const EMPTY_FORM = {
  title: "",
  eventType: "community",
  location: "",
  startAt: "",
  endAt: "",
  description: "",
};

export function EventsCalendarClient() {
  const { role, mounted } = useTrainingRole();
  const isAdmin = mounted && canAccessAdminComplyTrack(role);

  const [events, setEvents] = useState<StoredCalendarEvent[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [detail, setDetail] = useState<StoredCalendarEvent | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const refresh = useCallback(() => {
    setEvents(loadCalendarEvents());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    let rows = events.filter((e) => {
      try {
        return new Date(e.startAt).getTime() >= now - thirtyDaysMs;
      } catch {
        return true;
      }
    });
    if (filterType !== "all") rows = rows.filter((e) => e.eventType === filterType);
    const loc = filterLocation.trim().toLowerCase();
    if (loc) rows = rows.filter((e) => e.location.toLowerCase().includes(loc));
    return [...rows].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events, filterType, filterLocation]);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setAdminOpen(true);
  };

  const openEdit = (e: StoredCalendarEvent) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      eventType: e.eventType,
      location: e.location,
      startAt: e.startAt.slice(0, 16),
      endAt: e.endAt ? e.endAt.slice(0, 16) : "",
      description: e.description ?? "",
    });
    setAdminOpen(true);
  };

  const saveAdmin = () => {
    if (!form.title.trim() || !form.location.trim() || !form.startAt) return;
    const startAt = new Date(form.startAt).toISOString();
    const endAt = form.endAt ? new Date(form.endAt).toISOString() : undefined;
    if (editingId) {
      setEvents(
        updateCalendarEvent(editingId, {
          title: form.title.trim(),
          eventType: form.eventType,
          location: form.location.trim(),
          startAt,
          endAt,
          description: form.description.trim() || undefined,
        })
      );
    } else {
      setEvents(
        addCalendarEvent({
          title: form.title.trim(),
          eventType: form.eventType,
          location: form.location.trim(),
          startAt,
          endAt,
          description: form.description.trim() || undefined,
        })
      );
    }
    setAdminOpen(false);
    setEditingId(null);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this event from the calendar?")) return;
    setEvents(deleteCalendarEvent(id));
    if (detail?.id === id) setDetail(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            <span className="mb-1 block">Type</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full min-w-[160px] rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]/45 sm:w-auto"
            >
              <option value="all">All types</option>
              {EVENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-[200px] flex-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            <span className="mb-1 block">Location contains</span>
            <input
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              placeholder="City, venue, virtual…"
              className="w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[var(--gold-accent)]/45"
            />
          </label>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={openNew}
            className="rounded-sm bg-[var(--gold-accent)]/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black hover:opacity-95"
          >
            Add event
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-[var(--text-muted)]">
        Showing events from the last 30 days onward (stored in this browser). Managers and admins can add or edit entries.
      </p>

      <ul className="mt-6 space-y-3">
        {filtered.length ? (
          filtered.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setDetail(e)}
                className="w-full rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/50 p-4 text-left transition-colors hover:border-[var(--gold-accent)]/40 sm:p-5"
              >
                <p className="font-display text-[10px] uppercase tracking-[0.15em] text-[var(--gold-accent)]">
                  {eventTypeLabel(e.eventType)}
                </p>
                <p className="mt-1 font-medium text-[var(--text-primary)]">{e.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{e.location}</p>
                <p className="mt-2 font-mono text-xs text-[var(--text-primary)]/80">{formatRange(e.startAt, e.endAt)}</p>
              </button>
            </li>
          ))
        ) : (
          <li className="rounded-sm border border-dashed border-[var(--border-gold)]/35 p-8 text-center text-sm text-[var(--text-muted)]">
            No events match your filters.
          </li>
        )}
      </ul>

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evt-modal-title"
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-[var(--border-gold)]/40 bg-[var(--bg-matte)] p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
                  {eventTypeLabel(detail.eventType)}
                </p>
                <h2 id="evt-modal-title" className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                  {detail.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="shrink-0 rounded-sm px-2 py-1 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">{detail.location}</p>
            <p className="mt-2 font-mono text-xs text-[var(--text-primary)]/85">{formatRange(detail.startAt, detail.endAt)}</p>
            {detail.description ? (
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-primary)]/88">{detail.description}</p>
            ) : null}
            {isAdmin ? (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--border-gold)]/25 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    openEdit(detail);
                    setDetail(null);
                  }}
                  className="rounded-sm border border-[var(--gold-accent)]/45 bg-[var(--gold-accent)]/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[var(--gold-accent)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    remove(detail.id);
                    setDetail(null);
                  }}
                  className="rounded-sm border border-red-500/45 bg-red-500/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-red-200/95"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {adminOpen && isAdmin ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/65 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evt-admin-title"
          onClick={() => {
            setAdminOpen(false);
            setEditingId(null);
          }}
        >
          <div
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-sm border border-[var(--border-gold)]/40 bg-[var(--bg-matte)] p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="evt-admin-title" className="font-display text-sm uppercase tracking-[0.15em] text-[var(--gold-accent)]">
              {editingId ? "Edit event" : "New event"}
            </h2>
            <div className="mt-4 space-y-3">
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Title
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Event type
                <select
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                  className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
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
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Start
                <input
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                  className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                End (optional)
                <input
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                  className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Notes
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full resize-y rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveAdmin}
                className="rounded-sm bg-[var(--gold-accent)]/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminOpen(false);
                  setEditingId(null);
                }}
                className="rounded-sm border border-[var(--border-gold)]/45 px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
