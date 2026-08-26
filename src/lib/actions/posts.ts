"use server";

import { postSchema } from "@/lib/validators";
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
import { slugify, splitList, stringifyArray } from "@/lib/utils";

const REVALIDATE = ["/updates"];

export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = postSchema.safeParse({
    title: str(formData, "title"),
    type: str(formData, "type"),
    excerpt: str(formData, "excerpt"),
    description: formData.get("description") ?? "",
    location: str(formData, "location"),
    startAt: str(formData, "startAt"),
    endAt: str(formData, "endAt"),
    registrationUrl: str(formData, "registrationUrl"),
    coverImage: str(formData, "coverImage"),
    tags: str(formData, "tags"),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const d = parsed.data;
  const id = str(formData, "id");
  const published = d.published ?? false;
  const explicitPublishAt = dateOrNull(formData, "publishAt");
  const data = {
    title: d.title,
    type: d.type,
    excerpt: d.excerpt,
    description: d.description ?? "",
    location: d.location || null,
    startAt: dateOrNull(formData, "startAt"),
    endAt: dateOrNull(formData, "endAt"),
    registrationUrl: d.registrationUrl || null,
    coverImage: d.coverImage || null,
    tags: stringifyArray(splitList(d.tags)),
    featured: d.featured ?? false,
    published,
    publishAt: explicitPublishAt ?? (published ? new Date() : null),
  };
  const slug = slugify(str(formData, "slug") || d.title) || `post-${Date.now().toString(36)}`;
  return genericSave({ delegate: "post", id, slug, data, entity: "Post", revalidate: REVALIDATE });
}

export async function deletePost(formData: FormData) {
  return genericDelete("post", formData, "Post", REVALIDATE);
}

export async function togglePostFlag(formData: FormData) {
  return genericToggle("post", formData, "Post", REVALIDATE);
}
