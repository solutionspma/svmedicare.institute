import type { CarrierAuditEntry, CarrierAuditEventType, CarrierAuditSeverity } from "@/types/carrierAudit";

const STORE_KEY = "svmi-carrier-audit-v1";
const DEFAULT_CARRIER = "carrier-demo";

function uid(): string {
  return `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function readAll(): CarrierAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CarrierAuditEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: CarrierAuditEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(entries.slice(-500)));
  } catch {
    /* ignore */
  }
}

export function appendCarrierAuditEntry(args: {
  carrierId?: string;
  eventType: CarrierAuditEventType;
  severity?: CarrierAuditSeverity;
  agentRef: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
}): CarrierAuditEntry {
  const entry: CarrierAuditEntry = {
    id: uid(),
    at: Date.now(),
    carrierId: args.carrierId ?? DEFAULT_CARRIER,
    eventType: args.eventType,
    severity: args.severity ?? "info",
    agentRef: args.agentRef.slice(0, 128),
    summary: args.summary.slice(0, 500),
    metadata: args.metadata ?? {},
  };
  const next = [...readAll(), entry];
  writeAll(next);
  return entry;
}

export function getCarrierAuditEntries(options?: { carrierId?: string; limit?: number }): CarrierAuditEntry[] {
  const all = readAll();
  const filtered =
    options?.carrierId != null ? all.filter((e) => e.carrierId === options.carrierId) : [...all];
  filtered.sort((a, b) => b.at - a.at);
  const lim = options?.limit ?? 200;
  return filtered.slice(0, lim);
}

export function exportCarrierAuditCsv(entries: CarrierAuditEntry[]): string {
  const header = [
    "id",
    "iso_time",
    "carrier_id",
    "event_type",
    "severity",
    "agent_ref",
    "summary",
    "metadata_json",
  ];
  const lines = entries.map((e) =>
    [
      e.id,
      new Date(e.at).toISOString(),
      e.carrierId,
      e.eventType,
      e.severity,
      e.agentRef,
      `"${e.summary.replace(/"/g, '""')}"`,
      `"${JSON.stringify(e.metadata).replace(/"/g, '""')}"`,
    ].join(",")
  );
  return [header.join(","), ...lines].join("\n");
}
