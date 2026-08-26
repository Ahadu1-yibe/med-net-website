import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/actions/audit";

export type ActionState = { ok: boolean; message: string; id?: string } | null;

export type Delegate = "project" | "researchItem" | "learningResource" | "post" | "opportunity" | "partner";

export function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function optStr(formData: FormData, key: string): string | null {
  return str(formData, key) || null;
}

export function bool(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

export function dateOrNull(formData: FormData, key: string): Date | null {
  const value = str(formData, key);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function firstError(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}

export function revalidateAll(paths: string[]) {
  for (const path of ["/", ...paths]) {
    try {
      revalidatePath(path);
    } catch {}
  }
}

export async function genericSave(cfg: {
  delegate: Delegate;
  id: string;
  slug: string;
  data: Record<string, unknown>;
  entity: string;
  revalidate: string[];
}): Promise<ActionState> {
  await requireAdmin();
  const model = db[cfg.delegate] as any;
  try {
    let id = cfg.id;
    if (id) {
      const clash = await model.findFirst({ where: { slug: cfg.slug, id: { not: id } } });
      await model.update({
        where: { id },
        data: { ...cfg.data, slug: clash ? `${cfg.slug}-${Date.now().toString(36)}` : cfg.slug },
      });
    } else {
      const clash = await model.findUnique({ where: { slug: cfg.slug } });
      const created = await model.create({
        data: { ...cfg.data, slug: clash ? `${cfg.slug}-${Date.now().toString(36)}` : cfg.slug },
      });
      id = created.id;
    }
    await logAudit(cfg.id ? "update" : "create", cfg.entity, id, { title: cfg.data.title });
    revalidateAll(cfg.revalidate);
    return { ok: true, message: cfg.id ? "Changes saved." : "Created successfully.", id };
  } catch {
    return { ok: false, message: "Could not save. Please check the values and try again." };
  }
}

export async function genericDelete(delegate: Delegate, formData: FormData, entity: string, revalidate: string[]) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  try {
    const model = db[delegate] as any;
    const item = await model.findUnique({ where: { id } });
    await model.delete({ where: { id } });
    await logAudit("delete", entity, id, { title: item?.title ?? item?.name });
    revalidateAll(revalidate);
  } catch {}
}

export async function genericToggle(delegate: Delegate, formData: FormData, entity: string, revalidate: string[]) {
  await requireAdmin();
  const id = str(formData, "id");
  const field = str(formData, "field");
  if (!id || !["published", "featured", "status"].includes(field)) return;
  try {
    const model = db[delegate] as any;
    const item = await model.findUnique({ where: { id } });
    if (!item) return;
    if (field === "status") {
      await model.update({ where: { id }, data: { status: item.status === "OPEN" ? "CLOSED" : "OPEN" } });
    } else {
      const value = !item[field];
      const data: Record<string, unknown> = { [field]: value };
      if (field === "published") {
        data.publishedAt = value ? (item as { publishedAt?: Date | null }).publishedAt ?? new Date() : null;
      }
      await model.update({ where: { id }, data });
    }
    await logAudit("update", entity, id, { [field]: "toggled" });
    revalidateAll(revalidate);
  } catch {}
}
