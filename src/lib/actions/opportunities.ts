"use server";

import { opportunitySchema } from "@/lib/validators";
import {
  genericSave,
  genericDelete,
  genericToggle,
  str,
  bool,
  dateOrNull,
  firstError,
  type ActionState,
} from "@/lib/actions/helpers";
import { slugify } from "@/lib/utils";

const REVALIDATE = ["/community"];

export async function saveOpportunity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = opportunitySchema.safeParse({
    title: str(formData, "title"),
    type: str(formData, "type"),
    location: str(formData, "location"),
    description: str(formData, "description"),
    requirements: formData.get("requirements") ?? "",
    deadline: str(formData, "deadline"),
    applyUrl: str(formData, "applyUrl"),
    applyEmail: str(formData, "applyEmail"),
    status: str(formData, "status") || "OPEN",
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const d = parsed.data;
  const id = str(formData, "id");
  const data = {
    title: d.title,
    type: d.type,
    location: d.location || null,
    description: d.description,
    requirements: d.requirements ?? "",
    deadline: dateOrNull(formData, "deadline"),
    applyUrl: d.applyUrl || null,
    applyEmail: d.applyEmail || null,
    status: d.status,
    featured: d.featured ?? false,
    published: d.published ?? false,
  };
  const slug = slugify(str(formData, "slug") || d.title) || `opportunity-${Date.now().toString(36)}`;
  return genericSave({ delegate: "opportunity", id, slug, data, entity: "Opportunity", revalidate: REVALIDATE });
}

export async function deleteOpportunity(formData: FormData) {
  return genericDelete("opportunity", formData, "Opportunity", REVALIDATE);
}

export async function toggleOpportunityFlag(formData: FormData) {
  return genericToggle("opportunity", formData, "Opportunity", REVALIDATE);
}
