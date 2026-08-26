"use server";

import { resourceSchema } from "@/lib/validators";
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

const REVALIDATE = ["/learn"];

export async function saveResource(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resourceSchema.safeParse({
    title: str(formData, "title"),
    summary: str(formData, "summary"),
    description: formData.get("description") ?? "",
    type: str(formData, "type"),
    level: str(formData, "level"),
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
    type: d.type,
    level: d.level,
    externalUrl: d.externalUrl || null,
    coverImage: d.coverImage || null,
    tags: stringifyArray(splitList(d.tags)),
    featured: d.featured ?? false,
    published: d.published ?? false,
  };
  const slug = slugify(str(formData, "slug") || d.title) || `resource-${Date.now().toString(36)}`;
  return genericSave({ delegate: "learningResource", id, slug, data, entity: "LearningResource", revalidate: REVALIDATE });
}

export async function deleteResource(formData: FormData) {
  return genericDelete("learningResource", formData, "LearningResource", REVALIDATE);
}

export async function toggleResourceFlag(formData: FormData) {
  return genericToggle("learningResource", formData, "LearningResource", REVALIDATE);
}
