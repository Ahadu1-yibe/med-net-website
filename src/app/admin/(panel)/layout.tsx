import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Med-Net",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <AdminShell user={{ name: session.name, email: session.email, role: session.role }}>
      {children}
    </AdminShell>
  );
}
