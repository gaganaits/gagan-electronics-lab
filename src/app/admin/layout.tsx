import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdminSession } from "@/lib/auth";
import AdminNavShell from "@/components/admin/admin-nav-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getCurrentAdminSession();

  // If unauthenticated, redirect to login unless on the login page
  // In Next.js App Router, the login route will have its own layout or check pathname
  return <AdminNavShell session={session}>{children}</AdminNavShell>;
}
