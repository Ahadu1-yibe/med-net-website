import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { labelOf, RESOURCE_LEVELS, RESOURCE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type LearningCardData = {
  slug: string;
  title: string;
  summary: string;
  type: string;
  level: string;
  coverImage?: string | null;
};

export default function LearningCard({ item, className }: { item: LearningCardData; className?: string }) {
  return (
    <Link
      href={`/learn/${item.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
          <BookOpen className="h-4.5 w-4.5" />
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="accent">{labelOf(RESOURCE_TYPES, item.type)}</Badge>
          <Badge tone="outline">{labelOf(RESOURCE_LEVELS, item.level)}</Badge>
        </div>
      </div>
      <h3 className="mt-4 font-display text-[16.5px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-strong">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 border-t border-line pt-4 text-[13px] font-medium text-accent-strong">
        Open resource
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
