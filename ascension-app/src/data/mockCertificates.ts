import type { CertificationRecord } from "@/types/certification";

/** Demo seed — replace with Supabase `certifications` table */
export const MOCK_CERTIFICATES: CertificationRecord[] = [
  {
    id: "cred-mock-orion-1",
    userId: "npc-vex",
    fullName: "M. Ortega",
    credentialTitle: "Certified Medicare Call Specialist",
    issueDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    expirationDate: new Date(Date.now() + 86400000 * 305).toISOString(),
    score: 94,
    certificateNumber: "SVMI-2025-ORION-88421",
    verificationCode: "Q7K2M9",
    status: "active",
  },
  {
    id: "cred-mock-lynx-1",
    userId: "npc-lynx",
    fullName: "T. Okonkwo",
    credentialTitle: "Certified Medicare Call Specialist",
    issueDate: new Date(Date.now() - 86400000 * 120).toISOString(),
    score: 89,
    certificateNumber: "SVMI-2024-LYNX-44102",
    verificationCode: "B3N8XP",
    status: "expired",
  },
];
