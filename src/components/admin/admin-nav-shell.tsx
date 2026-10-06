"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Cpu,
  Calculator,
  ShieldAlert,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface AdminNavShellProps {
  session: { email: string; role: string } | null;
  children: React.ReactNode;
}

export default function AdminNavShell({ session: initialSession, children }: AdminNavShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; role: string } | null>(initialSession);
  const [authChecked, setAuthChecked] = useState(false);

  const cleanPath = (pathname || "").replace(/\/$/, "");
  const isLoginPage = Boolean(cleanPath.endsWith("/admin/login") || cleanPath.includes("/admin/login"));

  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
      setAuthChecked(true);
      return;
    }

    if (typeof window !== "undefined") {
      const demoAuth = localStorage.getItem("gel_admin_demo_session");
      if (demoAuth === "true") {
        setSession({
          email: "admin@gaganelectronicslab.com",
          role: "Administrator",
        });
      }
    }
    setAuthChecked(true);
  }, [initialSession]);

  useEffect(() => {
    if (authChecked && !session && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [authChecked, session, isLoginPage, router]);

  // If on login page, render children directly without admin header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Waiting for client-side localStorage auth verification
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center text-xs text-stone-400">
        <div className="animate-pulse">Loading administration...</div>
      </div>
    );
  }

  // If unauthenticated and on a protected route, redirect to login
  if (!session) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center text-xs text-stone-500">
        Redirecting to login...
      </div>
    );
  }

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gel_admin_demo_session");
    }
    setSession(null);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // Fallback for static demo mode
    }
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Quotations", href: "/admin/quotes", icon: FileSpreadsheet },
    { name: "Machines & Catalog", href: "/admin/products", icon: Cpu },
    { name: "Pricing Config", href: "/admin/pricing", icon: Calculator },
    { name: "Audit Trail", href: "/admin/audit-logs", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                <span className="text-coral-300">G</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-stone-900 text-sm tracking-tight leading-none">
                  Gagan Electronics Lab
                </span>
                <span className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider mt-0.5">
                  Administration
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? cleanPath.endsWith("/admin") || pathname === "/admin"
                    : cleanPath.includes(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info and actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 px-2.5 py-1.5 rounded border border-stone-200 bg-[#FAF8F3]"
            >
              <span>View live site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-medium text-stone-800 block">
                {session?.email || "admin@gaganelectronicslab.com"}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                {session?.role || "Administrator"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-stone-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
