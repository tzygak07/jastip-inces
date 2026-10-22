"use client";

import { useState } from "react";
import type { Product } from "@/src/lib/airtable/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  batchName?: string;
  isBatchClosed?: boolean;
}

const INITIAL_COUNT = 12;
const PAGE_SIZE = 12;

export default function ProductGrid({
  products,
  batchName = "Katalog",
  isBatchClosed = false,
}: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [prevProducts, setPrevProducts] = useState(products);

  if (products !== prevProducts) {
    setPrevProducts(products);
    setVisibleCount(INITIAL_COUNT);
  }

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Grid 2 kolom di HP, 4 kolom di desktop per PAGES.md */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            batchName={batchName}
            isBatchClosed={isBatchClosed}
          />
        ))}
      </div>

      {/* Button Lihat Lebih Banyak Barang */}
      {hasMore ? (
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          <button
            type="button"
            onClick={handleLoadMore}
            className="min-h-[44px] px-6 py-2.5 bg-white hover:bg-brand-tint text-brand-blue font-bold text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue shadow-[2px_2px_0px_#0B3C91] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none btn-hover transition-all text-center flex items-center justify-center"
          >
            Lihat lebih banyak barang
          </button>
        </div>
      ) : null}
    </div>
  );
}
