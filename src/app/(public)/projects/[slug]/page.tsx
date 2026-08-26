import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Crosshair,
  CalendarDays,
  Compass,
  ExternalLink,
  Github,
  Lightbulb,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import Markdown from "@/components/ui/markdown";
import ProjectCard from "@/components/public/project-card";
import { db } from "@/lib/db";
import { formatDate, parseArray } from "@/lib/utils";
import { labelOf, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return db.project.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary };
}

const statusTone: Record<string, "accent" | "success" | "warning" | "neutral"> = {
  planned: "warning",
  "in-progress": "accent",
  completed: "success",
  archived: "neutral",
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.published) notFound();

  const technologies = parseArray(project.technologies);
  const team = parseArray(project.team);
  const tags = parseArray(project.tags);
  const gallery = parseArray(project.gallery);

  const related = await db.project.findMany({
    where: { published: true, id: { not: project.id }, category: project.category },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  const sections = [
    { icon: Crosshair, title: "The problem", body: project.problem },
    { icon: Compass, title: "Our approach", body: project.approach },
    { icon: Target, title: "Impact & goals", body: project.impact },
  ].filter((s) => s.body?.trim());

  return (
    <>
      <section className="border-b border-line bg-card">
        <Container className="py-10 sm:py-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent-strong"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[project.status] ?? "neutral"}>
              {labelOf(PROJECT_STATUSES, project.status)}
            </Badge>
            <Badge tone="accent">{labelOf(PROJECT_CATEGORIES, project.category)}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
              <CalendarDays className="h-3.5 w-3.5" />
              Updated {formatDate(project.updatedAt)}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg-muted">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-strong"
              >
                Access project
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-strong"
              >
                <Github className="h-4 w-4" />
                Repository
              </a>
            )}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0">
              {project.coverImage && (
                <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
                  <img src={project.coverImage} alt={project.title} className="aspect-[16/8] w-full object-cover" />
                </div>
              )}

              {sections.length > 0 && (
                <div className="mt-10 grid gap-4">
                  {sections.map((s) => (
                    <div key={s.title} className="rounded-2xl border border-line bg-card p-6 shadow-sm">
                      <p className="flex items-center gap-2.5 font-display text-base font-semibold text-foreground">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                          <s.icon className="h-4 w-4" />
                        </span>
                        {s.title}
                      </p>
                      <div className="mt-3">
                        <Markdown content={s.body} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {project.description?.trim() && (
                <div className="mt-10">
                  <h2 className="font-display text-xl font-semibold text-foreground">About this project</h2>
                  <div className="mt-4">
                    <Markdown content={project.description} />
                  </div>
                </div>
              )}

              {gallery.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-xl font-semibold text-foreground">Gallery</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {gallery.map((src, i) => (
                      <div key={i} className="overflow-hidden rounded-xl border border-line">
                        <img src={src} alt={`${project.title} — image ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              {technologies.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Wrench className="h-4 w-4 text-accent" />
                    Technologies
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {technologies.map((t) => (
                      <Badge key={t} tone="outline">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {team.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    Project team
                  </p>
                  <ul className="mt-3 space-y-2">
                    {team.map((member) => (
                      <li key={member} className="flex items-center gap-2.5 text-sm text-fg-muted">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-fg-muted">
                          {member.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tags.length > 0 && (
                <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} tone="neutral">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-5">
                <p className="font-display text-sm font-semibold text-foreground">Want to contribute?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                  Med-Net projects are built by volunteers and members with all kinds of skills.
                </p>
                <Link
                  href="/join"
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong hover:underline"
                >
                  Join the community
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="font-display text-xl font-semibold text-foreground">Related projects</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={{
                      slug: p.slug,
                      title: p.title,
                      summary: p.summary,
                      category: p.category,
                      status: p.status,
                      coverImage: p.coverImage,
                      tags: parseArray(p.tags),
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
