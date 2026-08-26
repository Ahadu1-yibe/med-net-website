import "server-only";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function logAudit(action: string, entity: string, entityId?: string, meta?: unknown) {
  try {
    const session = await getSession();
    await db.auditLog.create({
      data: {
        userId: session?.sub,
        userEmail: session?.email,
        action,
        entity,
        entityId,
        meta: meta ? JSON.stringify(meta) : undefined,
      },
    });
  } catch {
  }
}
