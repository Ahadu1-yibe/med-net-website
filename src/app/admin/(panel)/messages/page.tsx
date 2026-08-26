import Link from "next/link";
import { Inbox } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader, StatCard } from "@/components/admin/page-parts";
import StatusBadge from "@/components/admin/status-badge";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { SearchFilterBar } from "@/components/ui/search-filter";
import EmptyState from "@/components/ui/empty-state";
import { deleteMessage, setMessageStatus } from "@/lib/actions/submissions";
import { formatDate, truncate } from "@/lib/utils";
import { labelOf, CONTACT_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }, { message: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(status ? { status } : {}),
  };

  const [messages, counts] = await Promise.all([
    db.contactSubmission.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    db.contactSubmission.groupBy({ by: ["status"], _count: true }),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Contact Messages"
        description="Submissions from the public contact form. Reply directly by email."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="New" value={countOf("NEW")} href="/admin/messages?status=NEW" tone={countOf("NEW") > 0 ? "accent" : "default"} />
        <StatCard label="Read" value={countOf("READ")} href="/admin/messages?status=READ" />
        <StatCard label="Archived" value={countOf("ARCHIVED")} href="/admin/messages?status=ARCHIVED" />
      </div>

      <SearchFilterBar
        placeholder="Search messages…"
        filters={[
          {
            name: "status",
            label: "All statuses",
            options: [
              { value: "NEW", label: "New" },
              { value: "READ", label: "Read" },
              { value: "ARCHIVED", label: "Archived" },
            ],
          },
        ]}
      />

      <div className="mt-5 space-y-3">
        {messages.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-5 w-5" />}
            title="No messages yet"
            description="Contact form submissions will appear here. The inbox is empty — for now."
          />
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-2xl border border-line bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-accent-strong hover:underline">
                    {msg.email}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={msg.status} />
                  <span className="rounded-full border border-line bg-muted px-2.5 py-0.5 text-[11px] text-fg-muted">
                    {labelOf(CONTACT_CATEGORIES, msg.category)}
                  </span>
                  <span className="text-xs text-fg-muted">{formatDate(msg.createdAt, true)}</span>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-background p-4 text-sm leading-relaxed text-fg-muted">
                {truncate(msg.message, 500)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: your message to Med-Net`}
                  className="inline-flex h-8 items-center rounded-lg border border-line bg-card px-3 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                >
                  Reply by email
                </a>
                {(["NEW", "READ", "ARCHIVED"] as const)
                  .filter((s) => s !== msg.status)
                  .map((s) => (
                    <form key={s} action={setMessageStatus}>
                      <input type="hidden" name="id" value={msg.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        className="inline-flex h-8 items-center rounded-lg border border-line bg-card px-3 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                      >
                        Mark {s.toLowerCase()}
                      </button>
                    </form>
                  ))}
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <ConfirmSubmit label="" message={`Delete this message from ${msg.name}?`} />
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
