import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import { SearchFilterBar } from "@/components/ui/search-filter";
import Pagination from "@/components/ui/pagination";
import { deleteResource, toggleResourceFlag } from "@/lib/actions/learning";
import { labelOf, RESOURCE_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { q, type, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { summary: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(type ? { type } : {}),
  };

  const [total, items] = await Promise.all([
    db.learningResource.count({ where }),
    db.learningResource.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const rows: EntityRow[] = items.map((r) => ({
    id: r.id,
    title: r.title,
    meta: labelOf(RESOURCE_TYPES, r.type),
    href: `/learn/${r.slug}`,
    status: undefined,
    published: r.published,
    featured: r.featured,
    updatedLabel: r.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return (
    <>
      <AdminPageHeader
        title="Learning Hub"
        description="Articles, guides, tutorials and learning resources for the Med-Net community."
        actions={
          <Link
            href="/admin/learning/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New resource
          </Link>
        }
      />
      <SearchFilterBar
        placeholder="Search resources…"
        filters={[{ name: "type", label: "All types", options: RESOURCE_TYPES }]}
      />
      <div className="mt-5">
        <EntityList
          rows={rows}
          entityBase="learning"
          toggleAction={toggleResourceFlag}
          deleteAction={deleteResource}
          hasStatus={false}
          newHref="/admin/learning/new"
          emptyTitle="No learning resources yet"
          emptyDescription="Add the first article, guide or tutorial to start building the Learning Hub."
        />
      </div>
      <Pagination
        page={currentPage}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/learning"
        params={{ q, type }}
      />
    </>
  );
}
