import type { Metadata } from "next";
import { Suspense } from "react";
import { Layers } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import Reveal from "@/components/ui/reveal";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import ProjectCard from "@/components/public/project-card";
import { SearchFilterBar } from "@/components/ui/search-filter";
import { db } from "@/lib/db";
import { parseArray } from "@/lib/utils";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Digital-health projects built by the Med-Net community — initiatives that apply technology, research and education to real healthcare challenges.",
};

const PAGE_SIZE = 9;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; page?: string }>;
}) {
  const { q, category, status, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where = {
    published: true,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { summary: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
  };

  const [total, projects] = await Promise.all([
    db.project.count({ where }),
    db.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
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
              <Layers className="h-3.5 w-3.5" />
              Projects
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Building solutions for <span className="text-gradient">real healthcare problems</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Med-Net projects turn learning into action — digital-health tools, educational programs, research
              initiatives and community solutions built collaboratively by our community.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense>
            <SearchFilterBar
              placeholder="Search projects…"
              filters={[
                { name: "category", label: "All categories", options: PROJECT_CATEGORIES },
                { name: "status", label: "Any status", options: PROJECT_STATUSES },
              ]}
            />
          </Suspense>

          {projects.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Layers className="h-5 w-5" />}
              title={total === 0 ? "The project portfolio is starting" : "No projects match your filters"}
              description={
                total === 0
                  ? "Project information will appear here as Med-Net's community-built initiatives are announced. The foundation is being laid now."
                  : "Try adjusting your search or filters to find what you're looking for."
              }
            />
          ) : (
            <>
              <p className="mt-6 text-xs text-fg-muted">
                {total} project{total === 1 ? "" : "s"} found
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 70} className="h-full">
                    <ProjectCard
                      project={{
                        slug: p.slug,
                        title: p.title,
                        summary: p.summary,
                        category: p.category,
                        status: p.status,
                        coverImage: p.coverImage,
                        tags: parseArray(p.tags),
                      }}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </div>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                basePath="/projects"
                params={{ q, category, status }}
              />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
