"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/src/lib/airtable/types";
import CategoryFilter from "./CategoryFilter";
import CatalogControls from "./CatalogControls";
import ProductGrid from "./ProductGrid";

interface CatalogSectionProps {
  products: Product[];
  batchName?: string;
  isBatchClosed?: boolean;
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: string;
}

export default function CatalogSection({
  products,
  batchName = "Katalog",
  isBatchClosed = false,
  initialCategory = "Semua",
  initialSearch = "",
  initialSort = "terbaru",
}: CatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "Semua");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [sortOrder, setSortOrder] = useState(initialSort || "terbaru");

  // Sinkronisasi query parameter URL tanpa me-reload atau re-render seluruh halaman
  const updateUrl = (cat: string, query: string, sortVal: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);

    if (cat && cat.toLowerCase() !== "semua") {
      url.searchParams.set("kategori", cat);
    } else {
      url.searchParams.delete("kategori");
    }

    if (query.trim()) {
      url.searchParams.set("q", query.trim());
    } else {
      url.searchParams.delete("q");
    }

    if (sortVal && sortVal !== "terbaru") {
      url.searchParams.set("sort", sortVal);
    } else {
      url.searchParams.delete("sort");
    }

    window.history.pushState({}, "", url.toString());
  };

  // Dengarkan tombol back/forward browser agar state kategori/search/sort tetap sinkron
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      setActiveCategory(url.searchParams.get("kategori") ?? "Semua");
      setSearchQuery(url.searchParams.get("q") ?? "");
      setSortOrder(url.searchParams.get("sort") ?? "terbaru");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCategoryChange = (newCat: string) => {
    setActiveCategory(newCat);
    updateUrl(newCat, searchQuery, sortOrder);
  };

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    updateUrl(activeCategory, newQuery, sortOrder);
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    updateUrl(activeCategory, searchQuery, newSort);
  };

  // Filter & Sort di client-side (langsung di memori, 0ms, super mulus tanpa request server)
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter Kategori
    if (activeCategory && activeCategory.toLowerCase() !== "semua") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter Pencarian
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q) ?? false;
        const matchCat = p.category?.toLowerCase().includes(q) ?? false;
        return matchName || matchBrand || matchCat;
      });
    }

    // Pengurutan
    if (sortOrder === "murah") {
      return [...result].sort(
        (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
      );
    } else if (sortOrder === "mahal") {
      return [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else {
      // Default: "terbaru"
      return [...result].sort((a, b) => {
        if (a.addedAt && b.addedAt) {
          const timeA = new Date(a.addedAt).getTime();
          const timeB = new Date(b.addedAt).getTime();
          if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
            return timeB - timeA;
          }
          return 0;
        }
        if (a.addedAt && !b.addedAt) return -1;
        if (!a.addedAt && b.addedAt) return 1;
        return 0;
      });
    }
  }, [products, activeCategory, searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Category Filter */}
      <CategoryFilter
        currentCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Search & Sort Toolbar */}
      <CatalogControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentSort={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Product Grid / State Tampilan dengan transisi halus saat filter berganti */}
      <div
        key={`${activeCategory}-${searchQuery}-${sortOrder}`}
        className="w-full fade-in"
      >
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            batchName={batchName}
            isBatchClosed={isBatchClosed}
          />
        ) : searchQuery.trim() ? (
          /* Pencarian Nihil */
          <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 fade-in">
            <div className="w-12 h-12 rounded-full bg-brand-tint border-2 border-brand-blue flex items-center justify-center text-brand-blue">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-heading text-base sm:text-lg text-brand-blue">
              Barang tidak ditemukan
            </h3>
            <p className="font-body text-xs sm:text-sm text-brand-blue/80 max-w-md">
              Tidak ada barang yang cocok dengan kata kunci &quot;{searchQuery.trim()}&quot;.
            </p>
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="inline-flex items-center justify-center min-h-[44px] px-5 bg-brand-tint text-brand-blue text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue mt-2 btn-hover"
            >
              Hapus pencarian
            </button>
          </div>
        ) : (
          /* Kategori Kosong */
          <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 fade-in">
            <div className="w-12 h-12 rounded-full bg-brand-tint border-2 border-brand-blue flex items-center justify-center text-brand-blue">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-heading text-base sm:text-lg text-brand-blue">
                Belum ada barang di kategori ini.
              </h3>
              <p className="font-body text-xs sm:text-sm text-brand-blue/80 max-w-md">
                Coba pilih kategori lain atau request barang yang kamu mau lewat WhatsApp.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
