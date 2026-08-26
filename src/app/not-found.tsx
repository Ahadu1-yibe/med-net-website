import Link from "next/link";
import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
          <Compass className="h-8 w-8" />
        </span>
        <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-strong">
          Page not found
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          This page doesn't exist — yet.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-fg-muted">
          The link may be outdated or the page may have moved. Explore the site from the beginning instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Back to homepage
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline">
            Report a broken link
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-fg-muted">
          Or{" "}
          <Link href="/about" className="text-accent-strong hover:underline">
            learn about Med-Net
          </Link>
        </p>
      </div>
    </div>
  );
}
