import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { researchConfig } from "@/components/admin/entity-configs";
import { saveResearch } from "@/lib/actions/research";

export const dynamic = "force-dynamic";

export default async function NewResearchPage() {
  return (
    <>
      <AdminPageHeader
        title="New research item"
        description="Add a research initiative, study or evidence project to Med-Net's research portfolio."
      />
      <EntityForm
        config={researchConfig}
        values={{ category: "digital-health", status: "ongoing" }}
        action={saveResearch}
        entityBase="research"
      />
    </>
  );
}
