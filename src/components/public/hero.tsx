import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Sparkles, ArrowRight, GraduationCap, FlaskConical, Lightbulb, Users } from "lucide-react";

function NetworkArt() {
  const nodes = [
    { x: 260, y: 60, r: 7, tone: "navy" },
    { x: 420, y: 130, r: 9, tone: "accent" },
    { x: 455, y: 300, r: 7, tone: "navy" },
    { x: 350, y: 420, r: 8, tone: "accent" },
    { x: 160, y: 430, r: 6, tone: "navy" },
    { x: 60, y: 320, r: 8, tone: "accent" },
    { x: 75, y: 140, r: 7, tone: "navy" },
    { x: 200, y: 230, r: 10, tone: "accent" },
  ];
  const links: [number, number][] = [
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [0, 1], [1, 2], [3, 4], [5, 6], [2, 3],
  ];

  return (
    <svg viewBox="0 0 520 480" className="h-auto w-full" role="img" aria-label="A network of connected people and disciplines">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="240" r="230" fill="url(#glow)" />
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--line-strong)"
          strokeWidth="1.5"
          className="flow-line"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i} style={{ color: n.tone === "accent" ? "var(--accent)" : "var(--navy)" }}>
          {n.tone === "accent" && (
            <circle cx={n.x} cy={n.y} r={n.r} fill="currentColor" className="pulse-node" style={{ animationDelay: `${i * 0.4}s` }} />
          )}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.tone === "accent" ? "var(--accent)" : "var(--navy)"} />
          <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
        </g>
      ))}
      <g transform="translate(260 240)">
        <circle r="34" fill="var(--card)" stroke="var(--accent)" strokeWidth="2" />
        <path d="M-9 0h6v-9h6v9h6v6h-6v9h-6v-9h-6z" fill="var(--accent)" transform="scale(1.05)" />
      </g>
      <path
        d="M40 468h90l12-22 16 40 14-52 14 34h294"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

const chips = [
  { label: "Education", icon: GraduationCap, className: "left-0 top-10 float-soft" },
  { label: "Research", icon: FlaskConical, className: "right-0 top-32 float-soft-delayed" },
  { label: "Innovation", icon: Lightbulb, className: "left-2 bottom-24 float-soft-delayed" },
  { label: "Community", icon: Users, className: "right-4 bottom-8 float-soft" },
];

export default function Hero({
  badge,
  titleTop,
  titleHighlight,
  titleBottom,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  badge: string;
  titleTop: string;
  titleHighlight: string;
  titleBottom: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.35] dark:opacity-[0.12]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 65%)" }}
      />
      <Container className="relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-strong dark:text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              {titleTop}{" "}
              <span className="text-gradient">{titleHighlight}</span>{" "}
              {titleBottom}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={primaryHref} size="lg">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={secondaryHref} size="lg" variant="outline">
                {secondaryLabel}
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-fg-muted/80">
              A youth-driven civil society organization in the founding stage — building carefully, growing honestly.
            </p>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[520px] sm:block lg:max-w-none">
            <NetworkArt />
            {chips.map((chip) => (
              <div
                key={chip.label}
                className={`card-surface absolute z-10 flex items-center gap-2 rounded-xl px-3 py-2 shadow-md ${chip.className}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                  <chip.icon className="h-4 w-4" />
                </span>
                <span className="text-[13px] font-medium text-foreground">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
