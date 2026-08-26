import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  HeartHandshake,
  Handshake,
  MapPin,
  Megaphone,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import Reveal from "@/components/ui/reveal";
import EmptyState from "@/components/ui/empty-state";
import CtaSection from "@/components/ui/cta-section";
import OpportunityCard from "@/components/public/opportunity-card";
import PartnerGrid from "@/components/public/partner-grid";
import { db } from "@/lib/db";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community & Opportunities",
  description:
    "Join the Med-Net community — volunteer opportunities, local ambassador calls, collaborations and partnerships at the intersection of healthcare and technology.",
};

const waysToEngage = [
  {
    icon: UserRoundPlus,
    title: "Become a member",
    text: "Join an interdisciplinary community of students, professionals and innovators working at the intersection of healthcare and technology.",
    href: "/join",
    cta: "Apply to join",
  },
  {
    icon: Megaphone,
    title: "Become a local ambassador",
    text: "Represent Med-Net at your institution or region, grow the local community, and help organize activities.",
    href: "/join",
    cta: "Express interest",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer your skills",
    text: "Writing, design, software development, research, event organization — every skill helps build the organization.",
    href: "#opportunities",
    cta: "See open roles",
  },
  {
    icon: Handshake,
    title: "Partner with us",
    text: "Universities, health institutions, NGOs, CSOs and technology organizations can collaborate on shared goals.",
    href: "#partners",
    cta: "Partner with Med-Net",
  },
];

export default async function CommunityPage() {
  const [opportunities, partners] = await Promise.all([
    db.opportunity.findMany({
      where: { published: true, status: "OPEN" },
      orderBy: [{ featured: "desc" }, { deadline: "asc" }, { createdAt: "desc" }],
    }),
    db.partner.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <Users className="h-3.5 w-3.5" />
              Community & Opportunities
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              This is where <span className="text-gradient">people connect</span> with Med-Net
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Med-Net is growing its founding community. Whether you study medicine, write software, analyze data,
              conduct research or drive innovation — there is a meaningful way to participate.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Ways to engage"
            title="Four ways to be part of Med-Net"
            subtitle="Participation is not limited to membership. Choose the way that fits your skills, time and ambitions."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {waysToEngage.map((way, i) => (
              <Reveal key={way.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                    <way.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{way.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{way.text}</p>
                  <a
                    href={way.href}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong transition-transform hover:translate-x-0.5"
                  >
                    {way.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="opportunities" className="scroll-mt-24 border-y border-line bg-card py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Open opportunities"
            title="Current calls & roles"
            subtitle="Applications, volunteer roles and collaboration calls. Opportunities are posted here as they open — closed calls are removed."
          />
          {opportunities.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Handshake className="h-5 w-5" />}
              title="No open opportunities right now"
              description="New opportunities, volunteer calls and applications will be posted here as Med-Net grows. You can still apply to become a member at any time."
              actionLabel="Join Med-Net"
              actionHref="/join"
            />
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o, i) => (
                <Reveal key={o.id} delay={(i % 3) * 70} className="h-full">
                  <OpportunityCard
                    item={{
                      slug: o.slug,
                      title: o.title,
                      type: o.type,
                      description: o.description,
                      location: o.location,
                      deadline: o.deadline,
                      applyUrl: o.applyUrl,
                      applyEmail: o.applyEmail,
                    }}
                    className="h-full"
                  />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal className="mt-8">
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-background p-6 sm:flex-row">
              <p className="flex items-center gap-2.5 text-sm text-fg-muted">
                <CalendarClock className="h-4.5 w-4.5 shrink-0 text-accent" />
                Nothing fits right now? Membership applications are always open.
              </p>
              <ButtonLink href="/join" size="sm" variant="outline">
                Join Med-Net
                <ArrowRight className="h-3.5 w-3.5" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <PartnerGrid
        title="Our partners & collaborators"
        subtitle="Med-Net works with institutions and organizations that share our commitment to better healthcare through digital health."
        partners={partners}
      />

      <section className="border-t border-line bg-card py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeader
                eyebrow="Local ambassadors"
                title="Grow Med-Net where you are"
                subtitle="Local ambassadors are the connective tissue of the Med-Net community — representing the organization at universities, hospitals and regions across Ethiopia, organizing local activities, and helping new members find their place."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Represent Med-Net at your institution or in your region",
                  "Organize local sessions, meetups and community activities",
                  "Connect students and professionals to national programs",
                  "Develop leadership, communication and organizing skills",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-3xl border border-line bg-background p-7 shadow-sm sm:p-9">
                <h3 className="font-display text-lg font-semibold text-foreground">Ambassador recruitment</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Founding ambassador recruitment is underway. When formal calls open, they will be posted in the
                  opportunities section. You can also express your interest directly through the join form.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href="/join" size="sm">
                    Express interest
                  </ButtonLink>
                  <ButtonLink href="#opportunities" size="sm" variant="outline">
                    View opportunities
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaSection
        title="Every serious organization starts with its first believers."
        subtitle="Join the people building Med-Net from the ground up — or bring your organization into the network."
        primaryLabel="Join Med-Net"
        primaryHref="/join"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />
    </>
  );
}
