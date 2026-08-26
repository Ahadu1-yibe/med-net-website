"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

export type FilterOption = { value: string; label: string };

export function SearchFilterBar({
  placeholder = "Search…",
  filters = [],
}: {
  placeholder?: string;
  filters?: { name: string; options: FilterOption[]; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const current = (name: string) => searchParams.get(name) ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    if (query) next.set("q", query);
    else next.delete("q");
    push(next);
  }

  function onFilter(name: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    push(next);
  }

  function onReset() {
    setQuery("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const hasAny = query || filters.some((f) => current(f.name));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form onSubmit={onSearch} className="relative flex-1" role="search">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-24 text-sm text-foreground placeholder:text-fg-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-navy px-3.5 text-xs font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-navy-strong dark:hover:bg-[#20406a]"
        >
          {pending ? "…" : "Search"}
        </button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <select
            key={f.name}
            value={current(f.name)}
            onChange={(e) => onFilter(f.name, e.target.value)}
            aria-label={f.label}
            className="h-11 cursor-pointer appearance-none rounded-xl border border-line bg-card px-3.5 pr-9 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.7rem center",
            }}
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        {hasAny && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line bg-card px-3 text-sm text-fg-muted transition-colors hover:border-danger hover:text-danger"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
