import { cn } from "@/lib/utils";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: "primary" | "accent" | "outline" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap cursor-pointer",
    {
      sm: "text-xs px-3 h-8",
      md: "text-sm px-4 h-10",
      lg: "text-[15px] px-6 h-12",
    }[size],
    {
      primary:
        "bg-navy text-navy-fg shadow-sm hover:bg-navy-strong hover:shadow-md dark:bg-navy-strong dark:hover:bg-[#20406a]",
      accent: "bg-accent text-accent-fg shadow-sm hover:bg-accent-strong hover:shadow-md",
      outline:
        "border border-line-strong bg-card text-foreground hover:border-accent hover:text-accent-strong",
      ghost: "text-fg-muted hover:text-foreground hover:bg-muted",
      subtle: "bg-muted text-foreground hover:bg-line",
      danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
    }[variant],
    className
  );
}

import Link from "next/link";

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: "primary" | "accent" | "outline" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link href={href} className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
