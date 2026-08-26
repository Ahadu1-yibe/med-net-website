"use server";

import { researchSchema } from "@/lib/validators";
import {
  genericSave,
  genericDelete,
  genericToggle,
  str,
  bool,
  firstError,
  type ActionState,
} from "@/lib/actions/helpers";
import { slugify, splitList, stringifyArray } from "@/lib/utils";

const REVALIDATE = ["/research"];

export async function saveResearch(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = researchSchema.safeParse({
    title: str(formData, "title"),
    summary: str(formData, "summary"),
    description: formData.get("description") ?? "",
    category: str(formData, "category"),
    status: str(formData, "status"),
    authors: str(formData, "authors"),
    externalUrl: str(formData, "externalUrl"),
    coverImage: str(formData, "coverImage"),
    tags: str(formData, "tags"),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const d = parsed.data;
  const id = str(formData, "id");
  const data = {
    title: d.title,
    summary: d.summary,
    description: d.description ?? "",
    category: d.category,
    status: d.status,
    authors: stringifyArray(splitList(d.authors)),
    externalUrl: d.externalUrl || null,
    coverImage: d.coverImage || null,
    tags: stringifyArray(splitList(d.tags)),
    featured: d.featured ?? false,
    published: d.published ?? false,
  };
  const slug = slugify(str(formData, "slug") || d.title) || `research-${Date.now().toString(36)}`;
  return genericSave({ delegate: "researchItem", id, slug, data, entity: "ResearchItem", revalidate: REVALIDATE });
}

export async function deleteResearch(formData: FormData) {
  return genericDelete("researchItem", formData, "ResearchItem", REVALIDATE);
}

export async function toggleResearchFlag(formData: FormData) {
  return genericToggle("researchItem", formData, "ResearchItem", REVALIDATE);
}
