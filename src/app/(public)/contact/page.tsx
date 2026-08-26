import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import Reveal from "@/components/ui/reveal";
import ContactForm from "@/components/public/contact-form";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Med-Net Digital Health Collaborative — general inquiries, partnership proposals, membership questions and media requests.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
        <Container className="relative py-14 sm:py-20">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong">
              <Mail className="h-3.5 w-3.5" />
              Contact
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Let's start a <span className="text-gradient">conversation</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
              Questions about Med-Net, partnership proposals, membership questions, media requests — we would like to
              hear from you.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="space-y-4">
                {settings.site.email && (
                  <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <a
                        href={`mailto:${settings.site.email}`}
                        className="mt-0.5 block text-sm text-fg-muted transition-colors hover:text-accent-strong"
                      >
                        {settings.site.email}
                      </a>
                    </div>
                  </div>
                )}
                {settings.site.location && (
                  <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Location</p>
                      <p className="mt-0.5 text-sm text-fg-muted">{settings.site.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Response time</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">
                      We are a young, volunteer-driven team — we typically respond within a few days.
                    </p>
                  </div>
                </div>
                {settings.site.linkedin && (
                  <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 p-5">
                    <p className="text-sm font-semibold text-foreground">Follow Med-Net</p>
                    <a
                      href={settings.site.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm text-accent-strong hover:underline"
                    >
                      Connect with us on LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-3xl border border-line bg-card p-6 shadow-md sm:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground">Send us a message</h2>
                <p className="mt-1.5 text-sm text-fg-muted">Messages go directly to the Med-Net team.</p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
