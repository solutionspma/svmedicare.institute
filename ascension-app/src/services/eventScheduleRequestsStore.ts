const STORAGE_KEY = "events-field-schedule-requests-v1";

export type EventScheduleRequestStatus = "pending_approval";

export type EventScheduleRequest = {
  id: string;
  submittedAt: string;
  status: EventScheduleRequestStatus;
  name: string;
  eventType: string;
  location: string;
  dateTime: string;
  notes: string;
};

function readAll(): EventScheduleRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function writeAll(rows: EventScheduleRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export function loadScheduleRequests(): EventScheduleRequest[] {
  return readAll();
}

export function submitScheduleRequest(data: {
  name: string;
  eventType: string;
  location: string;
  dateTime: string;
  notes: string;
}): EventScheduleRequest {
  const row: EventScheduleRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    submittedAt: new Date().toISOString(),
    status: "pending_approval",
    ...data,
  };
  writeAll([row, ...readAll()]);
  return row;
}
