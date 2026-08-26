import { Suspense } from "react";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in · Med-Net Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-[0.3] dark:opacity-[0.1]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 65%)" }}
      />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="h-16 w-auto" priority />
        </div>
        <div className="card-surface rounded-2xl p-7 shadow-md sm:p-8">
          <h1 className="font-display text-xl font-semibold text-foreground">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            Sign in to manage the Med-Net website content.
          </p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-fg-muted">
          Protected area — authorized Med-Net administrators only.
        </p>
      </div>
    </div>
  );
}
