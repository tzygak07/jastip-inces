"use client";

import { useState } from "react";
import { getWhatsAppLinkProduct } from "@/src/lib/whatsapp";
import VariantPicker from "./VariantPicker";
import InfoRow from "./InfoRow";

interface ProductOrderSectionProps {
  productName: string;
  batchName: string;
  price?: number;
  variants: string[];
  estWeight?: string;
  isSoldOut: boolean;
  isBatchClosed: boolean;
  productUrl: string;
}

export default function ProductOrderSection({
  productName,
  batchName,
  price,
  variants,
  estWeight,
  isSoldOut,
  isBatchClosed,
  productUrl,
}: ProductOrderSectionProps) {
  // Varian pertama terpilih default
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    variants.length > 0 ? variants[0] : undefined
  );

  const waLink = getWhatsAppLinkProduct({
    productName,
    batchName,
    price,
    variant: selectedVariant,
    productUrl,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Variant Selection (jika ada varian) */}
      {variants.length > 0 ? (
        <VariantPicker
          variants={variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          disabled={isBatchClosed || isSoldOut}
        />
      ) : null}

      {/* Quick Specs: Est. Berat (hanya jika ada data) */}
      {estWeight ? (
        <InfoRow label="Est. Berat" value={estWeight} />
      ) : null}

      {/* Action Order Button */}
      <div className="flex flex-col gap-2 pt-2">
        {isBatchClosed ? (
          <button
            type="button"
            disabled
            className="w-full min-h-[52px] bg-brand-tint text-brand-blue opacity-70 cursor-not-allowed text-btn text-base rounded-[10px] border-2 border-brand-blue flex items-center justify-center gap-2"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-brand-blue"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Batch sudah tutup</span>
          </button>
        ) : isSoldOut ? (
          <button
            type="button"
            disabled
            className="w-full min-h-[52px] bg-brand-tint text-brand-blue opacity-70 cursor-not-allowed text-btn text-base rounded-[10px] border-2 border-brand-blue flex items-center justify-center gap-2"
          >
            <span>Stok Habis</span>
          </button>
        ) : waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[52px] bg-brand-orange hover:bg-brand-orange-text text-white text-btn text-base sm:text-lg rounded-[10px] border-2 border-brand-blue flex items-center justify-center gap-2.5 shadow-[2px_2px_0px_#0B3C91] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none btn-hover transition-all text-center px-4"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-white shrink-0"
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
            <span>Pesan lewat WhatsApp</span>
          </a>
        ) : (
          <div className="w-full min-h-[52px] bg-brand-tint text-brand-blue text-body rounded-[10px] border-2 border-brand-blue flex items-center justify-center text-xs sm:text-sm text-center px-4">
            Nomor WhatsApp pemesanan belum dikonfigurasi.
          </div>
        )}

        <p className="font-body text-xs text-center text-brand-blue/80">
          Pesanan akan langsung diteruskan ke WhatsApp official Jastip Nces Dong.
        </p>
      </div>
    </div>
  );
}
