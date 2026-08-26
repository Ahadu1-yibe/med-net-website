import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import { SearchFilterBar } from "@/components/ui/search-filter";
import Pagination from "@/components/ui/pagination";
import { deleteResearch, toggleResearchFlag } from "@/lib/actions/research";
import { labelOf, RESEARCH_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { summary: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(category ? { category } : {}),
  };

  const [total, items] = await Promise.all([
    db.researchItem.count({ where }),
    db.researchItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const rows: EntityRow[] = items.map((r) => ({
    id: r.id,
    title: r.title,
    meta: labelOf(RESEARCH_CATEGORIES, r.category),
    href: `/research/${r.slug}`,
    status: r.status,
    published: r.published,
    featured: r.featured,
    updatedLabel: r.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return (
    <>
      <AdminPageHeader
        title="Research"
        description="Research initiatives, studies and evidence work. Published items appear in Research & Innovation."
        actions={
          <Link
            href="/admin/research/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New research item
          </Link>
        }
      />
      <SearchFilterBar
        placeholder="Search research…"
        filters={[{ name: "category", label: "All areas", options: RESEARCH_CATEGORIES }]}
      />
      <div className="mt-5">
        <EntityList
          rows={rows}
          entityBase="research"
          toggleAction={toggleResearchFlag}
          deleteAction={deleteResearch}
          newHref="/admin/research/new"
          emptyTitle="No research items yet"
          emptyDescription="Add the first research initiative — it will appear on the public research page once published."
        />
      </div>
      <Pagination
        page={currentPage}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/research"
        params={{ q, category }}
      />
    </>
  );
}
