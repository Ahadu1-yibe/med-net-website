import Link from "next/link";
import {
  Layers,
  Microscope,
  GraduationCap,
  Newspaper,
  Handshake,
  Building2,
  UserRoundPlus,
  Inbox,
  ArrowRight,
  CheckCircle2,
  Circle,
  Activity,
  Globe,
} from "lucide-react";
import { db } from "@/lib/db";
import { AdminPageHeader, StatCard } from "@/components/admin/page-parts";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    projectCount,
    researchCount,
    resourceCount,
    postCount,
    opportunityCount,
    partnerCount,
    newApplications,
    newMessages,
    upcomingEvents,
    recentActivity,
    lastProject,
  ] = await Promise.all([
    db.project.count(),
    db.researchItem.count(),
    db.learningResource.count(),
    db.post.count(),
    db.opportunity.count({ where: { status: "OPEN" } }),
    db.partner.count(),
    db.membershipApplication.count({ where: { status: "NEW" } }),
    db.contactSubmission.count({ where: { status: "NEW" } }),
    db.post.count({ where: { type: "EVENT", startAt: { gte: new Date() }, published: true } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.project.findFirst({ orderBy: { updatedAt: "desc" }, select: { title: true, updatedAt: true } }),
  ]);

  const checklist = [
    { label: "Create your first real project", done: projectCount > 0, href: "/admin/projects/new" },
    { label: "Add research or an insight piece", done: researchCount > 0, href: "/admin/research/new" },
    { label: "Publish a learning resource", done: resourceCount > 0, href: "/admin/learning/new" },
    { label: "Announce your first event or news", done: postCount > 0, href: "/admin/posts/new" },
    { label: "Complete site settings & social links", done: true, href: "/admin/settings" },
    { label: "Add official partners (when established)", done: partnerCount > 0, href: "/admin/partners/new" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="The state of Med-Net's digital presence at a glance."
        actions={
          <ButtonLink href="/admin/posts/new" size="sm">
            <Newspaper className="h-4 w-4" />
            New post
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={projectCount} icon={<Layers className="h-5 w-5" />} href="/admin/projects" />
        <StatCard label="Research items" value={researchCount} icon={<Microscope className="h-5 w-5" />} href="/admin/research" />
        <StatCard label="Learning resources" value={resourceCount} icon={<GraduationCap className="h-5 w-5" />} href="/admin/learning" />
        <StatCard label="Upcoming events" value={upcomingEvents} icon={<Newspaper className="h-5 w-5" />} href="/admin/posts" />
        <StatCard
          label="Pending applications"
          value={newApplications}
          hint="Awaiting review"
          tone={newApplications > 0 ? "accent" : "default"}
          icon={<UserRoundPlus className="h-5 w-5" />}
          href="/admin/applications"
        />
        <StatCard
          label="Unread messages"
          value={newMessages}
          hint="From contact form"
          tone={newMessages > 0 ? "accent" : "default"}
          icon={<Inbox className="h-5 w-5" />}
          href="/admin/messages"
        />
        <StatCard label="Open opportunities" value={opportunityCount} icon={<Handshake className="h-5 w-5" />} href="/admin/opportunities" />
        <StatCard label="Partners" value={partnerCount} icon={<Building2 className="h-5 w-5" />} href="/admin/partners" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
            <Globe className="h-4.5 w-4.5 text-accent" />
            Foundation checklist
          </h2>
          <p className="mt-1 text-xs text-fg-muted">
            Suggested steps to move from placeholder content to Med-Net's real digital presence.
          </p>
          <ul className="mt-5 space-y-2.5">
            {checklist.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg border border-line bg-background px-4 py-3 transition-colors hover:border-accent/40"
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-success" />
                  ) : (
                    <Circle className="h-4.5 w-4.5 shrink-0 text-line-strong" />
                  )}
                  <span className={`flex-1 text-sm ${item.done ? "text-fg-muted line-through" : "text-foreground"}`}>
                    {item.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Activity className="h-4.5 w-4.5 text-accent" />
              Recent activity
            </h2>
            {recentActivity.length === 0 ? (
              <p className="mt-4 text-sm text-fg-muted">No activity recorded yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground">
                        <span className="font-medium">{entry.action}</span>{" "}
                        <span className="text-fg-muted">
                          {entry.entity}
                          {entry.userEmail ? ` · ${entry.userEmail}` : ""}
                        </span>
                      </p>
                      <p className="text-xs text-fg-muted">{formatDate(entry.createdAt, true)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-6">
            <h2 className="font-display text-base font-semibold text-foreground">Latest content touch</h2>
            {lastProject ? (
              <p className="mt-2 text-sm text-fg-muted">
                <span className="font-medium text-foreground">{lastProject.title}</span> was updated{" "}
                {formatDate(lastProject.updatedAt)}.
              </p>
            ) : (
              <p className="mt-2 text-sm text-fg-muted">
                No content yet — everything you publish appears on the public website immediately.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
