import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";

export default function CtaSection({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center shadow-lg sm:px-12 sm:py-20 dark:bg-[#0d2036]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, var(--accent) 0, transparent 34%), radial-gradient(circle at 85% 85%, var(--accent) 0, transparent 30%)",
                opacity: 0.14,
              }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.07]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-navy-fg sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-navy-fg/70">
                  {subtitle}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href={primaryHref} size="lg" className="bg-accent text-accent-fg hover:bg-accent-strong">
                  {primaryLabel}
                </ButtonLink>
                {secondaryLabel && secondaryHref && (
                  <ButtonLink
                    href={secondaryHref}
                    size="lg"
                    variant="outline"
                    className="border-navy-fg/25 bg-transparent text-navy-fg hover:border-navy-fg/60 hover:text-navy-fg"
                  >
                    {secondaryLabel}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
