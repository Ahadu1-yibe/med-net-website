"use server";

import { partnerSchema } from "@/lib/validators";
import { genericSave, genericDelete, str, firstError, type ActionState } from "@/lib/actions/helpers";
import { slugify } from "@/lib/utils";

const REVALIDATE = ["/community"];

export async function savePartner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = partnerSchema.safeParse({
    name: str(formData, "name"),
    description: formData.get("description") ?? "",
    websiteUrl: str(formData, "websiteUrl"),
    logoImage: str(formData, "logoImage"),
    tier: str(formData, "tier"),
    sortOrder: str(formData, "sortOrder") || "0",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const d = parsed.data;
  const id = str(formData, "id");
  const data = {
    name: d.name,
    description: d.description ?? "",
    websiteUrl: d.websiteUrl || null,
    logoImage: d.logoImage || null,
    tier: d.tier,
    sortOrder: d.sortOrder,
    published: d.published ?? false,
  };
  const slug = slugify(d.name) || `partner-${Date.now().toString(36)}`;
  return genericSave({ delegate: "partner", id, slug, data, entity: "Partner", revalidate: REVALIDATE });
}

export async function deletePartner(formData: FormData) {
  return genericDelete("partner", formData, "Partner", REVALIDATE);
}

export async function togglePartnerPublished(formData: FormData) {
  const { genericToggle } = await import("@/lib/actions/helpers");
  return genericToggle("partner", formData, "Partner", REVALIDATE);
}
