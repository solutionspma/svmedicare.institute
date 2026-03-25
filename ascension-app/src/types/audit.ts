export interface AuditEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: string;
  category: "call-simulation" | "quiz" | "certification" | "live-class" | "admin-action";
  severity: "info" | "warning" | "critical";
  description: string;
  relatedRule?: string;
  scoreImpact?: number;
  timestamp: string;
  sessionId?: string;
}
