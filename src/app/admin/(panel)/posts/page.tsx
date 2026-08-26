import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityList, { type EntityRow } from "@/components/admin/entity-list";
import StatusBadge from "@/components/admin/status-badge";
import { SearchFilterBar } from "@/components/ui/search-filter";
import Pagination from "@/components/ui/pagination";
import { deletePost, togglePostFlag } from "@/lib/actions/posts";
import { labelOf, POST_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { q, type, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const now = new Date();

  const where = {
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { excerpt: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(type ? { type } : {}),
  };

  const [total, items] = await Promise.all([
    db.post.count({ where }),
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const rows: EntityRow[] = items.map((p) => ({
    id: p.id,
    title: p.title,
    meta: labelOf(POST_TYPES, p.type),
    href: p.published ? `/updates/${p.slug}` : undefined,
    status: undefined,
    published: p.published,
    featured: p.featured,
    updatedLabel: p.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    extra:
      p.type === "EVENT" && p.startAt
        ? p.startAt > now
          ? "Upcoming"
          : "Past event"
        : !p.published && p.publishAt && p.publishAt > now
          ? "Scheduled"
          : undefined,
  }));

  return (
    <>
      <AdminPageHeader
        title="Events, News & Insights"
        description="Publish events, news, insights and announcements. Scheduled posts go live automatically at their publish date."
        actions={
          <Link
            href="/admin/posts/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
          >
            <Plus className="h-4 w-4" />
            New post
          </Link>
        }
      />
      <SearchFilterBar
        placeholder="Search posts…"
        filters={[{ name: "type", label: "All types", options: POST_TYPES }]}
      />
      <div className="mt-5">
        <EntityList
          rows={rows}
          entityBase="posts"
          toggleAction={togglePostFlag}
          deleteAction={deletePost}
          hasStatus={false}
          newHref="/admin/posts/new"
          emptyTitle="No posts yet"
          emptyDescription="Publish the first event, news item or insight — it appears on the website immediately."
        />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-fg-muted">
        Visibility legend:
        <StatusBadge status="published" />
        <StatusBadge status="draft" />
        <StatusBadge status="scheduled" />
      </div>
      <Pagination
        page={currentPage}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        basePath="/admin/posts"
        params={{ q, type }}
      />
    </>
  );
}
