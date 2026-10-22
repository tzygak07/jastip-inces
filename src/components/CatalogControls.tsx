"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface CatalogControlsProps {
  initialSearch?: string;
  initialSort?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
}

export default function CatalogControls({
  initialSearch = "",
  initialSort = "terbaru",
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
}: CatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearchChange) return; // mode terkontrol

    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string)?.trim() ?? "";

    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}#product-catalog`);
    });
  };

  const handleSortChange = (newSort: string) => {
    if (onSortChange) {
      onSortChange(newSort);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newSort) {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}#product-catalog`);
    });
  };

  const isControlledSearch = typeof onSearchChange === "function";

  return (
    <div
      className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 w-full"
      id="product-catalog"
    >
      {/* Search Input Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 relative flex items-center"
      >
        <label htmlFor="search-input" className="sr-only">
          Cari barang di batch ini
        </label>
        <span
          aria-hidden="true"
          className="absolute left-3 text-brand-blue select-none pointer-events-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </span>
        <input
          id="search-input"
          name="q"
          type="search"
          {...(isControlledSearch
            ? {
                value: searchQuery ?? "",
                onChange: (e) => onSearchChange(e.target.value),
              }
            : {
                defaultValue: initialSearch,
              })}
          placeholder="Cari barang di batch ini..."
          className="w-full min-h-[44px] pl-10 pr-4 bg-white text-brand-blue font-body text-sm border-2 border-brand-blue rounded-[10px] placeholder:text-brand-blue/50 focus:outline-none"
        />
        <button
          type="submit"
          className="sr-only"
          disabled={isPending}
        >
          Cari
        </button>
      </form>

      {/* Sort Select */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <label
          htmlFor="sort-select"
          className="font-body text-xs sm:text-sm text-brand-blue font-bold whitespace-nowrap"
        >
          Urutkan:
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={currentSort ?? initialSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none min-h-[44px] pl-3.5 pr-8 bg-white text-brand-blue font-body text-xs sm:text-sm font-semibold border-2 border-brand-blue rounded-[10px] cursor-pointer focus:outline-none"
          >
            <option value="terbaru">Terbaru</option>
            <option value="murah">Harga terendah</option>
            <option value="mahal">Harga tertinggi</option>
          </select>
          <span
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-blue font-bold text-xs"
          >
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}
