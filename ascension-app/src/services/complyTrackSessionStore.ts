export type ComplyTrackSessionRecord = {
  id: string;
  at: string;
  scenarioId: string;
  scenarioName: string;
  percentage: number;
  passed: boolean;
  durationMs: number;
};

const KEY = "comply-track-sessions-v1";
const MAX = 12;

function readAll(): ComplyTrackSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ComplyTrackSessionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadComplyTrackSessions(): ComplyTrackSessionRecord[] {
  return readAll();
}

export function appendComplyTrackSession(row: Omit<ComplyTrackSessionRecord, "id">): ComplyTrackSessionRecord[] {
  if (typeof window === "undefined") return [];
  const id = `ct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const next = [{ ...row, id }, ...readAll()].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  return next;
}
