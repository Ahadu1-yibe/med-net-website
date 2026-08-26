import Link from "next/link";
import { Mail, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader, StatCard } from "@/components/admin/page-parts";
import StatusBadge from "@/components/admin/status-badge";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { SearchFilterBar } from "@/components/ui/search-filter";
import EmptyState from "@/components/ui/empty-state";
import { deleteApplication } from "@/lib/actions/submissions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where = {
    ...(q ? { OR: [{ fullName: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }, { institution: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(status ? { status } : {}),
  };

  const [applications, counts] = await Promise.all([
    db.membershipApplication.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    db.membershipApplication.groupBy({ by: ["status"], _count: true }),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <>
      <AdminPageHeader
        title="Membership Applications"
        description="Applications from people who want to join the Med-Net community. Treat this information as confidential."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="New" value={countOf("NEW")} href="/admin/applications?status=NEW" tone={countOf("NEW") > 0 ? "accent" : "default"} />
        <StatCard label="Reviewing" value={countOf("REVIEWING")} href="/admin/applications?status=REVIEWING" />
        <StatCard label="Accepted" value={countOf("ACCEPTED")} href="/admin/applications?status=ACCEPTED" tone="success" />
        <StatCard label="Declined" value={countOf("DECLINED")} href="/admin/applications?status=DECLINED" />
      </div>

      <SearchFilterBar
        placeholder="Search by name, email or institution…"
        filters={[
          {
            name: "status",
            label: "All statuses",
            options: [
              { value: "NEW", label: "New" },
              { value: "REVIEWING", label: "Reviewing" },
              { value: "ACCEPTED", label: "Accepted" },
              { value: "DECLINED", label: "Declined" },
            ],
          },
        ]}
      />

      <div className="mt-5">
        {applications.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-5 w-5" />}
            title="No applications yet"
            description="Membership applications submitted through the Join page will appear here for review."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-muted/60 text-[11px] uppercase tracking-wide text-fg-muted">
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Discipline</th>
                  <th className="hidden px-4 py-3 font-semibold lg:table-cell">Institution</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="hidden px-4 py-3 font-semibold lg:table-cell">Received</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/applications/${app.id}`} className="block">
                        <p className="font-medium text-foreground hover:text-accent-strong">{app.fullName}</p>
                        <p className="text-xs text-fg-muted">{app.email}</p>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3.5 md:table-cell">
                      <span className="text-xs text-fg-muted">{app.discipline}</span>
                    </td>
                    <td className="hidden max-w-[200px] truncate px-4 py-3.5 text-xs text-fg-muted lg:table-cell">
                      {app.institution}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="hidden px-4 py-3.5 text-xs text-fg-muted lg:table-cell">{formatDate(app.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          aria-label={`Review application from ${app.fullName}`}
                          className="inline-flex h-8 items-center rounded-lg border border-line bg-card px-3 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                        >
                          Review
                        </Link>
                        <form action={deleteApplication}>
                          <input type="hidden" name="id" value={app.id} />
                          <ConfirmSubmit
                            label=""
                            message={`Delete the application from ${app.fullName}? This cannot be undone.`}
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-muted">
        <Phone className="h-3 w-3" />
        Contact applicants directly using the email address on their application.
      </p>
      <Trash2 className="hidden" />
    </>
  );
}
