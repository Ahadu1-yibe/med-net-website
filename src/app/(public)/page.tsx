import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  GraduationCap,
  Handshake,
  Lightbulb,
  Megaphone,
  Microscope,
  Newspaper,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import Reveal from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import Hero from "@/components/public/hero";
import ProjectCard from "@/components/public/project-card";
import ResearchCard from "@/components/public/research-card";
import PostCard from "@/components/public/post-card";
import PartnerGrid from "@/components/public/partner-grid";
import CtaSection from "@/components/ui/cta-section";
import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { WORK_AREAS, VERBS } from "@/lib/constants";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

const areaIcons: Record<string, React.ElementType> = {
  education: GraduationCap,
  research: Microscope,
  community: Users,
  advocacy: Megaphone,
};

export default async function HomePage() {
  const settings = await getSettings();
  const hp = settings.homepage;

  const [featuredProjects, latestResearch, upcomingEvents, latestNews, partners] = await Promise.all([
    db.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 3,
    }),
    db.researchItem.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 3,
    }),
    db.post.findMany({
      where: { published: true, type: "EVENT", startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 2,
    }),
    db.post.findMany({
      where: { published: true, type: { in: ["NEWS", "ANNOUNCEMENT", "INSIGHT"] } },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    db.partner.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
  ]);

  return (
    <>
      <Hero {...hp.hero} />

      {hp.intro.visible && (
        <section className="border-y border-line bg-card py-16 sm:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal>
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  <span className="inline-block h-px w-6 bg-accent" aria-hidden />
                  What is Med-Net?
                </p>
                <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                  {hp.intro.title}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-fg-muted">{hp.intro.body}</p>
                <ul className="mt-6 space-y-3">
                  {hp.intro.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={120}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                  {VERBS.map((verb) => (
                    <div
                      key={verb.word}
                      className="group rounded-2xl border border-line bg-background p-4 transition-all duration-300 hover:border-accent/40 hover:shadow-sm"
                    >
                      <p className="font-display text-sm font-semibold text-accent-strong">{verb.word}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{verb.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {hp.areas.visible && (
        <section className="py-16 sm:py-24">
          <Container>
            <SectionHeader eyebrow="Areas of work" title={hp.areas.title} subtitle={hp.areas.subtitle} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WORK_AREAS.map((area, i) => {
                const Icon = areaIcons[area.id];
                return (
                  <Reveal key={area.id} delay={i * 80}>
                    <Link
                      href={area.href}
                      className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-display text-[16px] font-semibold leading-snug text-foreground">
                        {area.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{area.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong">
                        Explore
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {hp.projects.visible && (
        <section className="border-y border-line bg-card py-16 sm:py-24">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader eyebrow="Projects" title={hp.projects.title} subtitle={hp.projects.subtitle} />
              <ButtonLink href="/projects" variant="outline" size="sm" className="mb-1">
                All projects
                <ArrowRight className="h-3.5 w-3.5" />
              </ButtonLink>
            </div>
            {featuredProjects.length === 0 ? (
              <EmptyState
                className="mt-10"
                icon={<Lightbulb className="h-5 w-5" />}
                title="Project portfolio coming together"
                description="Med-Net's first community-built projects will be presented here. The foundation is being laid now."
              />
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((p, i) => (
                  <Reveal key={p.id} delay={i * 80} className="h-full">
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
            )}
          </Container>
        </section>
      )}

      {(hp.research.visible || hp.updates.visible) && (
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              {hp.research.visible && (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <SectionHeader eyebrow="Research" title={hp.research.title} />
                    <ButtonLink href="/research" variant="ghost" size="sm" className="mb-1">
                      All research
                      <ArrowRight className="h-3.5 w-3.5" />
                    </ButtonLink>
                  </div>
                  {latestResearch.length === 0 ? (
                    <EmptyState
                      compact
                      className="mt-8"
                      icon={<Microscope className="h-5 w-5" />}
                      title="Research portfolio in development"
                      description="Publications and studies will appear here as Med-Net's research portfolio develops."
                    />
                  ) : (
                    <div className="mt-8 space-y-4">
                      {latestResearch.map((r, i) => (
                        <Reveal key={r.id} delay={i * 70}>
                          <ResearchCard
                            item={{
                              slug: r.slug,
                              title: r.title,
                              summary: r.summary,
                              category: r.category,
                              status: r.status,
                              coverImage: r.coverImage,
                            }}
                          />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {hp.updates.visible && (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <SectionHeader eyebrow="Stay updated" title={hp.updates.title} />
                    <ButtonLink href="/updates" variant="ghost" size="sm" className="mb-1">
                      Everything
                      <ArrowRight className="h-3.5 w-3.5" />
                    </ButtonLink>
                  </div>
                  <div className="mt-8 space-y-4">
                    {upcomingEvents.map((p, i) => (
                      <Reveal key={p.id} delay={i * 70}>
                        <Link
                          href={`/updates/${p.slug}`}
                          className="group flex items-start gap-4 rounded-2xl border border-accent/30 bg-accent-soft/60 p-4 transition-all hover:border-accent/60"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-accent-strong shadow-sm">
                            <CalendarDays className="h-5 w-5" />
                          </span>
                          <span>
                            <Badge tone="accent" className="mb-1.5">Upcoming event</Badge>
                            <span className="block font-display text-[15px] font-semibold leading-snug text-foreground group-hover:text-accent-strong">
                              {p.title}
                            </span>
                            <span className="mt-1 block text-xs text-fg-muted">{p.excerpt}</span>
                          </span>
                        </Link>
                      </Reveal>
                    ))}
                    {latestNews.map((p, i) => (
                      <Reveal key={p.id} delay={i * 70}>
                        <Link
                          href={`/updates/${p.slug}`}
                          className="group flex items-start gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm transition-all hover:border-accent/40"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-fg-muted">
                            <Newspaper className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block font-display text-[15px] font-semibold leading-snug text-foreground group-hover:text-accent-strong">
                              {p.title}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-fg-muted">{p.excerpt}</span>
                          </span>
                        </Link>
                      </Reveal>
                    ))}
                    {upcomingEvents.length === 0 && latestNews.length === 0 && (
                      <EmptyState
                        compact
                        icon={<Megaphone className="h-5 w-5" />}
                        title="No announcements yet"
                        description="News, events and insights will be published here as activity begins."
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {hp.community.visible && (
        <section className="border-y border-line bg-card py-16 sm:py-24">
          <Container>
            <SectionHeader eyebrow="Community" title={hp.community.title} subtitle={hp.community.subtitle} align="center" />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: UserRoundPlus,
                  title: "Become a member",
                  text: "Join an interdisciplinary community learning and building at the intersection of healthcare and technology.",
                  href: "/join",
                  cta: "Apply to join",
                },
                {
                  icon: Handshake,
                  title: "Volunteer & contribute",
                  text: "Help organize programs, write content, build tools, or support research — every skill matters.",
                  href: "/community",
                  cta: "See opportunities",
                },
                {
                  icon: Compass,
                  title: "Partner with Med-Net",
                  text: "Universities, institutions and organizations can collaborate with us on shared goals.",
                  href: "/contact",
                  cta: "Start a conversation",
                },
              ].map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-background p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                      <card.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{card.text}</p>
                    <Link
                      href={card.href}
                      className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong transition-transform hover:translate-x-0.5"
                    >
                      {card.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {hp.partners.visible && (
        <PartnerGrid title={hp.partners.title} subtitle={hp.partners.subtitle} partners={partners} />
      )}

      {hp.cta.visible && (
        <CtaSection
          title={hp.cta.title}
          subtitle={hp.cta.subtitle}
          primaryLabel={hp.cta.primaryLabel}
          primaryHref={hp.cta.primaryHref}
          secondaryLabel={hp.cta.secondaryLabel}
          secondaryHref={hp.cta.secondaryHref}
        />
      )}
    </>
  );
}
