import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/page-parts";
import { CreateUserForm, ResetPasswordForm, ChangeOwnPasswordForm } from "@/components/admin/user-forms";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { updateUser, deleteUser } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = await db.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <AdminPageHeader
        title="Admin Users"
        description="People who can sign in to this dashboard. Administrators manage everything; editors manage content."
        actions={<CreateUserForm />}
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-muted/60 text-[11px] uppercase tracking-wide text-fg-muted">
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Role</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Status</th>
              <th className="hidden px-4 py-3 font-semibold lg:table-cell">Joined</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === session.sub;
              return (
                <tr key={user.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-fg dark:bg-accent dark:text-accent-fg">
                        {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("") || "A"}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.name}
                          {isSelf && <span className="ml-2 text-xs text-fg-muted">(you)</span>}
                        </p>
                        <p className="text-xs text-fg-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 sm:table-cell">
                    <form action={updateUser} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="name" value={user.name} />
                      <input type="hidden" name="active" value={String(user.active)} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        disabled={isSelf}
                        className="h-8 rounded-lg border border-line bg-card px-2 text-xs text-foreground disabled:opacity-60"
                      >
                        <option value="ADMIN">Administrator</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                      {!isSelf && (
                        <button type="submit" className="text-xs font-medium text-accent-strong hover:underline">
                          Save
                        </button>
                      )}
                    </form>
                  </td>
                  <td className="hidden px-4 py-3.5 md:table-cell">
                    {user.active ? (
                      <Badge tone="success">Active</Badge>
                    ) : (
                      <Badge tone="neutral">Disabled</Badge>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-fg-muted lg:table-cell">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {!isSelf && (
                        <>
                          <form action={updateUser}>
                            <input type="hidden" name="id" value={user.id} />
                            <input type="hidden" name="name" value={user.name} />
                            <input type="hidden" name="role" value={user.role} />
                            <input type="hidden" name="active" value={String(!user.active)} />
                            <button
                              type="submit"
                              className="inline-flex h-8 items-center rounded-lg border border-line bg-card px-3 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent-strong"
                            >
                              {user.active ? "Disable" : "Enable"}
                            </button>
                          </form>
                          <ResetPasswordForm id={user.id} name={user.name} />
                          <form action={deleteUser}>
                            <input type="hidden" name="id" value={user.id} />
                            <ConfirmSubmit label="" message={`Delete ${user.name}'s account permanently?`} />
                          </form>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChangeOwnPasswordForm />
        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="font-display text-base font-semibold text-foreground">Password tips</h2>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-fg-muted">
            <li>• Passwords are stored as bcrypt hashes and can never be read by anyone — including administrators.</li>
            <li>• Any administrator can reset another member's password from the table above.</li>
            <li>• For production, share initial passwords through a secure channel and have each person change them here.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
