import { MOCK_CERTIFICATES } from "@/data/mockCertificates";
import type { CertificateProgramInput, CertificationRecord } from "@/types/certification";

const STORAGE_KEY = "svmi-platform-certificates-v1";
const SEED_FLAG = "svmi-platform-cert-mock-seeded-v1";

function readAll(): CertificationRecord[] {
  if (typeof window === "undefined") return [...MOCK_CERTIFICATES];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CertificationRecord[]) : [];
    if (!window.localStorage.getItem(SEED_FLAG)) {
      const merged = [...MOCK_CERTIFICATES, ...parsed.filter((p) => !MOCK_CERTIFICATES.some((m) => m.id === p.id))];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.localStorage.setItem(SEED_FLAG, "1");
      return merged;
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [...MOCK_CERTIFICATES];
  }
}

function writeAll(records: CertificationRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

function generateCertificateNumber(): string {
  const y = new Date().getFullYear();
  const n = Math.floor(10000 + Math.random() * 90000);
  return `SVMI-${y}-${n}`;
}

function generateVerificationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function generateCredentialId(): string {
  return `cred-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function applyStatusByDates(record: CertificationRecord): CertificationRecord {
  if (record.status === "revoked") return record;
  if (record.expirationDate) {
    const exp = new Date(record.expirationDate).getTime();
    if (exp < Date.now()) return { ...record, status: "expired" };
  }
  return { ...record, status: "active" };
}

function supersedeActiveForUser(all: CertificationRecord[], userId: string): CertificationRecord[] {
  return all.map((c) =>
    c.userId === userId && c.status === "active" ? { ...c, status: "expired" as const } : c
  );
}

export function issueCertificate(
  user: { userId: string; fullName: string },
  score: number,
  program: CertificateProgramInput
): CertificationRecord {
  const issueDate = new Date().toISOString();
  let expirationDate: string | undefined;
  if (program.validityMonths != null && program.validityMonths > 0) {
    const d = new Date();
    d.setMonth(d.getMonth() + program.validityMonths);
    expirationDate = d.toISOString();
  }
  const record: CertificationRecord = {
    id: generateCredentialId(),
    userId: user.userId,
    fullName: user.fullName.trim() || "Trainee",
    credentialTitle: program.title,
    issueDate,
    expirationDate,
    score: Math.round(score),
    certificateNumber: generateCertificateNumber(),
    verificationCode: generateVerificationCode(),
    status: "active",
  };
  const all = readAll();
  writeAll([record, ...supersedeActiveForUser(all, user.userId)]);
  return record;
}

export function verifyCertificate(
  credentialId: string,
  verificationCode: string
): CertificationRecord | null {
  const id = credentialId.trim();
  const code = verificationCode.trim().toUpperCase();
  const found = readAll().find((c) => c.id === id && c.verificationCode.toUpperCase() === code);
  if (!found) return null;
  return applyStatusByDates(found);
}

export function getCertificateById(credentialId: string): CertificationRecord | null {
  const c = readAll().find((x) => x.id === credentialId);
  return c ? applyStatusByDates(c) : null;
}

export function revokeCertificate(credentialId: string): CertificationRecord | null {
  const all = readAll();
  const i = all.findIndex((c) => c.id === credentialId);
  if (i === -1) return null;
  const next = { ...all[i], status: "revoked" as const };
  all[i] = next;
  writeAll(all);
  return next;
}

export function getCertificateStatus(credentialId: string): CertificationRecord["status"] | null {
  const c = getCertificateById(credentialId);
  return c?.status ?? null;
}

export function getActiveCertificateForUser(userId: string): CertificationRecord | null {
  const list = readAll()
    .filter((c) => c.userId === userId)
    .map(applyStatusByDates)
    .filter((c) => c.status === "active")
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  return list[0] ?? null;
}

export function listAllCertificates(): CertificationRecord[] {
  return readAll().map(applyStatusByDates);
}
