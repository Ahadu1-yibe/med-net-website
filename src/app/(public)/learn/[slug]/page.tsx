import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import Markdown from "@/components/ui/markdown";
import LearningCard from "@/components/public/learning-card";
import { db } from "@/lib/db";
import { formatDate, parseArray } from "@/lib/utils";
import { labelOf, RESOURCE_LEVELS, RESOURCE_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getItem(slug: string) {
  return db.learningResource.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug).catch(() => null);
  if (!item) return { title: "Learning resource" };
  return { title: item.title, description: item.summary };
}

export default async function LearnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item || !item.published) notFound();

  const tags = parseArray(item.tags);

  const related = await db.learningResource.findMany({
    where: { published: true, id: { not: item.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <section className="border-b border-line bg-card">
        <Container className="py-10 sm:py-14">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent-strong"
          >
            <ArrowLeft className="h-4 w-4" />
            Learning Hub
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{labelOf(RESOURCE_TYPES, item.type)}</Badge>
            <Badge tone="outline">{labelOf(RESOURCE_LEVELS, item.level)}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(item.publishedAt ?? item.createdAt)}
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
              Open resource
              <ArrowUpRight className="h-4 w-4" />
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
                <article className="mt-10">
                  <Markdown content={item.description} />
                </article>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-card/60 p-8 text-center">
                  <p className="font-display text-base font-semibold text-foreground">Content coming soon</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    This resource is being prepared and will be published shortly.
                  </p>
                </div>
              )}
            </div>
            <aside className="space-y-5">
              {tags.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">Topics</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} tone="neutral">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-5">
                <p className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  Learn with the community
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                  Med-Net members learn together through sessions, discussions and hands-on activities.
                </p>
                <Link
                  href="/join"
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Join Med-Net
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="font-display text-xl font-semibold text-foreground">Continue learning</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <LearningCard
                    key={r.id}
                    item={{
                      slug: r.slug,
                      title: r.title,
                      summary: r.summary,
                      type: r.type,
                      level: r.level,
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
