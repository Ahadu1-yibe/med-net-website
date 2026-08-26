"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import ImagePicker from "@/components/admin/image-picker";
import type { ActionState } from "@/lib/actions/helpers";
import type { EntityFormConfig } from "@/components/admin/entity-config";
import { cn } from "@/lib/utils";

export type EntityValues = Record<string, string | boolean | null>;

export default function EntityForm({
  config,
  values,
  action,
  entityBase,
  id,
  titleField = "title",
  deleteAction,
}: {
  config: EntityFormConfig;
  values: EntityValues;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  entityBase: string;
  id?: string;
  titleField?: string;
  deleteAction?: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(String(values[titleField] ?? ""));
  const [slug, setSlug] = useState(String(values.slug ?? ""));
  const [slugEdited, setSlugEdited] = useState(Boolean(values.slug));
  const [images, setImages] = useState<Record<string, string>>({});

  const isEdit = Boolean(id);

  useEffect(() => {
    if (state?.ok && state.id && !isEdit) {
      router.push(`/admin/${entityBase}/${state.id}`);
    }
  }, [state, isEdit, entityBase, router]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80));
  }

  function renderField(field: (typeof config.fields)[number], side = false) {
    const value = values[field.name];
    const common = { name: field.name, placeholder: field.placeholder };

    switch (field.type) {
      case "select":
        return (
          <Field key={field.name} label={field.label} hint={field.hint} required={field.required} className={cn(!side && field.full && "sm:col-span-2")}>
            <Select {...common} defaultValue={String(value ?? "")} required={field.required}>
              {!String(value ?? "") && <option value="" disabled>Select…</option>}
              {field.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        );
      case "textarea":
      case "markdown":
        return (
          <Field
            key={field.name}
            label={field.label}
            hint={field.hint ?? (field.type === "markdown" ? "Markdown supported — headings, lists, links, bold, tables." : undefined)}
            required={field.required}
            className={cn(!side && field.full && "sm:col-span-2")}
          >
            <Textarea
              {...common}
              defaultValue={String(value ?? "")}
              rows={field.rows ?? 5}
              required={field.required}
              className={field.type === "markdown" ? "font-mono text-[13px]" : undefined}
            />
          </Field>
        );
      case "date":
      case "datetime":
        return (
          <Field key={field.name} label={field.label} hint={field.hint} className={cn(!side && field.full && "sm:col-span-2")}>
            <Input
              {...common}
              type={field.type === "date" ? "date" : "datetime-local"}
              defaultValue={String(value ?? "")}
            />
          </Field>
        );
      case "image":
        return (
          <div key={field.name} className={cn(!side && field.full && "sm:col-span-2")}>
            <ImagePicker
              name={field.name}
              label={field.label}
              value={images[field.name] ?? String(value ?? "")}
              onChange={(url) => setImages((prev) => ({ ...prev, [field.name]: url }))}
            />
          </div>
        );
      case "checkbox":
        return (
          <label
            key={field.name}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-card px-4 py-3"
          >
            <input
              type="checkbox"
              name={field.name}
              defaultChecked={Boolean(value)}
              className="h-4 w-4 rounded border-line-strong accent-[var(--accent)] cursor-pointer"
            />
            <span>
              <span className="block text-sm font-medium text-foreground">{field.label}</span>
              {field.hint && <span className="block text-xs text-fg-muted">{field.hint}</span>}
            </span>
          </label>
        );
      case "number":
        return (
          <Field key={field.name} label={field.label} hint={field.hint}>
            <Input {...common} type="number" defaultValue={String(value ?? "0")} />
          </Field>
        );
      default:
        return (
          <Field
            key={field.name}
            label={field.label}
            hint={field.hint}
            required={field.required}
            className={cn(!side && field.full && "sm:col-span-2")}
          >
            <Input {...common} defaultValue={String(value ?? "")} required={field.required} />
          </Field>
        );
    }
  }

  const mainFields = config.fields.filter((f) => !f.side && f.name !== titleField);
  const sideFields = [...config.sidebarFields, ...config.fields.filter((f) => f.side)];

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id ?? ""} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/${entityBase}`}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent-strong"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
        <div className="flex items-center gap-2">
          {isEdit && deleteAction && (
            <button
              type="submit"
              form="delete-entity-form"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              Delete
            </button>
          )}
          <Button type="submit" disabled={pending}>
            <Save className="h-4 w-4" />
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </Button>
        </div>
      </div>

      {state && (
        <div
          role="status"
          className={cn(
            "mb-6 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm",
            state.ok
              ? "border-success/30 bg-success/5 text-success"
              : "border-danger/30 bg-danger/5 text-danger"
          )}
        >
          {state.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {state.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <Field label={titleField === "name" ? "Name" : "Title"} required className="mb-5">
              <Input name={titleField} value={title} onChange={(e) => onTitleChange(e.target.value)} required placeholder={titleField === "name" ? "Partner name" : "Enter a clear title"} className="h-12 text-lg font-medium" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">{mainFields.map((f) => renderField(f))}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-5 rounded-2xl border border-line bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">Publishing</h2>
            {sideFields.map((f) => renderField(f, true))}
            <Field label="URL slug" hint="Leave as suggested, or customize.">
              <Input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(e.target.value);
                }}
              />
            </Field>
          </div>
        </div>
      </div>

      {isEdit && deleteAction && (
        <form id="delete-entity-form" action={deleteAction} className="hidden">
          <input type="hidden" name="id" value={id} />
        </form>
      )}
    </form>
  );
}
