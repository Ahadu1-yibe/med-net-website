import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { partnerConfig } from "@/components/admin/entity-configs";
import { savePartner } from "@/lib/actions/partners";

export const dynamic = "force-dynamic";

export default async function NewPartnerPage() {
  return (
    <>
      <AdminPageHeader
        title="New partner"
        description="Add an officially established partner or collaborating organization."
      />
      <EntityForm
        config={partnerConfig}
        values={{ tier: "COLLABORATING", sortOrder: "0" }}
        action={savePartner}
        entityBase="partners"
        titleField="name"
      />
    </>
  );
}
