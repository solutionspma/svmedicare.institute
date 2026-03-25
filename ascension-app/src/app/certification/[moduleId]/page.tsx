import { CertificationModuleClient } from "./ModuleClient";
import { CERTIFICATION_MODULES } from "@/data/certification";

export function generateStaticParams() {
  return CERTIFICATION_MODULES.map((m) => ({ moduleId: m.id }));
}

export default async function CertificationModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = CERTIFICATION_MODULES.find((m) => m.id === moduleId);
  if (!module) return null;
  return <CertificationModuleClient module={module} />;
}
