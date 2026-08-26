"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, hashPassword, verifyPassword, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/actions/audit";
import { userCreateSchema } from "@/lib/validators";
import { str, firstError, type ActionState } from "@/lib/actions/helpers";

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (session.role !== "ADMIN") return { ok: false, message: "Only administrators can manage users." };

  const parsed = userCreateSchema.safeParse({
    name: str(formData, "name"),
    email: str(formData, "email"),
    password: str(formData, "password"),
    role: str(formData, "role") || "ADMIN",
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  try {
    const exists = await db.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (exists) return { ok: false, message: "A user with this email already exists." };
    const user = await db.adminUser.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role,
      },
    });
    await logAudit("create", "AdminUser", user.id, { email: user.email });
    revalidatePath("/admin/users");
    return { ok: true, message: `User ${user.email} created.` };
  } catch {
    return { ok: false, message: "Could not create the user." };
  }
}

export async function updateUser(formData: FormData) {
  const session = await requireAdmin();
  if (session.role !== "ADMIN") return;
  const id = str(formData, "id");
  if (!id) return;
  const name = str(formData, "name");
  const role = str(formData, "role");
  const active = str(formData, "active") === "true";
  if (id === session.sub && (!active || role !== "ADMIN")) return;
  try {
    await db.adminUser.update({ where: { id }, data: { name, role, active } });
    await logAudit("update", "AdminUser", id, { name, role, active });
    revalidatePath("/admin/users");
  } catch {}
}

export async function resetUserPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  if (session.role !== "ADMIN") return { ok: false, message: "Only administrators can reset passwords." };
  const id = str(formData, "id");
  const password = str(formData, "password");
  if (!id) return { ok: false, message: "Missing user." };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };
  try {
    await db.adminUser.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
    await logAudit("update", "AdminUser", id, { password: "reset" });
    revalidatePath("/admin/users");
    return { ok: true, message: "Password updated." };
  } catch {
    return { ok: false, message: "Could not reset the password." };
  }
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  if (session.role !== "ADMIN") return;
  const id = str(formData, "id");
  if (!id || id === session.sub) return;
  try {
    await db.adminUser.delete({ where: { id } });
    await logAudit("delete", "AdminUser", id);
    revalidatePath("/admin/users");
  } catch {}
}

export async function changeOwnPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const current = str(formData, "currentPassword");
  const next = str(formData, "newPassword");
  if (next.length < 8) return { ok: false, message: "New password must be at least 8 characters." };
  try {
    const user = await db.adminUser.findUnique({ where: { id: session.sub } });
    if (!user || !(await verifyPassword(current, user.passwordHash))) {
      return { ok: false, message: "Current password is incorrect." };
    }
    await db.adminUser.update({
      where: { id: session.sub },
      data: { passwordHash: await hashPassword(next) },
    });
    await logAudit("update", "AdminUser", session.sub, { password: "changed" });
    return { ok: true, message: "Password changed successfully." };
  } catch {
    return { ok: false, message: "Could not change the password." };
  }
}

export async function currentUserExists() {
  const session = await getSession();
  return Boolean(session);
}
