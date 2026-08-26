import type { Metadata } from "next";
import {
  Compass,
  Eye,
  Flag,
  GraduationCap,
  Megaphone,
  Microscope,
  ScrollText,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import Reveal from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import CtaSection from "@/components/ui/cta-section";
import GovernanceChart from "@/components/public/governance-chart";
import { WORK_AREAS, VERBS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Med-Net",
  description:
    "Learn about Med-Net Digital Health Collaborative — an emerging Ethiopian civil society organization connecting people, knowledge, technology and innovation to advance healthcare.",
};

const objectives = [
  "Strengthen digital-health knowledge and practical skills among students and young professionals",
  "Encourage and support collaborative research that generates useful evidence",
  "Promote the development of practical, responsible technology solutions for healthcare problems",
  "Connect healthcare, technology, research, academia and innovation communities",
  "Build a sustainable, credible institution with strong governance",
  "Contribute to national and global conversations on digital health and health workforce development",
];

const leadership = [
  { role: "Board of Directors", note: "Composition to be announced as governance formalizes" },
  { role: "Executive Director", note: "Name to be added" },
  { role: "Director of Education & Capacity Building", note: "Name to be added" },
  { role: "Director of Research & Innovation", note: "Name to be added" },
  { role: "Director of Communication & Members", note: "Name to be added" },
  { role: "Finance Officer", note: "Name to be added" },
  { role: "Auditor", note: "Name to be added" },
  { role: "Local Ambassadors", note: "Founding ambassador recruitment underway" },
];

const roadmap = [
  {
    phase: "Now — Building the foundation",
    items: [
      "Finalizing the constitution and governance framework",
      "Formalizing leadership roles and recruiting committed builders",
      "Preparing for CSO registration in Ethiopia",
      "Establishing our digital presence and first programs",
    ],
  },
  {
    phase: "Next — Growing the community",
    items: [
      "Recruiting local ambassadors across institutions and regions",
      "Launching regular education and capacity-building activities",
      "Starting the first collaborative research initiatives",
      "Developing early community-driven digital-health projects",
    ],
  },
  {
    phase: "Later — A recognized ecosystem",
    items: [
      "A large interdisciplinary membership and ambassador network",
      "Established research, publications and policy contributions",
      "A digital learning hub and innovation projects in use",
      "Partnerships with universities, health institutions, NGOs and technology organizations",
    ],
  },
];

const areaIcons: Record<string, React.ElementType> = {
  education: GraduationCap,
  research: Microscope,
  community: Users,
  advocacy: Megaphone,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-16 sm:py-24">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <ScrollText className="h-3.5 w-3.5" />
              About Med-Net
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A collaborative organization for the{" "}
              <span className="text-gradient">digital future of healthcare</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-fg-muted sm:text-lg">
              Med-Net Digital Health Collaborative is an emerging civil society organization being established in
              Ethiopia. We exist because the future of healthcare cannot be built by healthcare professionals alone —
              it requires medicine, public health, technology, research, education, innovation and policy working
              together.
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="story" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <SectionHeader
                eyebrow="Our story"
                title="Built by young people who take healthcare seriously"
              />
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-fg-muted">
                <p>
                  Med-Net began with a simple observation: technology is transforming healthcare — artificial
                  intelligence, health information systems, telemedicine, digital records and data science — yet many
                  students and young professionals in healthcare have few opportunities to develop practical
                  digital-health skills, connect across disciplines, or turn ideas into real solutions.
                </p>
                <p>
                  Rather than accepting that gap, a small founding group set out to build an institution: a
                  collaborative platform where people learn together, research together, and build together — with the
                  seriousness, governance and credibility of an organization intended to last.
                </p>
                <p>
                  Med-Net is young. We say that openly. We are at the founding stage — finalizing our constitution,
                  establishing governance, and preparing for formal registration as a civil society organization. What
                  we lack in history, we make up for in clarity of purpose and commitment to building carefully.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {VERBS.map((verb) => (
                  <div key={verb.word} className="rounded-2xl border border-line bg-card p-4 shadow-sm">
                    <p className="font-display text-sm font-semibold text-accent-strong">{verb.word}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{verb.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="vision" className="scroll-mt-24 border-y border-line bg-card py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Vision",
                text: "Empowered people, connected knowledge, and innovative technology for a better future of healthcare.",
              },
              {
                icon: Target,
                title: "Mission",
                text: "To connect people, knowledge, technology and innovation — through education, research, collaboration and community — to strengthen healthcare in Ethiopia and beyond.",
              },
              {
                icon: Compass,
                title: "Approach",
                text: "Interdisciplinary by design. Practical by intention. Honest about our stage. Ambitious about our direction. Built for the long term.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-background p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <div className="rounded-2xl border border-line bg-background p-7 sm:p-9">
              <p className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                <Flag className="h-4.5 w-4.5 text-accent" />
                Objectives
              </p>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {objectives.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="areas" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="What we do"
            title="Areas of work"
            subtitle="Med-Net is organized around interconnected areas that reinforce one another — learning feeds research, research informs innovation, and community multiplies all of it."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {WORK_AREAS.map((area, i) => {
              const Icon = areaIcons[area.id];
              return (
                <Reveal key={area.id} delay={i * 70}>
                  <div className="flex h-full gap-4 rounded-2xl border border-line bg-card p-6 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-[16px] font-semibold text-foreground">{area.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{area.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="governance" className="scroll-mt-24 border-y border-line bg-card py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Governance"
            title="How Med-Net is organized"
            subtitle="A clear, accountable structure: a Board of Directors provides strategic oversight, an Executive Director leads implementation, and an independent Auditor strengthens financial accountability. Roles are being formalized through our constitution as the organization grows."
            align="center"
          />
          <Reveal className="mt-12">
            <GovernanceChart />
          </Reveal>
          <Reveal className="mt-10">
            <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-fg-muted">
              The formal Med-Net constitution remains the authoritative governance document. This overview is a public
              summary and will be updated as the structure is finalized.
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="leadership" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Leadership"
            title="Leadership as service, not status"
            subtitle="Med-Net leadership roles exist to build and serve — not to hold titles. We are recruiting people who are competent, responsible, honest and committed to the organization's purpose. Names will be announced as roles are formalized."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((role, i) => (
              <Reveal key={role.role} delay={i * 50}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-fg-muted">
                    <Users className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-3.5 font-display text-sm font-semibold leading-snug text-foreground">{role.role}</h3>
                  <p className="mt-1.5 flex-1 text-xs italic leading-relaxed text-fg-muted">{role.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-6 sm:p-7">
              <h3 className="font-display text-base font-semibold text-foreground">
                Interested in helping lead Med-Net?
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                We look for people who take initiative, collaborate well, and want to build something meaningful.
                Leadership openings and ambassador calls are posted in the community section.
              </p>
              <ButtonLink href="/community" size="sm" variant="outline" className="mt-4">
                See current opportunities
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="strategy" className="scroll-mt-24 border-t border-line bg-card py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Strategic direction"
            title="Realistic today. Scalable tomorrow."
            subtitle="We are building the foundation now so the organization can grow into it. Here is an honest view of our direction."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {roadmap.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-background p-6">
                  <p className="font-display text-sm font-semibold text-accent-strong">{phase.phase}</p>
                  <ul className="mt-4 space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Help build what Med-Net becomes."
        subtitle="Founding members, volunteers and partners will shape this organization. The best time to be part of it is at the beginning."
        primaryLabel="Join Med-Net"
        primaryHref="/join"
        secondaryLabel="Get in touch"
        secondaryHref="/contact"
      />
    </>
  );
}
