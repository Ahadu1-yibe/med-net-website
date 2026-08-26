import type { Metadata } from "next";
import { Suspense } from "react";
import { Megaphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import PostCard from "@/components/public/post-card";
import { SearchFilterBar } from "@/components/ui/search-filter";
import { db } from "@/lib/db";
import { POST_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events, News & Insights",
  description:
    "Events, news, insights and announcements from Med-Net Digital Health Collaborative — sessions, activities, perspectives and organizational updates.",
};

const PAGE_SIZE = 9;

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { q, type, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    published: true,
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { excerpt: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(type ? { type } : {}),
  };

  const [total, featured, items] = await Promise.all([
    db.post.count({ where }),
    (async () => {
      if (q || type || currentPage > 1) return null;
      return db.post.findFirst({ where: { published: true, featured: true }, orderBy: { createdAt: "desc" } });
    })(),
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <Megaphone className="h-3.5 w-3.5" />
              Events, News & Insights
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              What's happening across <span className="text-gradient">the network</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Upcoming events, organizational news, community insights and official announcements from Med-Net.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          {featured && !q && !type && currentPage === 1 && (
            <Reveal className="mb-10">
              <a
                href={`/updates/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-all hover:border-accent/40 hover:shadow-lg sm:grid-cols-[1.1fr_1fr]"
              >
                <div className="relative aspect-[16/8] overflow-hidden bg-muted sm:aspect-auto">
                  {featured.coverImage ? (
                    <img
                      src={featured.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-dots opacity-70">
                      <Megaphone className="h-10 w-10 text-line-strong" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-strong">
                    Featured · {featured.type.charAt(0) + featured.type.slice(1).toLowerCase()}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-strong sm:text-2xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted">{featured.excerpt}</p>
                </div>
              </a>
            </Reveal>
          )}

          <Suspense>
            <SearchFilterBar
              placeholder="Search events, news and insights…"
              filters={[{ name: "type", label: "All types", options: POST_TYPES }]}
            />
          </Suspense>

          {items.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Megaphone className="h-5 w-5" />}
              title={total === 0 ? "Nothing published yet" : "No content matches your filters"}
              description={
                total === 0
                  ? "Events, news and insights will be published here as Med-Net's activities begin."
                  : "Try adjusting your search or filters."
              }
            />
          ) : (
            <>
              <p className="mt-6 text-xs text-fg-muted">
                {total} item{total === 1 ? "" : "s"} found
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 70} className="h-full">
                    <PostCard
                      post={{
                        slug: p.slug,
                        title: p.title,
                        type: p.type,
                        excerpt: p.excerpt,
                        coverImage: p.coverImage,
                        location: p.location,
                        startAt: p.startAt,
                      }}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </div>
              <Pagination page={currentPage} totalPages={totalPages} basePath="/updates" params={{ q, type }} />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
