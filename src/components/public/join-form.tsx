"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { submitApplication, type FormState } from "@/lib/actions/public";
import { DISCIPLINES, INTEREST_AREAS } from "@/lib/constants";

export default function JoinForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitApplication, null);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Application received</h3>
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
        <Field label="Full name" required>
          <Input name="fullName" required placeholder="Your full name" autoComplete="name" />
        </Field>
        <Field label="Email address" required>
          <Input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Institution / organization" required>
          <Input name="institution" required placeholder="University, hospital, company…" />
        </Field>
        <Field label="Field / discipline" required>
          <Select name="discipline" required defaultValue="">
            <option value="" disabled>
              Select your field
            </option>
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="City / location" className="sm:col-span-2">
          <Input name="location" placeholder="e.g. Addis Ababa, Ethiopia" />
        </Field>
      </div>

      <Field label="Areas of interest" hint="Select all that apply.">
        <div className="grid grid-cols-1 gap-2 rounded-xl border border-line bg-card p-4 sm:grid-cols-2">
          {INTEREST_AREAS.map((area) => (
            <label key={area} className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                name="interests"
                value={area}
                className="h-4 w-4 rounded border-line-strong accent-[var(--accent)] cursor-pointer"
              />
              {area}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Skills you can contribute" hint="e.g. web development, data analysis, writing, design, event organization…">
        <Textarea name="skills" rows={3} placeholder="Tell us what you're good at" />
      </Field>

      <Field
        label="Why do you want to join Med-Net?"
        required
        hint="A few honest sentences are enough — we care about motivation, not polish."
      >
        <Textarea name="motivation" required rows={5} placeholder="What draws you to digital health and Med-Net?" />
      </Field>

      <Field label="Portfolio / LinkedIn / GitHub" hint="Optional — anything that shows your work.">
        <Input name="portfolioUrl" type="url" placeholder="https://" />
      </Field>

      <Field error={state && !state.ok ? state.message : undefined}>
        <Checkbox
          name="consent"
          required
          label={
            <span className="text-[13px] leading-relaxed text-fg-muted">
              I agree that Med-Net may store and process this information to review my application, in line with its
              privacy practices. No information will be shared with third parties or published.
            </span>
          }
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting…" : "Submit application"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
