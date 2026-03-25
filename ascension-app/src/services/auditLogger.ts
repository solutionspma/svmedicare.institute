import { MOCK_AUDIT_EVENTS } from "@/data/mockAuditEvents";
import type { AuditEvent } from "@/types/audit";

const STORAGE_KEY = "svmi-platform-audit-v1";
const SEED_FLAG = "svmi-platform-audit-mock-seeded-v1";
const MAX = 2000;

function readRaw(): AuditEvent[] {
  if (typeof window === "undefined") return [...MOCK_AUDIT_EVENTS];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as AuditEvent[]) : [];
    if (!window.localStorage.getItem(SEED_FLAG)) {
      const merged = [...MOCK_AUDIT_EVENTS, ...parsed];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged.slice(-MAX)));
      window.localStorage.setItem(SEED_FLAG, "1");
      return merged;
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [...MOCK_AUDIT_EVENTS];
  }
}

function writeRaw(events: AuditEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX)));
  } catch {
    /* ignore */
  }
}

function uid(): string {
  return `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function logAuditEvent(event: Omit<AuditEvent, "id" | "timestamp"> & { id?: string; timestamp?: string }): AuditEvent {
  const full: AuditEvent = {
    id: event.id ?? uid(),
    userId: event.userId,
    userName: event.userName,
    eventType: event.eventType,
    category: event.category,
    severity: event.severity,
    description: event.description,
    relatedRule: event.relatedRule,
    scoreImpact: event.scoreImpact,
    timestamp: event.timestamp ?? new Date().toISOString(),
    sessionId: event.sessionId,
  };
  const next = [...readRaw(), full];
  writeRaw(next);
  return full;
}

export type AuditFilters = {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  userQuery?: string;
  severity?: AuditEvent["severity"] | "";
  category?: AuditEvent["category"] | "";
  eventType?: string;
  search?: string;
};

export function getAuditEvents(filters?: AuditFilters): AuditEvent[] {
  let list = [...readRaw()].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (filters?.userId) list = list.filter((e) => e.userId === filters.userId);
  if (filters?.severity) list = list.filter((e) => e.severity === filters.severity);
  if (filters?.category) list = list.filter((e) => e.category === filters.category);
  if (filters?.eventType) list = list.filter((e) => e.eventType.toLowerCase().includes(filters.eventType!.toLowerCase()));

  if (filters?.userQuery) {
    const q = filters.userQuery.toLowerCase();
    list = list.filter((e) => e.userName.toLowerCase().includes(q) || e.userId.toLowerCase().includes(q));
  }

  if (filters?.dateFrom) {
    const t = new Date(filters.dateFrom).getTime();
    list = list.filter((e) => new Date(e.timestamp).getTime() >= t);
  }
  if (filters?.dateTo) {
    const t = new Date(filters.dateTo).getTime();
    list = list.filter((e) => new Date(e.timestamp).getTime() <= t);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.description.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        (e.relatedRule?.toLowerCase().includes(q) ?? false)
    );
  }

  return list;
}

export function getAgentAuditHistory(userId: string): AuditEvent[] {
  return getAuditEvents({ userId });
}

export function exportAuditEvents(
  events: AuditEvent[],
  format: "csv" | "pdf"
): { mime: string; body: string; filename: string } {
  if (format === "pdf") {
    return {
      mime: "application/pdf",
      body: "",
      filename: "audit-export-placeholder.pdf",
    };
  }
  const header = [
    "id",
    "timestamp",
    "userId",
    "userName",
    "eventType",
    "category",
    "severity",
    "description",
    "relatedRule",
    "scoreImpact",
    "sessionId",
  ];
  const rows = events.map((e) =>
    [
      e.id,
      e.timestamp,
      e.userId,
      `"${e.userName.replace(/"/g, '""')}"`,
      e.eventType,
      e.category,
      e.severity,
      `"${e.description.replace(/"/g, '""')}"`,
      e.relatedRule ? `"${e.relatedRule.replace(/"/g, '""')}"` : "",
      e.scoreImpact ?? "",
      e.sessionId ?? "",
    ].join(",")
  );
  return {
    mime: "text/csv;charset=utf-8",
    body: [header.join(","), ...rows].join("\n"),
    filename: `compliance-audit-${new Date().toISOString().slice(0, 10)}.csv`,
  };
}
