import { MOCK_CERTIFICATES } from "@/data/mockCertificates";
import CredentialPageClient from "./CredentialPageClient";

export function generateStaticParams() {
  return MOCK_CERTIFICATES.map((c) => ({ credentialId: c.id }));
}

export default function CredentialDetailPage() {
  return <CredentialPageClient />;
}
