const LABELS: Record<string, string> = {
  community: "Community Events",
  retail: "Retail Booths",
  carrier: "Carrier Events",
  self_hosted: "Self-Hosted Events",
};

export function eventTypeLabel(id: string): string {
  return LABELS[id] ?? id.replace(/_/g, " ");
}

export const EVENT_TYPE_OPTIONS = [
  { value: "community", label: "Community Events" },
  { value: "retail", label: "Retail Booths" },
  { value: "carrier", label: "Carrier Events" },
  { value: "self_hosted", label: "Self-Hosted Events" },
] as const;
