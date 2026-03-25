import type { ChecklistItemId, ChecklistItemState, ComplianceRule } from "@/types/compliance";

export const DEFAULT_CHECKLIST: ChecklistItemState[] = [
  { id: "greeting", label: "Greeting completed", status: "pending" },
  { id: "name_collected", label: "Name collected", status: "pending" },
  { id: "zip_collected", label: "ZIP code collected", status: "pending" },
  { id: "recording_disclosure", label: "Recording disclosure delivered", status: "pending" },
  { id: "recording_consent", label: "Recording consent obtained", status: "pending" },
  { id: "multi_plan_disclaimer", label: "Multi-plan disclaimer delivered", status: "pending" },
  { id: "scope_appointment", label: "Scope of appointment completed", status: "pending" },
  { id: "callback_number", label: "Callback number collected", status: "pending" },
  { id: "part_ab_status", label: "Part A / B status confirmed", status: "pending" },
  { id: "current_plan", label: "Current plan captured", status: "pending" },
  { id: "medicaid_status", label: "Medicaid / LIS status captured", status: "pending" },
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: "greeting_proper",
    label: "Professional greeting with name and offer to help",
    category: "greeting",
    weight: 0.06,
    keywords: ["thank you for calling", "my name is", "assist"],
  },
  {
    id: "zip_before_local_plan",
    label: "ZIP collected before localized plan discussion",
    category: "needs",
    weight: 0.08,
    critical: false,
  },
  {
    id: "recording_disclosure",
    label: "Recording / monitoring disclosure",
    category: "recording",
    weight: 0.12,
    critical: true,
    keywords: ["record", "monitored", "quality"],
  },
  {
    id: "recording_consent",
    label: "Recording consent captured",
    category: "recording",
    weight: 0.12,
    critical: true,
    keywords: ["agree", "consent", "okay", "yes"],
  },
  {
    id: "multi_plan_disclaimer",
    label: "Not every plan available / 1-800-MEDICARE",
    category: "disclosure",
    weight: 0.12,
    critical: true,
    keywords: ["every plan", "medicare.gov", "800-medicare", "1-800"],
  },
  {
    id: "scope_appointment",
    label: "Scope of appointment with permission",
    category: "scope",
    weight: 0.14,
    critical: true,
    keywords: ["permission", "scope", "medicare advantage", "discuss"],
  },
  {
    id: "no_early_plan_pitch",
    label: "No detailed plan discussion before scope/consent",
    category: "conduct",
    weight: 0.1,
    critical: true,
  },
  {
    id: "no_pressure",
    label: "No high-pressure / urgent close tactics",
    category: "conduct",
    weight: 0.08,
    critical: false,
  },
  {
    id: "callback_number",
    label: "Callback number collected when appropriate",
    category: "needs",
    weight: 0.05,
  },
  {
    id: "needs_complete",
    label: "Needs analysis: parts, plan, likes/dislikes, Medicaid",
    category: "needs",
    weight: 0.13,
    keywords: ["part a", "part b", "current plan", "medicaid", "lis"],
  },
];

export const TRANSCRIPT_HINTS: Partial<
  Record<ChecklistItemId, { patterns: RegExp[]; minAgentChars?: number }>
> = {
  greeting: { patterns: [/thank you for calling/i, /my name is/i, /how may i (help|assist)/i] },
  name_collected: { patterns: [/may i (have|get) your name/i, /what('?s| is) your name/i] },
  zip_collected: { patterns: [/\b\d{5}\b/, /zip\s*(code)?/i] },
  recording_disclosure: { patterns: [/record(ing|ed)?/i, /monitored/i, /quality assurance/i] },
  recording_consent: { patterns: [/do you agree/i, /is that (okay|alright)/i, /consent/i] },
  multi_plan_disclaimer: {
    patterns: [/not every plan|we do not offer every/i, /medicare\.gov/i, /1-800-medicare|800-medicare/i],
  },
  scope_appointment: {
    patterns: [/scope/i, /permission to discuss/i, /medicare advantage/i, /part d|prescription/i],
  },
  callback_number: { patterns: [/best number|call you back|reach you/i, /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/] },
  part_ab_status: { patterns: [/part\s*a/i, /part\s*b/i, /hospital/i, /medical insurance/i] },
  current_plan: { patterns: [/current plan|plan you have|insurance you have/i] },
  medicaid_status: { patterns: [/medicaid/i, /lis\b|low income|subsidy/i] },
};
