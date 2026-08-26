"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
          <AlertTriangle className="h-8 w-8" />
        </span>
        <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-strong">
          Something went wrong
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          An unexpected error occurred
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-fg-muted">
          The issue has been noted. Please try again — if the problem persists, let us know through the contact page.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-navy px-6 text-[15px] font-medium text-navy-fg transition-all hover:bg-navy-strong dark:bg-navy-strong dark:hover:bg-[#20406a]"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-card px-6 text-[15px] font-medium text-foreground transition-colors hover:border-accent hover:text-accent-strong"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
