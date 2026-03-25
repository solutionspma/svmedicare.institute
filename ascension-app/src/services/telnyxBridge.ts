import { FEATURES } from "@/config/features";

export async function initiateTrainingCall(_args: {
  scenarioId: string;
  agentId: string;
}): Promise<{ ok: boolean; reason?: string }> {
  if (!FEATURES.TELNYX_TRAINING) {
    return { ok: false, reason: "Telnyx training bridge disabled (FEATURES.TELNYX_TRAINING)." };
  }
  return { ok: false, reason: "Not implemented — enable TELNYX_TRAINING and wire Telnyx credentials." };
}

export async function handleInboundTrainingCall(_payload: unknown): Promise<void> {
  if (!FEATURES.TELNYX_TRAINING) return;
}

export async function endTrainingCall(_callControlId: string): Promise<void> {
  if (!FEATURES.TELNYX_TRAINING) return;
}

export function mapPhoneNumberToScenario(_e164: string): string | null {
  if (!FEATURES.TELNYX_TRAINING) return null;
  return null;
}

export function logCallMetadata(_meta: Record<string, string | number | boolean | null>): void {
  if (!FEATURES.TELNYX_TRAINING) return;
}
