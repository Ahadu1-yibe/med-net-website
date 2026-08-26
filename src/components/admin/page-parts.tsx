import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  tone?: "default" | "accent" | "warning" | "success";
}) {
  const content = (
    <div
      className={cn(
        "flex h-full items-start gap-4 rounded-2xl border p-5 shadow-sm transition-all",
        href && "hover:-translate-y-0.5 hover:shadow-md",
        tone === "accent" && "border-accent/30 bg-accent-soft/40",
        tone === "warning" && "border-warning/30 bg-warning/5",
        tone === "success" && "border-success/30 bg-success/5",
        tone === "default" && "border-line bg-card"
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            tone === "accent" ? "bg-accent text-accent-fg" : "bg-muted text-fg-muted"
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold leading-none text-foreground">{value}</p>
        {hint && <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
      </div>
    </div>
  );
  return href ? <a href={href} className="block h-full">{content}</a> : content;
}
