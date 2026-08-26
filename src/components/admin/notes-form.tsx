"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { setApplicationNotes } from "@/lib/actions/submissions";

export default function NotesForm({ id, notes }: { id: string; notes: string }) {
  const [, formAction, pending] = useActionState(setApplicationNotes, null);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <Field label="Internal review notes" hint="Only visible to administrators — never published.">
        <Textarea name="notes" defaultValue={notes} rows={4} placeholder="Add review notes…" />
      </Field>
      <Button type="submit" size="sm" variant="subtle" disabled={pending}>
        <Save className="h-3.5 w-3.5" />
        {pending ? "Saving…" : "Save notes"}
      </Button>
    </form>
  );
}
