import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import { SearchFilterBar } from "@/components/ui/search-filter";
import { deleteOpportunity, toggleOpportunityFlag } from "@/lib/actions/opportunities";
import { labelOf, OPPORTUNITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const items = await db.opportunity.findMany({
    where: q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {},
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const rows: EntityRow[] = items.map((o) => ({
    id: o.id,
    title: o.title,
    meta: labelOf(OPPORTUNITY_TYPES, o.type),
    status: o.status,
    published: o.published,
    hasFeatured: true,
    updatedLabel: o.deadline
      ? `Deadline ${o.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : undefined,
  }));

  return (
    <>
      <AdminPageHeader
        title="Opportunities"
        description="Volunteer roles, ambassador calls, applications and collaborations. Open opportunities appear on the Community page."
        actions={
          <Link
            href="/admin/opportunities/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New opportunity
          </Link>
        }
      />
      <SearchFilterBar placeholder="Search opportunities…" />
      <div className="mt-5">
        <EntityList
          rows={rows}
          entityBase="opportunities"
          toggleAction={toggleOpportunityFlag}
          deleteAction={deleteOpportunity}
          newHref="/admin/opportunities/new"
          emptyTitle="No opportunities yet"
          emptyDescription="Post the first volunteer role or application call for the community."
        />
      </div>
    </>
  );
}
