import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-muted text-fg-muted border-line",
  accent: "bg-accent-soft text-accent-strong border-accent/25 dark:text-accent",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/25",
  navy: "bg-navy/10 text-navy border-navy/20 dark:bg-white/5 dark:text-foreground dark:border-line",
  outline: "bg-transparent text-fg-muted border-line-strong",
} as const;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
