/**
 * Module completion configuration
 * Backend master control: à la carte click-through allowance
 * For users who have already completed certain modules that have not changed.
 */

export type ModuleCompletionConfig = {
  /** Allow click-through for users who previously completed this module (unchanged content) */
  allowClickThrough?: boolean;
  /** Module version hash — if changed, previous completion may not count */
  contentVersion?: string;
};

/** Per-module config — wire to backend/API when ready */
export const MODULE_COMPLETION_CONFIG: Record<string, ModuleCompletionConfig> = {
  "1": { allowClickThrough: false, contentVersion: "2026-01" },
  "2": { allowClickThrough: false, contentVersion: "2026-01" },
  "3": { allowClickThrough: false, contentVersion: "2026-01" },
  "4": { allowClickThrough: false, contentVersion: "2026-01" },
  "5": { allowClickThrough: false, contentVersion: "2026-01" },
  "6": { allowClickThrough: false, contentVersion: "2026-01" },
};

/** Check if user can click-through a module (backend: verify prior completion + unchanged content) */
export function canClickThroughModule(
  moduleId: string,
  _userPriorCompletion?: { moduleId: string; completedAt: string; contentVersion: string }[]
): boolean {
  const config = MODULE_COMPLETION_CONFIG[moduleId];
  if (!config?.allowClickThrough) return false;
  // When backend wired: check userPriorCompletion for this module + contentVersion match
  return false;
}
