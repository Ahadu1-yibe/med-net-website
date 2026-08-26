import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import { SearchFilterBar } from "@/components/ui/search-filter";
import Pagination from "@/components/ui/pagination";
import { deleteProject, toggleProjectFlag } from "@/lib/actions/projects";
import { labelOf, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminProjectsPage({
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

  const [total, projects] = await Promise.all([
    db.project.count({ where }),
    db.project.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const rows: EntityRow[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    meta: labelOf(PROJECT_CATEGORIES, p.category),
    href: `/projects/${p.slug}`,
    status: p.status,
    published: p.published,
    featured: p.featured,
    updatedLabel: p.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    extra: p.featured ? "Featured" : undefined,
  }));

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Everything Med-Net builds appears here. Published projects are shown on the public projects page and can be featured on the homepage."
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New project
          </Link>
        }
      />
      <SearchFilterBar
        placeholder="Search projects…"
        filters={[{ name: "category", label: "All categories", options: PROJECT_CATEGORIES }]}
      />
      <div className="mt-5">
        <EntityList
          rows={rows}
          entityBase="projects"
          toggleAction={toggleProjectFlag}
          deleteAction={deleteProject}
          newHref="/admin/projects/new"
          emptyTitle="No projects yet"
          emptyDescription="Add Med-Net's first project — it will appear on the public website as soon as you publish it."
        />
      </div>
      <Pagination
        page={currentPage}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/projects"
        params={{ q, category }}
      />
    </>
  );
}
