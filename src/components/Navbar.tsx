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
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  const activeItem =
    NAV_ITEMS.find((item) => item.isActive(pathname)) ?? NAV_ITEMS[0];

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
      <div className="h-20 max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[44px] min-w-[44px] rounded-lg focus-visible:outline-none select-none active:scale-95 transition-transform"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-blue shrink-0 bg-white shadow-[1px_1px_0px_#0B3C91]">
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

          {/* Navigation Links with Sliding Underline Indicator */}
          <nav
            ref={navRef}
            className="relative flex items-center gap-1 sm:gap-2 pb-1"
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
                      ? "text-brand-blue font-bold"
                      : "text-brand-blue/70 hover:text-brand-blue font-semibold hover:bg-brand-tint/60"
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

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 sm:px-5 bg-brand-orange hover:bg-brand-orange-text text-white font-bold text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover shadow-[2px_2px_0px_#0B3C91] whitespace-nowrap"
            >
              Chat WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
