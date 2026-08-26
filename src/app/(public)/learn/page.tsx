import type { Metadata } from "next";
import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import LearningCard from "@/components/public/learning-card";
import { SearchFilterBar } from "@/components/ui/search-filter";
import { db } from "@/lib/db";
import { RESOURCE_LEVELS, RESOURCE_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "The Med-Net Learning Hub — articles, guides, tutorials and learning resources on digital health, health informatics, AI in healthcare, research skills and professional development.",
};

const PAGE_SIZE = 9;

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; level?: string; page?: string }>;
}) {
  const { q, type, level, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    published: true,
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { summary: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(type ? { type } : {}),
    ...(level ? { level } : {}),
  };

  const [total, items] = await Promise.all([
    db.learningResource.count({ where }),
    db.learningResource.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
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
              <GraduationCap className="h-3.5 w-3.5" />
              Learning Hub
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Learn what the <span className="text-gradient">future of healthcare</span> requires
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Practical learning resources on digital health, health informatics, artificial intelligence, research
              skills and professional development — built for people who want capabilities they can actually use.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense>
            <SearchFilterBar
              placeholder="Search resources…"
              filters={[
                { name: "type", label: "All types", options: RESOURCE_TYPES },
                { name: "level", label: "Any level", options: RESOURCE_LEVELS },
              ]}
            />
          </Suspense>

          {items.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<GraduationCap className="h-5 w-5" />}
              title={total === 0 ? "The Learning Hub is growing" : "No resources match your filters"}
              description={
                total === 0
                  ? "Learning resources, articles and guides will be added here as Med-Net's education programs develop. Check back soon."
                  : "Try adjusting your search or filters."
              }
            />
          ) : (
            <>
              <p className="mt-6 text-xs text-fg-muted">
                {total} resource{total === 1 ? "" : "s"} found
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r, i) => (
                  <Reveal key={r.id} delay={(i % 3) * 70} className="h-full">
                    <LearningCard
                      item={{
                        slug: r.slug,
                        title: r.title,
                        summary: r.summary,
                        type: r.type,
                        level: r.level,
                        coverImage: r.coverImage,
                      }}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </div>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                basePath="/learn"
                params={{ q, type, level }}
              />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
