import { ArrowUpRight, CalendarClock, Handshake, HeartHandshake, MapPin, UserRoundPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { labelOf, OPPORTUNITY_TYPES } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";

const typeIcon: Record<string, React.ElementType> = {
  VOLUNTEER: HeartHandshake,
  AMBASSADOR: UserRoundPlus,
  COLLABORATION: Handshake,
  APPLICATION: UserRoundPlus,
  OTHER: Handshake,
};

export type OpportunityCardData = {
  slug: string;
  title: string;
  type: string;
  description: string;
  location?: string | null;
  deadline?: Date | string | null;
  applyUrl?: string | null;
  applyEmail?: string | null;
};

export default function OpportunityCard({ item, className }: { item: OpportunityCardData; className?: string }) {
  const Icon = typeIcon[item.type] ?? Handshake;
  const applyHref = item.applyUrl || (item.applyEmail ? `mailto:${item.applyEmail}` : `/community/${item.slug}`);
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <Badge tone="success">Open</Badge>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
        {labelOf(OPPORTUNITY_TYPES, item.type)}
      </p>
      <h3 className="mt-1.5 font-display text-[16.5px] font-semibold leading-snug text-foreground">{item.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{item.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-4 text-xs text-fg-muted">
        {item.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </span>
        )}
        {item.deadline && (
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" /> Apply by {formatDate(item.deadline)}
          </span>
        )}
        <a
          href={applyHref}
          className="ml-auto inline-flex items-center gap-1 font-medium text-accent-strong transition-transform hover:translate-x-0.5"
        >
          Apply
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
