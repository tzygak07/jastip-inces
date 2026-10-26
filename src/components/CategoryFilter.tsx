"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/src/lib/airtable/types";

const ALL_CATEGORIES: Array<"Semua" | Category> = [
  "Semua",
  "Skincare",
  "Branded",
  "Food",
  "Cute Stuff",
  "Luggage",
  "Shoes",
  "Bags",
];

interface CategoryFilterProps {
  currentCategory?: string;
  batchId?: string;
  searchQuery?: string;
  currentSort?: string;
  onSelectCategory?: (category: string) => void;
}

export default function CategoryFilter({
  currentCategory,
  batchId,
  searchQuery,
  currentSort,
  onSelectCategory,
}: CategoryFilterProps) {
  const activeCat = currentCategory ?? "Semua";
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Hitung posisi dan lebar indikator aktif secara dinamis untuk animasi geser yang mulus
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateIndicator = () => {
      const activeEl = container.querySelector<HTMLElement>(
        `[data-category="${activeCat.toLowerCase()}"]`
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

    // Pastikan posisi ter-update saat resize window
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeCat]);

  return (
    <nav
      aria-label="Kategori Produk"
      className="relative border-b-2 border-brand-blue/20 pb-1 overflow-x-auto scrollbar-none"
    >
      <div
        ref={containerRef}
        className="relative flex items-center gap-2 sm:gap-3 min-h-[44px]"
      >
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = activeCat.toLowerCase() === cat.toLowerCase();

          const buttonClass = `relative font-body text-xs sm:text-sm whitespace-nowrap min-h-[44px] px-3 sm:px-3.5 flex items-center transition-all duration-200 ease-out focus-visible:outline-none rounded-md select-none cursor-pointer ${isSelected
              ? "text-brand-blue text-btn"
              : "text-brand-blue/70 hover:text-brand-blue text-label hover:bg-brand-tint/60"
            } active:scale-95`;

          if (onSelectCategory) {
            return (
              <button
                key={cat}
                type="button"
                data-category={cat.toLowerCase()}
                onClick={() => onSelectCategory(cat)}
                className={buttonClass}
              >
                {cat}
              </button>
            );
          }

          const params = new URLSearchParams();
          if (batchId) params.set("batch", batchId);
          if (cat !== "Semua") params.set("kategori", cat);
          if (searchQuery) params.set("q", searchQuery);
          if (currentSort) params.set("sort", currentSort);

          const href = `/?${params.toString()}#product-catalog`;

          return (
            <Link
              key={cat}
              href={href}
              data-category={cat.toLowerCase()}
              className={buttonClass}
            >
              {cat}
            </Link>
          );
        })}

        {/* Indikator geser (sliding underline) yang bergeser dan menyesuaikan lebar tombol secara mulus */}
        <span
          aria-hidden="true"
          className={`absolute -bottom-1 h-[3.5px] bg-brand-blue rounded-full pointer-events-none z-10 ${isMounted ? "transition-all duration-300 ease-out" : ""
            }`}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />
      </div>
    </nav>
  );
}

