"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/actions/audit";
import { str, type ActionState } from "@/lib/actions/helpers";

export async function updateMediaMeta(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return { ok: false, message: "Missing media id." };
  try {
    await db.mediaAsset.update({ where: { id }, data: { alt: str(formData, "alt") } });
    await logAudit("update", "MediaAsset", id, { alt: "updated" });
    revalidatePath("/admin/media");
    return { ok: true, message: "Media updated.", id };
  } catch {
    return { ok: false, message: "Could not update media." };
  }
}

export async function addExternalMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const url = str(formData, "externalUrl");
  const alt = str(formData, "alt");
  if (!/^https?:\/\/.+/.test(url)) return { ok: false, message: "Enter a valid image URL (https://…)." };
  try {
    const asset = await db.mediaAsset.create({
      data: {
        filename: url.split("/").pop()?.slice(0, 255) || "external-image",
        mimeType: "image/external",
        size: 0,
        kind: "EXTERNAL",
        externalUrl: url,
        alt,
      },
    });
    await logAudit("create", "MediaAsset", asset.id, { kind: "EXTERNAL" });
    revalidatePath("/admin/media");
    return { ok: true, message: "External image added.", id: asset.id };
  } catch {
    return { ok: false, message: "Could not add the image." };
  }
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  try {
    await db.mediaAsset.delete({ where: { id } });
    await logAudit("delete", "MediaAsset", id);
    revalidatePath("/admin/media");
  } catch {}
}
