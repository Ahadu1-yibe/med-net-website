import Link from "next/link";
import { Pencil, ArrowUpRight } from "lucide-react";
import { IconSubmit, ConfirmSubmit } from "@/components/admin/confirm-submit";
import StatusBadge from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";

export type EntityRow = {
  id: string;
  title: string;
  meta?: string;
  href?: string;
  status?: string;
  published?: boolean;
  featured?: boolean;
  updatedLabel?: string;
  extra?: string;
};

export default function EntityList({
  rows,
  entityBase,
  toggleAction,
  deleteAction,
  hasFeatured = true,
  hasStatus = true,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Create the first item — it will appear on the public website immediately after publishing.",
  newHref,
}: {
  rows: EntityRow[];
  entityBase: string;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  hasFeatured?: boolean;
  hasStatus?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  newHref: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-16 text-center">
        <h3 className="font-display text-base font-semibold text-foreground">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{emptyDescription}</p>
        <Link
          href={newHref}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-medium text-navy-fg transition-colors hover:bg-navy-strong dark:bg-accent dark:text-accent-fg"
        >
          Create new
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-muted/60 text-[11px] uppercase tracking-wide text-fg-muted">
            <th className="px-5 py-3 font-semibold">Item</th>
            {hasStatus && <th className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>}
            <th className="px-4 py-3 font-semibold">Visibility</th>
            {hasFeatured && <th className="hidden px-4 py-3 font-semibold md:table-cell">Featured</th>}
            <th className="hidden px-4 py-3 font-semibold lg:table-cell">Updated</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-muted/40">
              <td className="max-w-xs px-5 py-3.5">
                <p className="truncate font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 truncate text-xs text-fg-muted">
                  {row.meta}
                  {row.extra && <span className="ml-2 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px]">{row.extra}</span>}
                </p>
              </td>
              {hasStatus && (
                <td className="hidden px-4 py-3.5 sm:table-cell">
                  {row.status ? <StatusBadge status={row.status} /> : <span className="text-xs text-fg-muted">—</span>}
                </td>
              )}
              <td className="px-4 py-3.5">
                <form action={toggleAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="field" value="published" />
                  <IconSubmit icon="publish" title={row.published ? "Unpublish" : "Publish"} active={row.published} />
                </form>
              </td>
              {hasFeatured && (
                <td className="hidden px-4 py-3.5 md:table-cell">
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="field" value="featured" />
                    <IconSubmit icon="feature" title={row.featured ? "Remove from featured" : "Feature on homepage"} active={row.featured} />
                  </form>
                </td>
              )}
              <td className="hidden px-4 py-3.5 text-xs text-fg-muted lg:table-cell">{row.updatedLabel}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/${entityBase}/${row.id}`}
                    aria-label={`Edit ${row.title}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  {row.href && (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${row.title} on website`}
                      className="hidden h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-fg-muted transition-colors hover:border-accent hover:text-accent-strong sm:inline-flex"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <ConfirmSubmit label="" message={`Delete "${row.title}"? This cannot be undone.`} />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
