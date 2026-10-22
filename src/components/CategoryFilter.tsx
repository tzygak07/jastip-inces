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
}

export default function CategoryFilter({
  currentCategory,
  batchId,
  searchQuery,
  currentSort,
}: CategoryFilterProps) {
  const activeCat = currentCategory ?? "Semua";

  return (
    <nav
      aria-label="Kategori Produk"
      className="border-b-2 border-brand-blue pb-1 overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-4 sm:gap-6 min-h-[44px]">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = activeCat.toLowerCase() === cat.toLowerCase();

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
              className={`font-body text-xs sm:text-sm whitespace-nowrap min-h-[44px] flex items-center transition-colors ${
                isSelected
                  ? "text-brand-blue border-b-2 border-brand-blue font-bold pb-1"
                  : "text-brand-blue/80 hover:text-brand-blue font-semibold"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
