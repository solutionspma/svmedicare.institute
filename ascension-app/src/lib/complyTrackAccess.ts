import type { TrainingRole } from "@/hooks/useTrainingRole";

export function canAccessAdminComplyTrack(role: TrainingRole): boolean {
  return role === "manager" || role === "admin";
}

export function filterSessionsForRole<T extends { agentUserId?: string }>(
  sessions: T[],
  role: TrainingRole,
  currentUserId: string
): T[] {
  if (role === "admin") return sessions;
  if (role === "manager") return sessions;
  return sessions.filter((s) => s.agentUserId === currentUserId);
}
