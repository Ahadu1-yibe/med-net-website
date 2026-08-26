import Link from "next/link";
import { ArrowUpRight, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { labelOf, RESEARCH_CATEGORIES, RESEARCH_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const statusTone: Record<string, "accent" | "success" | "warning" | "neutral"> = {
  proposed: "warning",
  ongoing: "accent",
  completed: "success",
  published: "success",
};

export type ResearchCardData = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  coverImage?: string | null;
};

export default function ResearchCard({ item, className }: { item: ResearchCardData; className?: string }) {
  return (
    <Link
      href={`/research/${item.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <Microscope className="h-4.5 w-4.5" />
        </span>
        <Badge tone={statusTone[item.status] ?? "neutral"}>{labelOf(RESEARCH_STATUSES, item.status)}</Badge>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
        {labelOf(RESEARCH_CATEGORIES, item.category)}
      </p>
      <h3 className="mt-2 font-display text-[16.5px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-strong">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 border-t border-line pt-4 text-[13px] font-medium text-accent-strong">
        View research
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
