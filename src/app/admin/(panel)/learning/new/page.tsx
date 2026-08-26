import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { resourceConfig } from "@/components/admin/entity-configs";
import { saveResource } from "@/lib/actions/learning";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  return (
    <>
      <AdminPageHeader
        title="New learning resource"
        description="Create an article, guide, tutorial or course entry for the Learning Hub."
      />
      <EntityForm
        config={resourceConfig}
        values={{ type: "article", level: "beginner" }}
        action={saveResource}
        entityBase="learning"
      />
    </>
  );
}
