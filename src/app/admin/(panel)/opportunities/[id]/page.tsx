import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { opportunityConfig } from "@/components/admin/entity-configs";
import { deleteOpportunity, saveOpportunity } from "@/lib/actions/opportunities";
import { toDateInput } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.opportunity.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Edit opportunity" description={item.title} />
      <EntityForm
        config={opportunityConfig}
        action={saveOpportunity}
        deleteAction={deleteOpportunity}
        entityBase="opportunities"
        id={item.id}
        values={{
          title: item.title,
          slug: item.slug,
          type: item.type,
          status: item.status,
          description: item.description,
          requirements: item.requirements,
          location: item.location ?? "",
          deadline: toDateInput(item.deadline),
          applyUrl: item.applyUrl ?? "",
          applyEmail: item.applyEmail ?? "",
          featured: item.featured,
          published: item.published,
        }}
      />
    </>
  );
}
