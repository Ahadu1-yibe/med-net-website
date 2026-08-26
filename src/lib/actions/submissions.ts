"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/actions/audit";
import { str } from "@/lib/actions/helpers";

const APPLICATION_STATUSES = ["NEW", "REVIEWING", "ACCEPTED", "DECLINED"];
const MESSAGE_STATUSES = ["NEW", "READ", "ARCHIVED"];

export async function setApplicationStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !APPLICATION_STATUSES.includes(status)) return;
  await db.membershipApplication.update({ where: { id }, data: { status } });
  await logAudit("update", "MembershipApplication", id, { status });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  await db.membershipApplication.delete({ where: { id } });
  await logAudit("delete", "MembershipApplication", id);
  revalidatePath("/admin/applications");
}

export async function setApplicationNotes(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  await db.membershipApplication.update({ where: { id }, data: { notes: str(formData, "notes") || null } });
  await logAudit("update", "MembershipApplication", id, { notes: "updated" });
  revalidatePath(`/admin/applications/${id}`);
}

export async function setMessageStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !MESSAGE_STATUSES.includes(status)) return;
  await db.contactSubmission.update({ where: { id }, data: { status } });
  await logAudit("update", "ContactSubmission", id, { status });
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;
  await db.contactSubmission.delete({ where: { id } });
  await logAudit("delete", "ContactSubmission", id);
  revalidatePath("/admin/messages");
}
