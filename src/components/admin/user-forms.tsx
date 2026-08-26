"use client";

import { useActionState, useState } from "react";
import { Plus, KeyRound, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { createUser, resetUserPassword } from "@/lib/actions/users";
import type { ActionState } from "@/lib/actions/helpers";

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createUser, null);

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New admin user
      </Button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-line bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-foreground">New admin user</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cancel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {state && (
        <p
          className={`mb-4 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
            state.ok ? "border-success/30 bg-success/5 text-success" : "border-danger/30 bg-danger/5 text-danger"
          }`}
        >
          {state.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {state.message}
        </p>
      )}
      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input name="name" required placeholder="Full name" />
        </Field>
        <Field label="Email" required>
          <Input name="email" type="email" required placeholder="email@med-net.org" />
        </Field>
        <Field label="Temporary password" required hint="At least 8 characters — share securely.">
          <Input name="password" type="password" required minLength={8} />
        </Field>
        <Field label="Role">
          <Select name="role" defaultValue="ADMIN">
            <option value="ADMIN">Administrator</option>
            <option value="EDITOR">Editor</option>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            <Plus className="h-4 w-4" />
            {pending ? "Creating…" : "Create user"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ResetPasswordForm({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(resetUserPassword, null);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Set a new password for ${name}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
      >
        <KeyRound className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <Input name="password" type="password" required minLength={8} placeholder="New password" className="h-9 w-40 text-xs" />
      <Button type="submit" variant="subtle" size="sm" className="h-9" disabled={pending}>
        {pending ? "…" : "Set"}
      </Button>
    </form>
  );
}
