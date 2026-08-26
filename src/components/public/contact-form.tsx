"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { submitContact, type FormState } from "@/lib/actions/public";
import { CONTACT_CATEGORIES } from "@/lib/constants";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitContact, null);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Message sent</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website-hp">Website</label>
        <input id="website-hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <Input name="name" required placeholder="Full name" autoComplete="name" />
        </Field>
        <Field label="Email address" required>
          <Input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        </Field>
      </div>
      <Field label="What is this about?">
        <Select name="category" defaultValue="GENERAL">
          {CONTACT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Message" required error={state && !state.ok ? state.message : undefined}>
        <Textarea name="message" required rows={6} placeholder="How can we help?" />
      </Field>
      <p className="text-xs leading-relaxed text-fg-muted">
        Your message is sent directly to the Med-Net team and is treated confidentially.
      </p>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
