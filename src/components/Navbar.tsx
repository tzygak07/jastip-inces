"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWhatsAppLinkGeneral } from "@/src/lib/whatsapp";

interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "katalog",
    label: "Katalog",
    href: "/",
    isActive: (path: string) =>
      path === "/" || path.startsWith("/batch") || path.startsWith("/barang"),
  },
  {
    id: "cara-pesan",
    label: "Cara Pesan",
    href: "/cara-pesan",
    isActive: (path: string) => path === "/cara-pesan",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const waLink = getWhatsAppLinkGeneral();
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  const activeItem =
    NAV_ITEMS.find((item) => item.isActive(pathname)) ?? NAV_ITEMS[0];

  // Tutup menu saat rute berpindah (pola React 19: adjust state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Tutup menu saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Update sliding indicator underline desktop
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateIndicator = () => {
      const activeEl = nav.querySelector<HTMLElement>(
        `[data-nav-id="${activeItem.id}"]`
      );

      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    setIsMounted(true);

    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [pathname, activeItem.id]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-brand-blue">
      <div className="h-20 max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] min-w-[44px] rounded-lg focus-visible:outline-none select-none active:scale-95 transition-transform"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-brand-blue shrink-0 bg-white shadow-[1px_1px_0px_#0B3C91]">
              <Image
                src="/logo.png"
                alt="Logo Jastip Nces Dong"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-display text-brand-blue text-sm sm:text-base md:text-lg tracking-tight whitespace-nowrap">
              Jastip Nces Dong
            </span>
          </Link>

          {/* Desktop Navigation Links with Sliding Underline Indicator */}
          <nav
            ref={navRef}
            className="relative hidden md:flex items-center gap-1 sm:gap-2 pb-1"
            aria-label="Navigasi Utama"
          >
            {NAV_ITEMS.map((item) => {
              const isSelected = activeItem.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  data-nav-id={item.id}
                  className={`relative font-body text-xs sm:text-sm md:text-base whitespace-nowrap min-h-[44px] px-3 sm:px-3.5 flex items-center transition-all duration-200 ease-out focus-visible:outline-none rounded-md select-none cursor-pointer ${
                    isSelected
                      ? "text-brand-blue text-btn"
                      : "text-brand-blue/70 hover:text-brand-blue text-label hover:bg-brand-tint/60"
                  } active:scale-95`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Sliding Indicator Underline */}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 h-[3px] bg-brand-blue rounded-full pointer-events-none z-10 ${
                isMounted ? "transition-all duration-300 ease-out" : ""
              }`}
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </nav>
        </div>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-4 sm:px-5 bg-brand-orange hover:bg-brand-orange-text text-white text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover shadow-[2px_2px_0px_#0B3C91] whitespace-nowrap"
            >
              Chat WhatsApp
            </a>
          ) : null}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] w-11 h-11 rounded-[10px] border-2 border-brand-blue bg-white hover:bg-brand-tint text-brand-blue transition-all active:scale-95 select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-orange shadow-[2px_2px_0px_#0B3C91] active:shadow-none"
        >
          {isOpen ? (
            // Close 'X' Icon
            <svg
              className="w-6 h-6 text-brand-blue"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              className="w-6 h-6 text-brand-blue"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 top-20 bg-brand-blue/30 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Dropdown Menu */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
        className={`fixed top-20 left-0 right-0 z-50 bg-white border-b-2 border-brand-blue shadow-xl md:hidden transition-all duration-200 ease-out origin-top ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="max-w-[1120px] mx-auto px-4 py-5 flex flex-col gap-4">
          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-2" aria-label="Menu Mobile">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeItem.id === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center min-h-[48px] px-4 rounded-xl border-2 transition-all text-heading text-sm active:scale-[0.99] select-none ${
                    isSelected
                      ? "bg-brand-tint border-brand-blue text-brand-blue shadow-[2px_2px_0px_#0B3C91]"
                      : "bg-white border-brand-blue/30 text-brand-blue hover:bg-brand-tint/60 hover:border-brand-blue"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.id === "katalog" ? (
                      <svg
                        className="w-5 h-5 text-brand-blue"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-brand-blue"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile WhatsApp CTA Button */}
          {waLink ? (
            <div className="pt-2 border-t-2 border-brand-tint flex flex-col gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full min-h-[48px] px-4 bg-brand-orange hover:bg-brand-orange-text text-white text-btn text-sm rounded-xl border-2 border-brand-blue shadow-[2px_2px_0px_#0B3C91] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none btn-hover transition-all text-center select-none"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Chat WhatsApp</span>
              </a>
              <p className="font-body text-[11px] text-center text-brand-blue/70">
                Hubungi admin untuk tanya stok atau custom request
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
