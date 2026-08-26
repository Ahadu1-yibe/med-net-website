import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { partnerConfig } from "@/components/admin/entity-configs";
import { deletePartner, savePartner } from "@/lib/actions/partners";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await db.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <>
      <AdminPageHeader title="Edit partner" description={partner.name} />
      <EntityForm
        config={partnerConfig}
        action={savePartner}
        deleteAction={deletePartner}
        entityBase="partners"
        id={partner.id}
        titleField="name"
        values={{
          name: partner.name,
          description: partner.description,
          tier: partner.tier,
          websiteUrl: partner.websiteUrl ?? "",
          logoImage: partner.logoImage ?? "",
          sortOrder: String(partner.sortOrder),
          published: partner.published,
        }}
      />
    </>
  );
}
