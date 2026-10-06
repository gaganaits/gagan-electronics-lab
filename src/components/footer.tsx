import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-stone-200/80 bg-[#FAF8F3] pt-16 pb-12 mt-24 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                <span className="text-coral-300">G</span>
              </div>
              <span className="font-semibold text-stone-900 text-base tracking-tight">
                Gagan Electronics Lab
              </span>
            </Link>
            <p className="text-sm text-stone-600 leading-relaxed">
              Industrial and precision 3D printing for functional prototypes, electronic enclosures, custom tooling, and end-use mechanical components.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Confidential CAD File Handling</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Printers & Hardware
                </Link>
              </li>
              <li>
                <Link href="/capabilities" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Capabilities & Materials
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Applications & Industries
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-stone-600 hover:text-stone-900 transition-colors">
                  About the Lab
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Privacy Policy & Data Retention
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-stone-400 hover:text-stone-600 text-xs transition-colors flex items-center gap-1">
                  <span>Staff Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-4">
              Direct Inquiries
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                <span className="select-all">quotes@gaganelectronicslab.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                <span>Electronics & Fabrication Studio, Punjab / Delhi NCR, India</span>
              </li>
              <li className="pt-2 text-xs text-stone-500">
                Operating Hours: Mon – Sat, 9:00 AM – 7:00 PM IST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Gagan Electronics Lab. All rights reserved.</p>
          <p className="text-stone-400">
            Precision engineering · Digital minimalism · Human craft
          </p>
        </div>
      </div>
    </footer>
  );
}
