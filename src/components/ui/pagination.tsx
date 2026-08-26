import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={cn(pageStyle)}>
          Previous
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-fg-muted">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              pageStyle,
              p === page && "border-accent bg-accent text-accent-fg hover:text-accent-fg"
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className={cn(pageStyle)}>
          Next
        </Link>
      )}
    </nav>
  );
}

const pageStyle =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-card px-3 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent-strong";
