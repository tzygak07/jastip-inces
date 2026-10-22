"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWhatsAppLinkGeneral } from "@/src/lib/whatsapp";

export default function Navbar() {
  const pathname = usePathname();
  const waLink = getWhatsAppLinkGeneral();

  const isKatalog = pathname === "/" || pathname.startsWith("/batch") || pathname.startsWith("/barang");
  const isCaraPesan = pathname === "/cara-pesan";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-brand-blue">
      <div className="h-20 max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[44px] min-w-[44px] rounded-lg focus-visible:outline-none"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-blue shrink-0 bg-white">
              <Image
                src="/logo.png"
                alt="Logo Jastip Nces Dong"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="font-heading font-extrabold text-brand-blue text-base sm:text-lg tracking-tight whitespace-nowrap">
              Jastip Nces Dong
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-6" aria-label="Navigasi Utama">
            <Link
              href="/"
              className={`transition-colors py-1 min-h-[44px] flex items-center text-sm sm:text-base ${
                isKatalog
                  ? "text-brand-blue border-b-2 border-brand-blue font-bold pb-1"
                  : "text-brand-blue/80 hover:text-brand-blue font-semibold"
              }`}
            >
              Katalog
            </Link>
            <Link
              href="/cara-pesan"
              className={`transition-colors py-1 min-h-[44px] flex items-center text-sm sm:text-base ${
                isCaraPesan
                  ? "text-brand-blue border-b-2 border-brand-blue font-bold pb-1"
                  : "text-brand-blue/80 hover:text-brand-blue font-semibold"
              }`}
            >
              Cara Pesan
            </Link>
          </nav>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-5 bg-brand-orange hover:bg-brand-orange-text text-white font-bold text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover shadow-none whitespace-nowrap"
            >
              Chat WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
