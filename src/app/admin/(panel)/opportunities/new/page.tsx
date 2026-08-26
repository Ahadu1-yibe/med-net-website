import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { opportunityConfig } from "@/components/admin/entity-configs";
import { saveOpportunity } from "@/lib/actions/opportunities";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage() {
  return (
    <>
      <AdminPageHeader
        title="New opportunity"
        description="Post a volunteer role, ambassador call, application or collaboration request."
      />
      <EntityForm
        config={opportunityConfig}
        values={{ type: "VOLUNTEER", status: "OPEN" }}
        action={saveOpportunity}
        entityBase="opportunities"
      />
    </>
  );
}
