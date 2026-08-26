import Link from "next/link";
import { ArrowUpRight, Github, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { labelOf, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const statusTone: Record<string, "accent" | "success" | "warning" | "neutral"> = {
  planned: "warning",
  "in-progress": "accent",
  completed: "success",
  archived: "neutral",
};

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  coverImage?: string | null;
  tags: string[];
};

export default function ProjectCard({ project, className }: { project: ProjectCardData; className?: string }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-dots opacity-70">
            <Layers className="h-10 w-10 text-line-strong" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge tone={statusTone[project.status] ?? "neutral"}>{labelOf(PROJECT_STATUSES, project.status)}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
          {labelOf(PROJECT_CATEGORIES, project.category)}
        </p>
        <h3 className="mt-2 font-display text-[17px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent-strong">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">{project.summary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-strong">
            Learn more
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {project.tags[0] && <Github className="h-4 w-4 text-fg-muted/50" aria-hidden />}
        </div>
      </div>
    </Link>
  );
}
