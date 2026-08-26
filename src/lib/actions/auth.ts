"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, setSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";
import { logAudit } from "@/lib/actions/audit";

export type LoginState = { ok: boolean; message: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email and password." };
  }

  const user = await db.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !user.active || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, message: "Invalid credentials. Please try again." };
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setSessionCookie(token);
  await logAudit("login", "AdminUser", user.id);

  const from = formData.get("from");
  const target = typeof from === "string" && from.startsWith("/admin") ? from : "/admin";
  redirect(target);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
