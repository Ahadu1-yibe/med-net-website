import Link from "next/link";
import { Building2, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import Reveal from "@/components/ui/reveal";
import { labelOf, PARTNER_TIERS } from "@/lib/constants";

export type PartnerData = {
  id: string;
  name: string;
  description: string;
  websiteUrl?: string | null;
  logoImage?: string | null;
  tier: string;
};

export default function PartnerGrid({
  title,
  subtitle,
  partners,
}: {
  title: string;
  subtitle: string;
  partners: PartnerData[];
}) {
  return (
    <section className="py-16 sm:py-20" id="partners">
      <Container>
        <SectionHeader eyebrow="Partnerships" title={title} subtitle={subtitle} align="center" />
        {partners.length === 0 ? (
          <Reveal className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <Handshake className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Partner announcements will appear here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                Partner information will be added as collaborations are formally established. If your organization is
                interested in working with Med-Net, we would like to hear from you.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex h-10 items-center rounded-lg border border-line-strong bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-strong"
              >
                Start a conversation
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex h-16 items-center justify-center rounded-xl border border-line bg-muted px-4">
                    {p.logoImage ? (
                      <img src={p.logoImage} alt={`${p.name} logo`} className="max-h-12 w-auto object-contain" />
                    ) : (
                      <Building2 className="h-7 w-7 text-line-strong" />
                    )}
                  </div>
                  <div className="mt-4 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
                      {labelOf(PARTNER_TIERS, p.tier)}
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold text-foreground">{p.name}</h3>
                    {p.description && <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{p.description}</p>}
                  </div>
                  {p.websiteUrl && (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-[13px] font-medium text-accent-strong hover:underline"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
