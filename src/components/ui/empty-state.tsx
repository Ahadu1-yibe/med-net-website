import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  compact = false,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-card/60 text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{description}</p>}
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} variant="outline" size="sm" className="mt-5">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
