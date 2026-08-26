import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import Markdown from "@/components/ui/markdown";
import ResearchCard from "@/components/public/research-card";
import { db } from "@/lib/db";
import { formatDate, parseArray } from "@/lib/utils";
import { labelOf, RESEARCH_CATEGORIES, RESEARCH_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getItem(slug: string) {
  return db.researchItem.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug).catch(() => null);
  if (!item) return { title: "Research" };
  return { title: item.title, description: item.summary };
}

const statusTone: Record<string, "accent" | "success" | "warning" | "neutral"> = {
  proposed: "warning",
  ongoing: "accent",
  completed: "success",
  published: "success",
};

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item || !item.published) notFound();

  const authors = parseArray(item.authors);
  const tags = parseArray(item.tags);

  const related = await db.researchItem.findMany({
    where: { published: true, id: { not: item.id }, category: item.category },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <section className="border-b border-line bg-card">
        <Container className="py-10 sm:py-14">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent-strong"
          >
            <ArrowLeft className="h-4 w-4" />
            Research & Innovation
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[item.status] ?? "neutral"}>{labelOf(RESEARCH_STATUSES, item.status)}</Badge>
            <Badge tone="accent">{labelOf(RESEARCH_CATEGORIES, item.category)}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              Updated {formatDate(item.updatedAt)}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted">{item.summary}</p>
          {item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-strong"
            >
              <FileText className="h-4 w-4" />
              View publication or resource
            </a>
          )}
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0">
              {item.coverImage && (
                <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
                  <img src={item.coverImage} alt={item.title} className="aspect-[16/8] w-full object-cover" />
                </div>
              )}
              {item.description?.trim() ? (
                <div className="mt-10">
                  <Markdown content={item.description} />
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-card/60 p-8 text-center">
                  <p className="font-display text-base font-semibold text-foreground">Details coming soon</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    Full information about this research initiative will be published as the work progresses.
                  </p>
                </div>
              )}
            </div>
            <aside className="space-y-5">
              {authors.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    Authors & contributors
                  </p>
                  <ul className="mt-3 space-y-2">
                    {authors.map((a) => (
                      <li key={a} className="flex items-center gap-2.5 text-sm text-fg-muted">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-fg-muted">
                          {a.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tags.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} tone="neutral">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-5">
                <p className="font-display text-sm font-semibold text-foreground">Interested in research with Med-Net?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                  We support student research, collaborative studies and evidence generation.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong hover:underline"
                >
                  Start a conversation
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="font-display text-xl font-semibold text-foreground">Related research</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <ResearchCard
                    key={r.id}
                    item={{
                      slug: r.slug,
                      title: r.title,
                      summary: r.summary,
                      category: r.category,
                      status: r.status,
                      coverImage: r.coverImage,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
