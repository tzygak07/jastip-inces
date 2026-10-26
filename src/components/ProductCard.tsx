import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/src/lib/airtable/types";
import { formatRupiah } from "@/src/lib/format";
import { getWhatsAppLinkProduct } from "@/src/lib/whatsapp";
import { cloudinaryUrl } from "@/src/lib/cloudinary";


interface ProductCardProps {
  product: Product;
  batchName?: string;
  isBatchClosed?: boolean;
}

export default function ProductCard({
  product,
  batchName = "Katalog",
  isBatchClosed = false,
}: ProductCardProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productUrl = `${siteUrl}/barang/${product.id}`;

  const isSoldOut = product.stock === "Sold Out";

  const waLink = getWhatsAppLinkProduct({
    productName: product.name,
    batchName,
    price: product.price,
    productUrl,
  });

  return (
    <article className="bg-white border-2 border-brand-blue rounded-xl p-3 flex flex-col justify-between gap-3 relative transition-all">
      <div className="flex flex-col gap-2">
        {/* Photo Container */}
        <div className="w-full aspect-square sm:aspect-auto sm:h-44 rounded-lg overflow-hidden relative border-2 border-brand-blue/30 bg-brand-tint flex flex-col items-center justify-center text-center p-2.5 sm:p-3">
          {product.photoUrl ? (
            <Image
              src={cloudinaryUrl(product.photoUrl, 600)}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 w-full h-full stitched p-2">
              <span className="text-heading text-xs sm:text-sm text-brand-blue">
                [Foto {product.category ?? "Barang"}]
              </span>
              <span className="text-label font-body text-[11px] text-brand-blue/70 truncate max-w-full">
                {batchName}
              </span>
            </div>
          )}

          {/* Sold Out badge over image */}
          {isSoldOut ? (
            <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-brand-tint text-brand-blue text-btn text-xs rounded-full border-2 border-brand-blue z-10">
              Habis
            </span>
          ) : null}
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-1">
          {product.category ? (
            <span className="text-label font-body text-[11px] sm:text-xs text-brand-orange-text">
              {product.category}
            </span>
          ) : null}

          <h3 className="font-heading text-sm sm:text-base text-brand-blue mt-0.5 leading-snug line-clamp-2">
            <Link
              href={`/barang/${product.id}`}
              className="hover:underline focus-visible:outline-none after:absolute after:inset-0 after:z-0"
            >
              {product.name}
            </Link>
          </h3>

          {product.brand ? (
            <span className="text-label font-body text-xs text-brand-blue/70 truncate mt-0.5">
              {product.brand}
            </span>
          ) : null}
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="flex flex-col gap-2 pt-2 border-t-2 border-brand-tint relative z-10">
        {product.price !== undefined ? (
          <div className="text-display text-base sm:text-lg text-brand-blue tracking-tight">
            {formatRupiah(product.price)}
          </div>
        ) : (
          <div className="min-h-[1.5rem]" />
        )}

        {isBatchClosed ? (
          <button
            type="button"
            disabled
            className="product-cta min-h-[44px] w-full inline-flex items-center justify-center px-3 bg-brand-tint text-brand-blue opacity-70 cursor-not-allowed text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue pointer-events-none"
          >
            Batch sudah tutup
          </button>
        ) : isSoldOut ? (
          <button
            type="button"
            disabled
            className="min-h-[44px] w-full inline-flex items-center justify-center px-3 bg-brand-tint text-brand-blue opacity-70 cursor-not-allowed text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue"
          >
            Stok Habis
          </button>
        ) : waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="product-cta min-h-[44px] w-full inline-flex items-center justify-center px-3 bg-brand-orange hover:bg-brand-orange-text text-white text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover text-center"
          >
            Pesan lewat WhatsApp
          </a>
        ) : (
          <Link
            href={`/barang/${product.id}`}
            className="min-h-[44px] w-full inline-flex items-center justify-center px-3 bg-brand-orange text-white text-btn text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue"
          >
            Lihat Detail
          </Link>
        )}
      </div>
    </article>
  );
}
