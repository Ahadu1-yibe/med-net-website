"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Microscope,
  GraduationCap,
  Newspaper,
  Handshake,
  Building2,
  UserRoundPlus,
  Inbox,
  Image as ImageIcon,
  Globe,
  Home,
  Palette,
  Users,
  ScrollText,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const groups: { label: string; items: { href: string; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: Layers },
      { href: "/admin/research", label: "Research", icon: Microscope },
      { href: "/admin/learning", label: "Learning Hub", icon: GraduationCap },
      { href: "/admin/posts", label: "Events & News", icon: Newspaper },
      { href: "/admin/opportunities", label: "Opportunities", icon: Handshake },
      { href: "/admin/partners", label: "Partners", icon: Building2 },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/applications", label: "Applications", icon: UserRoundPlus },
      { href: "/admin/messages", label: "Messages", icon: Inbox },
    ],
  },
  {
    label: "Media",
    items: [{ href: "/admin/media", label: "Media Library", icon: ImageIcon }],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/homepage", label: "Homepage", icon: Home },
      { href: "/admin/settings", label: "Site Settings", icon: Globe },
      { href: "/admin/appearance", label: "Appearance", icon: Palette },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Admin Users", icon: Users },
      { href: "/admin/activity", label: "Activity Log", icon: ScrollText },
    ],
  },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/admin" className="flex items-center">
          <Logo className="h-10 w-auto" priority />
        </Link>
        <span className="ml-3 rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-strong">
          Admin
        </span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-subtle" aria-label="Admin">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted/70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent-soft text-accent-strong"
                      : "text-fg-muted hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-fg-muted transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View public website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-card lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-card shadow-lg">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm font-medium text-foreground">
              Med-Net Control Center
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden items-center gap-2.5 border-l border-line pl-2.5 sm:flex">
              <div className="text-right">
                <p className="text-[13px] font-medium leading-tight text-foreground">{user.name}</p>
                <p className="text-[11px] leading-tight text-fg-muted">{user.role}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-fg dark:bg-accent dark:text-accent-fg">
                {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("") || "A"}
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-card px-3 text-[13px] font-medium text-fg-muted transition-colors hover:border-danger hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
