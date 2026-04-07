import seed from "@/data/eventsCalendarSeed.json";

const STORAGE_KEY = "events-field-calendar-v1";
const SEEDED_FLAG = "events-field-calendar-seeded-v1";

export type StoredCalendarEvent = {
  id: string;
  title: string;
  eventType: string;
  location: string;
  startAt: string;
  endAt?: string;
  description?: string;
};

function safeParse(raw: string | null): StoredCalendarEvent[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as StoredCalendarEvent[]) : [];
  } catch {
    return [];
  }
}

function readAll(): StoredCalendarEvent[] {
  if (typeof window === "undefined") return [...(seed as StoredCalendarEvent[])];
  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (existing.length > 0) return existing;
  if (window.localStorage.getItem(SEEDED_FLAG)) return [];
  const initial = [...(seed as StoredCalendarEvent[])];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    window.localStorage.setItem(SEEDED_FLAG, "1");
  } catch {
    /* ignore */
  }
  return initial;
}

export function loadCalendarEvents(): StoredCalendarEvent[] {
  return readAll();
}

export function saveCalendarEvents(events: StoredCalendarEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.localStorage.setItem(SEEDED_FLAG, "1");
  } catch {
    /* ignore */
  }
}

export function addCalendarEvent(row: Omit<StoredCalendarEvent, "id">): StoredCalendarEvent[] {
  const id = `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const next = [...readAll(), { ...row, id }];
  saveCalendarEvents(next);
  return next;
}

export function updateCalendarEvent(
  id: string,
  patch: Partial<Omit<StoredCalendarEvent, "id">>
): StoredCalendarEvent[] {
  const next = readAll().map((e) => (e.id === id ? { ...e, ...patch, id } : e));
  saveCalendarEvents(next);
  return next;
}

export function deleteCalendarEvent(id: string): StoredCalendarEvent[] {
  const next = readAll().filter((e) => e.id !== id);
  saveCalendarEvents(next);
  return next;
}
