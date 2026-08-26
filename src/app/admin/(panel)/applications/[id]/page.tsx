import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import StatusBadge from "@/components/admin/status-badge";
import NotesForm from "@/components/admin/notes-form";
import { setApplicationStatus, deleteApplication } from "@/lib/actions/submissions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { formatDate } from "@/lib/utils";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusFlow = [
  { value: "NEW", label: "Mark as new" },
  { value: "REVIEWING", label: "Start reviewing" },
  { value: "ACCEPTED", label: "Accept" },
  { value: "DECLINED", label: "Decline" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-3.5 last:border-0 sm:grid-cols-[180px_1fr] sm:gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{label}</p>
      <div className="min-w-0 text-sm text-foreground">{children}</div>
    </div>
  );
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await db.membershipApplication.findUnique({ where: { id } });
  if (!app) notFound();

  const interests = parseArray(app.interests);

  return (
    <>
      <AdminPageHeader
        title="Membership application"
        description={`Received ${formatDate(app.createdAt, true)}`}
        actions={
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
          >
            <ArrowLeft className="h-4 w-4" />
            All applications
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{app.fullName}</h2>
            <StatusBadge status={app.status} />
          </div>
          <Row label="Email">
            <a href={`mailto:${app.email}`} className="text-accent-strong hover:underline">
              {app.email}
            </a>
          </Row>
          <Row label="Institution">{app.institution}</Row>
          <Row label="Discipline">{app.discipline}</Row>
          {app.location && <Row label="Location">{app.location}</Row>}
          {interests.length > 0 && (
            <Row label="Areas of interest">
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <span key={i} className="rounded-full border border-line bg-muted px-2.5 py-0.5 text-xs text-fg-muted">
                    {i}
                  </span>
                ))}
              </div>
            </Row>
          )}
          {app.skills && (
            <Row label="Skills">
              <p className="whitespace-pre-wrap leading-relaxed text-fg-muted">{app.skills}</p>
            </Row>
          )}
          <Row label="Motivation">
            <p className="whitespace-pre-wrap leading-relaxed">{app.motivation}</p>
          </Row>
          {app.portfolioUrl && (
            <Row label="Portfolio / links">
              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="break-all text-accent-strong hover:underline">
                {app.portfolioUrl}
              </a>
            </Row>
          )}
          <Row label="Consent">{app.consent ? "Granted" : "Not granted"}</Row>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <ArrowLeftRight className="h-4 w-4 text-accent" />
              Review decision
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusFlow.map((s) => (
                <form key={s.value} action={setApplicationStatus}>
                  <input type="hidden" name="id" value={app.id} />
                  <input type="hidden" name="status" value={s.value} />
                  <button
                    type="submit"
                    disabled={app.status === s.value}
                    className="w-full rounded-lg border border-line bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-strong disabled:cursor-default disabled:border-success/40 disabled:bg-success/10 disabled:text-success"
                  >
                    {s.label}
                  </button>
                </form>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <NotesForm id={app.id} notes={app.notes ?? ""} />
          </div>

          <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
            <h2 className="font-display text-sm font-semibold text-danger">Danger zone</h2>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted">
              Permanently delete this application and all its data.
            </p>
            <form action={deleteApplication} className="mt-4">
              <input type="hidden" name="id" value={app.id} />
              <ConfirmSubmit
                label="Delete application"
                message={`Permanently delete the application from ${app.fullName}?`}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
