import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import { deletePartner, togglePartnerPublished } from "@/lib/actions/partners";
import { labelOf, PARTNER_TIERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await db.partner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  const rows: EntityRow[] = partners.map((p) => ({
    id: p.id,
    title: p.name,
    meta: labelOf(PARTNER_TIERS, p.tier),
    href: p.websiteUrl ?? undefined,
    status: undefined,
    published: p.published,
    featured: false,
    updatedLabel: p.sortOrder ? `Order ${p.sortOrder}` : undefined,
  }));

  return (
    <>
      <AdminPageHeader
        title="Partners"
        description="Only add organizations with an officially established relationship — the public partner section shows exactly what is entered here."
        actions={
          <Link
            href="/admin/partners/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New partner
          </Link>
        }
      />
      <EntityList
        rows={rows}
        entityBase="partners"
        toggleAction={togglePartnerPublished}
        deleteAction={deletePartner}
        hasFeatured={false}
        hasStatus={false}
        newHref="/admin/partners/new"
        emptyTitle="No partners listed yet"
        emptyDescription="The public website shows a tasteful placeholder until official partnerships are added here. Never add organizations that have not formally agreed to collaborate."
      />
    </>
  );
}
