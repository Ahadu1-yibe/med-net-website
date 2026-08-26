import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { labelOf, POST_TYPES } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";

const typeTone: Record<string, "accent" | "navy" | "success" | "warning"> = {
  EVENT: "accent",
  NEWS: "navy",
  INSIGHT: "success",
  ANNOUNCEMENT: "warning",
};

export type PostCardData = {
  slug: string;
  title: string;
  type: string;
  excerpt: string;
  coverImage?: string | null;
  location?: string | null;
  startAt?: Date | string | null;
};

export default function PostCard({ post, className }: { post: PostCardData; className?: string }) {
  const isEvent = post.type === "EVENT";
  return (
    <Link
      href={`/updates/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-muted">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-dots opacity-70">
            <Newspaper className="h-9 w-9 text-line-strong" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge tone={typeTone[post.type] ?? "neutral"}>{labelOf(POST_TYPES, post.type)}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {isEvent && post.startAt && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-accent-strong">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.startAt, true)}
            {post.location && (
              <span className="inline-flex items-center gap-1 text-fg-muted">
                · <MapPin className="h-3 w-3" /> {post.location}
              </span>
            )}
          </p>
        )}
        <h3 className="mt-2 font-display text-[16.5px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-strong">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 border-t border-line pt-4 text-[13px] font-medium text-accent-strong">
          {isEvent ? "Event details" : "Read more"}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
