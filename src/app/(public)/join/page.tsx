import type { Metadata } from "next";
import { BookOpen, CheckCircle2, HandHeart, Network, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";
import JoinForm from "@/components/public/join-form";

export const metadata: Metadata = {
  title: "Join Med-Net",
  description:
    "Join the Med-Net Digital Health Collaborative community — for medical and health science students, healthcare professionals, developers, data scientists, researchers and innovators.",
};

const whoCanJoin = [
  "Medical, nursing, pharmacy, public health and other health science students",
  "Doctors, nurses, pharmacists and other healthcare professionals",
  "Software developers, engineers and computer scientists",
  "Data scientists, AI enthusiasts and technology professionals",
  "Researchers, academics and epidemiologists",
  "Entrepreneurs, product builders and innovators",
  "Designers, communicators, advocates and organizers",
  "Anyone who shares our purpose and wants to contribute",
];

const youCan = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "Access practical digital-health learning, from informatics and AI to research methods and professional skills.",
  },
  {
    icon: Network,
    title: "Connect",
    text: "Meet people across healthcare, technology and research — the collaborators, mentors and peers of your future.",
  },
  {
    icon: HandHeart,
    title: "Contribute",
    text: "Build projects, support research, write content, organize events and help the organization grow.",
  },
  {
    icon: Sparkles,
    title: "Grow",
    text: "Develop leadership, teamwork, project and communication skills by helping build a real institution.",
  },
];

export default function JoinPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <Sparkles className="h-3.5 w-3.5" />
              Join Med-Net
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Don't watch the future of healthcare happen. <span className="text-gradient">Help build it.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Med-Net is at its beginning — and that is exactly what makes joining meaningful. Founding members will
              shape the community, launch the first programs, and build things that outlast them.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {youCan.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-line bg-card p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Who can join?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Med-Net is intentionally interdisciplinary. If you care about better healthcare and are willing to
                learn, contribute and collaborate — you belong here.
              </p>
              <ul className="mt-6 space-y-3">
                {whoCanJoin.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft/50 p-6">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Leadership at Med-Net is service
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
                  We are not collecting titles. Members who take on responsibility do so to build and serve — and in
                  return gain real experience in leadership, project management, research and organizational
                  development. If you want to contribute meaningfully, tell us in your application.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-3xl border border-line bg-card p-6 shadow-md sm:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground">Membership application</h2>
                <p className="mt-1.5 text-sm text-fg-muted">
                  Tell us who you are and why you want to be part of Med-Net.
                </p>
                <div className="mt-6">
                  <JoinForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
