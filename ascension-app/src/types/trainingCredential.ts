export type SignedTrainingCredential = {
  payload: TrainingCredentialPayload;
  payloadB64: string;
  signature: string;
};

export type TrainingCredentialPayload = {
  v: number;
  type: "medicare_call_specialist";
  credentialId: string;
  holderDisplayName: string;
  subjectUserId: string;
  issuedAt: string;
  qualifyingScores: number[];
  programVersion: string;
};

export type VerifyCredentialResponse = {
  valid: boolean;
  credential: {
    credentialId: string;
    type: string;
    holderDisplayName: string;
    issuedAt: string;
    programVersion: string;
    qualifyingScores: number[];
  } | null;
  error?: string;
};

