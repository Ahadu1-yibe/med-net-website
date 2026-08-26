"use server";

import { projectSchema } from "@/lib/validators";
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

const REVALIDATE = ["/projects"];

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = projectSchema.safeParse({
    title: str(formData, "title"),
    summary: str(formData, "summary"),
    description: formData.get("description") ?? "",
    category: str(formData, "category"),
    status: str(formData, "status"),
    problem: formData.get("problem") ?? "",
    approach: formData.get("approach") ?? "",
    impact: formData.get("impact") ?? "",
    technologies: str(formData, "technologies"),
    team: str(formData, "team"),
    externalUrl: str(formData, "externalUrl"),
    repoUrl: str(formData, "repoUrl"),
    coverImage: str(formData, "coverImage"),
    gallery: str(formData, "gallery"),
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
    problem: d.problem ?? "",
    approach: d.approach ?? "",
    impact: d.impact ?? "",
    technologies: stringifyArray(splitList(d.technologies)),
    team: stringifyArray(splitList(d.team)),
    externalUrl: d.externalUrl || null,
    repoUrl: d.repoUrl || null,
    coverImage: d.coverImage || null,
    gallery: stringifyArray(splitList(d.gallery)),
    tags: stringifyArray(splitList(d.tags)),
    featured: d.featured ?? false,
    published: d.published ?? false,
  };
  const slug = slugify(str(formData, "slug") || d.title) || `project-${Date.now().toString(36)}`;
  return genericSave({ delegate: "project", id, slug, data, entity: "Project", revalidate: REVALIDATE });
}

export async function deleteProject(formData: FormData) {
  return genericDelete("project", formData, "Project", REVALIDATE);
}

export async function toggleProjectFlag(formData: FormData) {
  return genericToggle("project", formData, "Project", REVALIDATE);
}
