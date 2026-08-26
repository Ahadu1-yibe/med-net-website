"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { loginAction, type LoginState } from "@/lib/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);

  useEffect(() => {
    if (state?.ok) {
      const from = searchParams.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    }
  }, [state, router, searchParams]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="from" value={searchParams.get("from") ?? ""} />
      {state && !state.ok && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}
      <Field label="Email address" required>
        <Input name="email" type="email" required autoComplete="email" placeholder="admin@med-net.org" />
      </Field>
      <Field label="Password" required>
        <Input name="password" type="password" required autoComplete="current-password" placeholder="••••••••••" />
      </Field>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
        <LogIn className="h-4 w-4" />
      </Button>
    </form>
  );
}
