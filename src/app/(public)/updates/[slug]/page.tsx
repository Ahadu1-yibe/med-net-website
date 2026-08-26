import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CalendarClock, MapPin, Tag, UserRoundPlus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import Markdown from "@/components/ui/markdown";
import PostCard from "@/components/public/post-card";
import { db } from "@/lib/db";
import { formatDate, parseArray } from "@/lib/utils";
import { labelOf, POST_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return db.post.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Updates" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const isPublished =
    post &&
    post.published &&
    (!post.publishAt || post.publishAt <= new Date());
  if (!post || !isPublished) notFound();

  const tags = parseArray(post.tags);
  const isEvent = post.type === "EVENT";
  const upcoming = isEvent && post.startAt && post.startAt > new Date();

  const related = await db.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <section className="border-b border-line bg-card">
        <Container className="py-10 sm:py-14">
          <Link
            href="/updates"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent-strong"
          >
            <ArrowLeft className="h-4 w-4" />
            Events, News & Insights
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{labelOf(POST_TYPES, post.type)}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              Published {formatDate(post.publishAt ?? post.createdAt)}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted">{post.excerpt}</p>
          {isEvent && (post.startAt || post.location) && (
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-accent/30 bg-accent-soft/50 px-5 py-4 text-sm">
              {post.startAt && (
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <CalendarDays className="h-4 w-4 text-accent-strong" />
                  {formatDate(post.startAt, true)}
                  {post.endAt && (
                    <span className="text-fg-muted">
                      – {formatDate(post.endAt, true)}
                    </span>
                  )}
                </span>
              )}
              {post.location && (
                <span className="inline-flex items-center gap-2 text-fg-muted">
                  <MapPin className="h-4 w-4 text-accent-strong" />
                  {post.location}
                </span>
              )}
              {upcoming && (
                <Badge tone="accent" className="ml-auto">
                  <CalendarClock className="h-3 w-3" />
                  Upcoming
                </Badge>
              )}
            </div>
          )}
          {upcoming && post.registrationUrl && (
            <div className="mt-5">
              <ButtonLink href={post.registrationUrl} target="_blank" rel="noopener noreferrer">
                <UserRoundPlus className="h-4 w-4" />
                Register for this event
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0">
              {post.coverImage && (
                <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
                  <img src={post.coverImage} alt={post.title} className="aspect-[16/8] w-full object-cover" />
                </div>
              )}
              {post.description?.trim() ? (
                <article className="mt-10">
                  <Markdown content={post.description} />
                </article>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-card/60 p-8 text-center">
                  <p className="font-display text-base font-semibold text-foreground">Full story coming soon</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    Additional details about this will be published shortly.
                  </p>
                </div>
              )}
            </div>
            <aside className="space-y-5">
              {tags.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Tag className="h-4 w-4 text-accent" />
                    Topics
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} tone="neutral">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="font-display text-xl font-semibold text-foreground">More from Med-Net</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard
                    key={p.id}
                    post={{
                      slug: p.slug,
                      title: p.title,
                      type: p.type,
                      excerpt: p.excerpt,
                      coverImage: p.coverImage,
                      location: p.location,
                      startAt: p.startAt,
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
