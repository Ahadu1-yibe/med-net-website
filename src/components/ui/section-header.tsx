import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/reveal";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong"
          style={align === "center" ? { justifyContent: "center" } : undefined}>
          <span className="inline-block h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
          {align === "center" && <span className="inline-block h-px w-6 bg-accent" aria-hidden />}
        </p>
      )}
      <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{subtitle}</p>}
    </Reveal>
  );
}
