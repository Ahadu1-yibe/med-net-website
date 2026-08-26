"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300",
        scrolled ? "border-line bg-background/85 shadow-sm" : "border-transparent bg-background/70"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Med-Net home" className="flex shrink-0 items-center">
          <Logo className="h-11 w-auto" priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                  isActive(link.href)
                    ? "text-accent-strong"
                    : "text-fg-muted hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
                {link.children && <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />}
              </Link>
              {link.children && (
                <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="card-surface rounded-xl p-2 shadow-lg">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                      >
                        <span className="block text-sm font-medium text-foreground">{child.label}</span>
                        {child.description && (
                          <span className="mt-0.5 block text-xs text-fg-muted">{child.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href="/join"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-navy px-4 text-[13.5px] font-medium text-navy-fg shadow-sm transition-all hover:bg-navy-strong hover:shadow-md sm:inline-flex dark:bg-accent dark:text-accent-fg dark:hover:bg-accent-strong"
          >
            Join Med-Net
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-background transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "invisible translate-x-full"
        )}
      >
        <nav aria-label="Mobile" className="space-y-1 px-4 py-6">
          {NAV_LINKS.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                  isActive(link.href) ? "bg-accent-soft text-accent-strong" : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
              {link.children && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-line pl-3">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 space-y-3 border-t border-line pt-5">
            <Link
              href="/join"
              className="flex h-11 items-center justify-center rounded-xl bg-navy text-[15px] font-medium text-navy-fg dark:bg-accent dark:text-accent-fg"
            >
              Join Med-Net
            </Link>
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-fg-muted">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
