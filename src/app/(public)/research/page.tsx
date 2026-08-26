import type { Metadata } from "next";
import { Suspense } from "react";
import { Microscope } from "lucide-react";
import { Container } from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import ResearchCard from "@/components/public/research-card";
import { SearchFilterBar } from "@/components/ui/search-filter";
import CtaSection from "@/components/ui/cta-section";
import { db } from "@/lib/db";
import { RESEARCH_CATEGORIES, RESEARCH_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research & Innovation",
  description:
    "Research initiatives, evidence generation and digital-health innovation from the Med-Net community — studies, publications and health-technology projects.",
};

const PAGE_SIZE = 9;

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; page?: string }>;
}) {
  const { q, category, status, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    published: true,
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { summary: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
  };

  const [total, items] = await Promise.all([
    db.researchItem.count({ where }),
    db.researchItem.findMany({
      where,
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPublishedResearch =
    total === 0 ? (await db.researchItem.count({ where: { published: true } })) > 0 : true;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <Microscope className="h-3.5 w-3.5" />
              Research & Innovation
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Evidence and innovation for <span className="text-gradient">better healthcare</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Med-Net supports collaborative research, evidence generation and the development of digital-health
              solutions — from student research projects to health-technology initiatives.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense>
            <SearchFilterBar
              placeholder="Search research…"
              filters={[
                { name: "category", label: "All areas", options: RESEARCH_CATEGORIES },
                { name: "status", label: "Any status", options: RESEARCH_STATUSES },
              ]}
            />
          </Suspense>

          {items.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Microscope className="h-5 w-5" />}
              title={hasPublishedResearch ? "No research matches your filters" : "Research portfolio in development"}
              description={
                hasPublishedResearch
                  ? "Try adjusting your search or filters."
                  : "Publications, studies and innovation initiatives will appear here as Med-Net's research portfolio develops. Researchers interested in collaborating are welcome to reach out."
              }
            />
          ) : (
            <>
              <p className="mt-6 text-xs text-fg-muted">
                {total} item{total === 1 ? "" : "s"} found
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r, i) => (
                  <Reveal key={r.id} delay={(i % 3) * 70} className="h-full">
                    <ResearchCard
                      item={{
                        slug: r.slug,
                        title: r.title,
                        summary: r.summary,
                        category: r.category,
                        status: r.status,
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
                basePath="/research"
                params={{ q, category, status }}
              />
            </>
          )}
        </Container>
      </section>

      <CtaSection
        title="Researching something that could improve healthcare?"
        subtitle="Med-Net welcomes researchers, students and professionals who want to collaborate on studies and digital-health innovation."
        primaryLabel="Collaborate with us"
        primaryHref="/contact"
        secondaryLabel="Explore projects"
        secondaryHref="/projects"
      />
    </>
  );
}
