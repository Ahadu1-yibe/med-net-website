import { Landmark, UserRound, ShieldCheck, GraduationCap, Microscope, Megaphone, Wallet, Users2, Network } from "lucide-react";
import { cn } from "@/lib/utils";

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  placeholder,
  variant = "default",
  className,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  variant?: "default" | "board" | "independent" | "community";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center rounded-2xl border px-5 py-5 text-center shadow-sm transition-shadow hover:shadow-md",
        variant === "board" && "border-navy/25 bg-navy text-navy-fg dark:border-line",
        variant === "independent" && "border-dashed border-line-strong bg-card",
        variant === "community" && "border-accent/30 bg-accent-soft",
        variant === "default" && "border-line bg-card",
        className
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          variant === "board" ? "bg-white/10 text-accent" : "bg-accent-soft text-accent-strong",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className={cn("mt-3 text-sm font-semibold leading-snug", variant === "board" ? "text-navy-fg" : "text-foreground")}>
        {title}
      </p>
      {subtitle && (
        <p className={cn("mt-1 text-xs leading-relaxed", variant === "board" ? "text-navy-fg/70" : "text-fg-muted")}>
          {subtitle}
        </p>
      )}
      {placeholder && (
        <p className={cn("mt-2 inline-flex items-center gap-1 text-[11px] italic", variant === "board" ? "text-navy-fg/60" : "text-fg-muted/80")}>
          <UserRound className="h-3 w-3" />
          {placeholder}
        </p>
      )}
    </div>
  );
}

function Connector({ className }: { className?: string }) {
  return <div aria-hidden className={cn("mx-auto h-7 w-px bg-line-strong", className)} />;
}

export default function GovernanceChart() {
  return (
    <div className="mx-auto max-w-4xl">
      <RoleCard
        icon={Landmark}
        title="Board of Directors"
        subtitle="Highest governing body — provides strategic direction and oversight"
        variant="board"
        placeholder="Composition to be announced"
        className="mx-auto max-w-md"
      />
      <Connector />
      <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <RoleCard
          icon={UserRound}
          title="Executive Director"
          subtitle="Leads strategy implementation, operations and programs"
          placeholder="Name to be added"
          className="sm:col-start-1"
        />
        <div aria-hidden className="hidden items-center sm:flex">
          <div className="h-px w-full border-t border-dashed border-line-strong" />
        </div>
        <RoleCard
          icon={ShieldCheck}
          title="Auditor"
          subtitle="Independent oversight of finances and accountability"
          placeholder="Name to be added"
          variant="independent"
          className="sm:col-start-3"
        />
      </div>
      <Connector />
      <div className="grid gap-4 sm:grid-cols-3">
        <RoleCard
          icon={GraduationCap}
          title="Director of Education & Capacity Building"
          subtitle="Learning programs and practical skills development"
          placeholder="Name to be added"
        />
        <RoleCard
          icon={Microscope}
          title="Director of Research & Innovation"
          subtitle="Research initiatives and solution development"
          placeholder="Name to be added"
        />
        <RoleCard
          icon={Megaphone}
          title="Director of Communication & Members"
          subtitle="Community growth, communication and member engagement"
          placeholder="Name to be added"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-start-2">
          <Connector />
          <RoleCard
            icon={Network}
            title="Local Ambassadors"
            subtitle="Represent Med-Net and grow the community locally"
            placeholder="Recruiting"
            className="mx-auto max-w-sm"
          />
        </div>
      </div>
      <Connector />
      <div className="mx-auto max-w-md">
        <RoleCard
          icon={Users2}
          title="Members"
          subtitle="The broader Med-Net community — students, professionals, researchers, innovators"
          variant="community"
        />
      </div>
      <div className="mx-auto mt-6 max-w-md">
        <RoleCard
          icon={Wallet}
          title="Finance Officer"
          subtitle="Financial management and stewardship, reporting to the Executive Director"
          placeholder="Name to be added"
          className="mx-auto max-w-sm border-dashed"
        />
      </div>
    </div>
  );
}
