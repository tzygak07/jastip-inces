import type { Batch } from "@/src/lib/airtable/types";
import { getEffectiveStatus } from "@/src/lib/airtable/batches";
import { formatDate } from "@/src/lib/format";

import Link from "next/link";

interface BatchBannerProps {
  batch: Batch;
  variant?: "full" | "compact";
}

export default function BatchBanner({
  batch,
  variant = "full",
}: BatchBannerProps) {
  const status = getEffectiveStatus(batch);
  const isOpen = status === "Open";

  if (variant === "compact") {
    return (
      <div className="relative w-full bg-white rounded-xl border-2 border-dashed border-brand-blue p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
        {/* Hang Tag Motif: EXACTLY ONE HEART TAG ON SCREEN */}
        <div
          aria-hidden="true"
          className="absolute -top-1 right-2 sm:right-3 pointer-events-none select-none z-10"
        >
          <div className="w-6 h-8 flex flex-col items-center">
            <div className="w-[2px] h-3 bg-brand-blue" />
            <div className="w-5 h-5 rounded-full bg-brand-orange border-2 border-brand-blue flex items-center justify-center text-white text-[10px] font-bold shadow-[1px_1px_0px_#0B3C91]">
              ♥
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 pr-8 sm:pr-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full border-2 border-brand-blue bg-brand-tint text-brand-blue">
              {batch.name}
              {batch.country ? ` · ${batch.country}` : ""}
            </span>
            <span
              className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-full border-2 border-brand-blue ${
                isOpen
                  ? "bg-brand-orange text-white"
                  : "bg-brand-tint text-brand-blue"
              }`}
            >
              {isOpen ? "Buka" : "Tutup"}
            </span>
          </div>
          <p className="font-body text-xs sm:text-sm text-brand-blue mt-0.5 font-normal">
            {batch.closeDate ? `Batas titip: ${formatDate(batch.closeDate)}` : null}
            {batch.closeDate && batch.estimatedArrival ? " · " : ""}
            {batch.estimatedArrival
              ? `Est. tiba: ${formatDate(batch.estimatedArrival)}`
              : null}
          </p>
        </div>

        <Link
          href={`/?batch=${batch.id}#product-catalog`}
          className="self-start sm:self-auto min-h-[44px] px-3.5 py-1.5 inline-flex items-center rounded-[10px] border-2 border-brand-blue bg-white text-brand-blue hover:bg-brand-tint font-semibold text-xs whitespace-nowrap transition-colors"
        >
          Lihat Batch Ini
        </Link>
      </div>
    );
  }

  return (
    <section className="relative w-full bg-white rounded-xl border-2 border-brand-blue p-4 sm:p-6 overflow-hidden">
      {/* Stitched Inset Boundary */}
      <div className="absolute inset-[6px] rounded-[8px] pointer-events-none stitched" />

      {/* Hang Tag Motif: EXACTLY ONE HEART TAG ON SCREEN */}
      <div
        aria-hidden="true"
        className="absolute top-2 right-4 sm:right-8 z-10 flex flex-col items-center select-none"
      >
        <div className="w-[2px] h-3 bg-brand-blue" />
        <div className="relative w-12 h-11 flex items-center justify-center">
          <svg
            className="w-full h-full drop-shadow-none"
            fill="#E8502A"
            stroke="#0B3C91"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 48 44"
          >
            <path d="M24 39.5 C24 39.5 5 28 5 15 C5 7 11.5 3 18 3 C22.5 3 24 7 24 7 C24 7 25.5 3 30 3 C36.5 3 43 7 43 15 C43 28 24 39.5 24 39.5 Z" />
          </svg>
          <span className="absolute font-heading text-[11px] leading-[14px] text-white font-bold text-center tracking-wide -mt-1">
            Trip
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-12 md:pr-16">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center justify-center px-3 py-0.5 font-bold text-xs rounded-full border-2 border-brand-blue ${
                isOpen
                  ? "bg-brand-orange text-white"
                  : "bg-brand-tint text-brand-blue"
              }`}
            >
              {isOpen ? "Buka" : "Tutup"}
            </span>
            <span className="font-body text-xs text-brand-blue font-bold">
              Current Drop
            </span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl text-brand-blue">
            {batch.name}
            {batch.country ? ` · ${batch.country}` : ""}
          </h2>

          <div className="flex items-center gap-3 flex-wrap font-body text-xs sm:text-sm text-brand-blue font-normal">
            {batch.closeDate ? (
              <span>Batas titip: {formatDate(batch.closeDate)}</span>
            ) : null}

            {batch.closeDate && batch.estimatedArrival ? (
              <span className="hidden sm:inline" aria-hidden="true">
                •
              </span>
            ) : null}

            {batch.estimatedArrival ? (
              <span>Estimasi tiba: {formatDate(batch.estimatedArrival)}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center pt-2 md:pt-0">
          <a
            href="#product-catalog"
            className="inline-flex items-center justify-center min-h-[44px] px-5 bg-brand-blue text-white font-bold text-sm rounded-[10px] border-2 border-brand-blue hover:bg-brand-blue/90 transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover whitespace-nowrap"
          >
            Lihat barang batch ini
          </a>
        </div>
      </div>
    </section>
  );
}
