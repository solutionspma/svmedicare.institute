export type CarrierAuditSeverity = "info" | "notice" | "warning";

export type CarrierAuditEventType =
  | "lab_session_completed"
  | "lab_session_started"
  | "lab_compliance_signal"
  | "lab_transcript_summary"
  | "certification_unlocked"
  | "credential_issued"
  | "manual_note";

export interface CarrierAuditEntry {
  id: string;
  at: number;
  carrierId: string;
  eventType: CarrierAuditEventType;
  severity: CarrierAuditSeverity;
  agentRef: string;
  summary: string;
  metadata: Record<string, string | number | boolean | null>;
}
