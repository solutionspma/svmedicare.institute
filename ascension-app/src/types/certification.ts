export interface CertificationRecord {
  id: string;
  userId: string;
  fullName: string;
  credentialTitle: string;
  issueDate: string;
  expirationDate?: string;
  score: number;
  certificateNumber: string;
  verificationCode: string;
  status: "active" | "expired" | "revoked";
}

export type CertificateProgramInput = {
  id: string;
  title: string;
  /** ISO duration hint, e.g. months until expiration */
  validityMonths?: number;
};
