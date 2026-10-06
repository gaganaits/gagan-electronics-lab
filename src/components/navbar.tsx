"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { name: "Products", href: "/products" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "Applications", href: "/applications" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If in admin area, display admin navigation instead
  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) {
    return null; // Admin has its own dedicated layout
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:pt-6 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Main Floating Pill Container */}
        <nav
          aria-label="Main Navigation"
          className="pill-navbar pointer-events-auto w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center justify-between shadow-soft transition-all duration-300"
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Gagan Electronics Lab Home"
          >
            {/* Precision Geometric Mark */}
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              <span className="text-coral-300">G</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-900 text-sm sm:text-base tracking-tight leading-tight">
                Gagan Electronics Lab
              </span>
              <span className="text-[11px] text-stone-500 font-medium tracking-wide leading-none hidden sm:block">
                3D Printing & Prototyping
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-stone-200/70 text-stone-900"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action / Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Primary CTA Button */}
            <Link
              href="/request-quote"
              className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1.5 group"
            >
              <span>Request a quote</span>
              <span className="w-1.5 h-1.5 rounded-full bg-coral-300 group-hover:scale-125 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-900"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto fixed inset-x-4 top-20 z-40 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-card-md p-6 shadow-soft-lg animate-fade-in">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-card-sm text-base font-medium flex items-center justify-between ${
                    isActive
                      ? "bg-stone-100 text-stone-900 font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/request-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-center text-sm font-semibold bg-stone-900 text-white block shadow-sm"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
