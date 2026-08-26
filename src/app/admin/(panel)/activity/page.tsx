import Link from "next/link";
import { ScrollText } from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EmptyState from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const actionTone: Record<string, "success" | "warning" | "danger" | "accent" | "neutral"> = {
  create: "success",
  update: "accent",
  delete: "danger",
  login: "neutral",
};

export default async function AdminActivityPage() {
  const entries = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 150 });

  return (
    <>
      <AdminPageHeader
        title="Activity Log"
        description="A record of administrative actions for accountability and transparency."
      />
      {entries.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="h-5 w-5" />}
          title="No activity recorded yet"
          description="Administrative actions — creating content, publishing, changing settings — are logged here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-muted/60 text-[11px] uppercase tracking-wide text-fg-muted">
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Detail</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">By</th>
                <th className="px-5 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <Badge tone={actionTone[entry.action] ?? "neutral"}>{entry.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{entry.entity}</td>
                  <td className="hidden max-w-[280px] truncate px-4 py-3 text-xs text-fg-muted md:table-cell">
                    {entry.meta ? entry.meta : entry.entityId ? <span className="font-mono">{entry.entityId}</span> : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-fg-muted lg:table-cell">{entry.userEmail ?? "system"}</td>
                  <td className="px-5 py-3 text-xs text-fg-muted">{formatDate(entry.createdAt, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link href="/admin" className="mt-6 inline-block text-sm text-accent-strong hover:underline">
        Back to dashboard
      </Link>
    </>
  );
}
