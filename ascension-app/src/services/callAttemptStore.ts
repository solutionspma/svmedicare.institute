import type { CallAttempt } from "@/types/compliance";

const KEY = "svmi-call-attempts-v1";
const MAX = 400;

function readAll(): CallAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as CallAttempt[]) : [];
  } catch {
    return [];
  }
}

function writeAll(rows: CallAttempt[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX)));
  } catch {
    /* ignore */
  }
}

export function saveCallAttempt(attempt: CallAttempt): void {
  const next = [...readAll().filter((a) => a.id !== attempt.id), attempt];
  writeAll(next);
}

export function getCallAttempts(filter?: { agentUserId?: string }): CallAttempt[] {
  let list = readAll().sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
  if (filter?.agentUserId) list = list.filter((a) => a.agentUserId === filter.agentUserId);
  return list;
}
