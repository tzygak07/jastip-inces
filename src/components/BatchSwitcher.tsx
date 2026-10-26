import Link from "next/link";
import type { Batch } from "@/src/lib/airtable/types";
import { getEffectiveStatus } from "@/src/lib/airtable/batches";

interface BatchSwitcherProps {
  batches: Batch[];
  selectedBatchId: string;
  currentCategory?: string;
  searchQuery?: string;
  currentSort?: string;
}

export default function BatchSwitcher({
  batches,
  selectedBatchId,
  currentCategory,
  searchQuery,
  currentSort,
}: BatchSwitcherProps) {
  if (batches.length <= 1) return null;

  return (
    <nav aria-label="Pemilih Batch" className="flex flex-col gap-1.5">
      <span className="text-heading text-xs text-brand-blue">
        Pilih batch perjalanan
      </span>
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none"
        role="tablist"
      >
        {batches.map((b) => {
          const isSelected = b.id === selectedBatchId;
          const status = getEffectiveStatus(b);
          const statusLabel = status === "Open" ? "Buka" : "Tutup";

          // Susun query string agar filter lain tetap terjaga
          const params = new URLSearchParams();
          params.set("batch", b.id);
          if (currentCategory) params.set("kategori", currentCategory);
          if (searchQuery) params.set("q", searchQuery);
          if (currentSort) params.set("sort", currentSort);

          const href = `/?${params.toString()}#product-catalog`;

          return (
            <Link
              key={b.id}
              href={href}
              role="tab"
              aria-selected={isSelected}
              className={`px-3.5 py-1.5 min-h-[44px] inline-flex items-center rounded-full border-2 border-brand-blue text-xs sm:text-sm whitespace-nowrap transition-colors focus-visible:outline-none ${
                isSelected
                  ? "bg-brand-blue text-white text-btn"
                  : "bg-white text-brand-blue text-label hover:bg-brand-tint"
              }`}
            >
              {b.name}
              {b.country ? ` · ${b.country}` : ""} · {statusLabel}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
