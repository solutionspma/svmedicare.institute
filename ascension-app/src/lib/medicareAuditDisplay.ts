export const MEDICARE_AUDIT_CHECKLIST_ORDER = [
  "greeting",
  "name_zip",
  "recording_disclosure",
  "recording_consent",
  "multi_plan_disclaimer",
  "scope_of_appointment",
  "callback_number",
  "needs_analysis",
  "professional_conduct",
] as const;

export const MEDICARE_AUDIT_CHECKLIST_LABELS: Record<string, string> = {
  greeting: "Greeting",
  name_zip: "Name + ZIP",
  recording_disclosure: "Recording disclosure",
  recording_consent: "Recording consent",
  multi_plan_disclaimer: "Multi-plan disclaimer",
  scope_of_appointment: "Scope of appointment",
  callback_number: "Callback number",
  needs_analysis: "Needs analysis",
  professional_conduct: "Professional conduct",
};

export type MedicareAuditChecklistRow = { key: string; label: string; value: string };

export function medicareAuditChecklistStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "completed" || s === "pass") return "text-emerald-400/90";
  if (s === "partial") return "text-amber-400/90";
  return "text-red-400/85";
}

export function buildMedicareAuditChecklistRows(
  checklist: Record<string, string> | null | undefined
): MedicareAuditChecklistRow[] {
  if (checklist == null) return [];
  const orderSet = new Set<string>(MEDICARE_AUDIT_CHECKLIST_ORDER);
  return [
    ...MEDICARE_AUDIT_CHECKLIST_ORDER.filter((k) => k in checklist).map((k) => ({
      key: k,
      label: MEDICARE_AUDIT_CHECKLIST_LABELS[k] ?? k.replace(/_/g, " "),
      value: checklist[k] ?? "",
    })),
    ...Object.keys(checklist)
      .filter((k) => !orderSet.has(k))
      .sort()
      .map((k) => ({
        key: k,
        label: MEDICARE_AUDIT_CHECKLIST_LABELS[k] ?? k.replace(/_/g, " "),
        value: checklist[k] ?? "",
      })),
  ];
}
