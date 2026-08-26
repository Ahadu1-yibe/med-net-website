"use client";

import { useActionState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import type { ActionState } from "@/lib/actions/helpers";

export default function SettingsForm({
  action,
  submitLabel = "Save settings",
  children,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel?: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-6">
      {state && (
        <div
          role="status"
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
            state.ok ? "border-success/30 bg-success/5 text-success" : "border-danger/30 bg-danger/5 text-danger"
          }`}
        >
          {state.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {state.message}
        </div>
      )}
      {children}
      <div className="flex justify-end border-t border-line pt-5">
        <Button type="submit" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-xs text-fg-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

export { Input, Textarea, Field };
