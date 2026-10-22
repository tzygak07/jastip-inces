import { connection } from "next/server";
import Link from "next/link";
import { getBatches, getEffectiveStatus } from "@/src/lib/airtable/batches";
import { getProducts } from "@/src/lib/airtable/products";
import type { Batch, Product } from "@/src/lib/airtable/types";

import BatchBanner from "@/src/components/BatchBanner";
import BatchSwitcher from "@/src/components/BatchSwitcher";
import CategoryFilter from "@/src/components/CategoryFilter";
import CatalogControls from "@/src/components/CatalogControls";
import ProductCard from "@/src/components/ProductCard";
import CustomRequestBox from "@/src/components/CustomRequestBox";

interface HomePageProps {
  searchParams: Promise<{
    batch?: string;
    kategori?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function HomePage(props: HomePageProps) {
  await connection(); // render per-request, bukan prerender
  const nowMs = Date.now();

  const searchParams = await props.searchParams;
  const batchParam = searchParams.batch;
  const categoryParam = searchParams.kategori;
  const queryParam = searchParams.q?.trim().toLowerCase();
  const sortParam = searchParams.sort ?? "terbaru";

  let batches: Batch[] = [];
  let allProducts: Product[] = [];
  let fetchError = false;

  try {
    [batches, allProducts] = await Promise.all([getBatches(), getProducts()]);
  } catch (err) {
    console.error("[Homepage] Error fetching Airtable data:", err);
    fetchError = true;
  }

  // Pilih batch aktif:
  // 1. Berdasarkan query param ?batch=... jika valid
  // 2. Atau batch Open terbaru
  // 3. Fallback ke batch pertama (Closed)
  let activeBatch: Batch | undefined;
  if (batches.length > 0) {
    if (batchParam) {
      activeBatch = batches.find((b) => b.id === batchParam);
    }
    if (!activeBatch) {
      activeBatch =
        batches.find((b) => getEffectiveStatus(b, nowMs) === "Open") ?? batches[0];
    }
  }

  const isBatchClosed = activeBatch
    ? getEffectiveStatus(activeBatch, nowMs) === "Closed"
    : false;

  // Filter barang per batch
  let displayedProducts = activeBatch
    ? allProducts.filter((p) => p.batchId === activeBatch.id)
    : allProducts;

  // Filter per kategori
  if (categoryParam && categoryParam.toLowerCase() !== "semua") {
    displayedProducts = displayedProducts.filter(
      (p) => p.category?.toLowerCase() === categoryParam.toLowerCase()
    );
  }

  // Filter pencarian
  if (queryParam) {
    displayedProducts = displayedProducts.filter((p) => {
      const matchName = p.name.toLowerCase().includes(queryParam);
      const matchBrand = p.brand?.toLowerCase().includes(queryParam) ?? false;
      const matchCat = p.category?.toLowerCase().includes(queryParam) ?? false;
      return matchName || matchBrand || matchCat;
    });
  }

  // Pengurutan
  if (sortParam === "murah") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
    );
  } else if (sortParam === "mahal") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (b.price ?? 0) - (a.price ?? 0)
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* PAGE TITLE SECTION (Maksimal 2 sparkle sesuai DESIGN.md) */}
        <header className="text-center flex flex-col items-center gap-1 pt-1">
          <h1 className="font-heading text-2xl sm:text-4xl text-brand-blue tracking-tight">
            ✦ Katalog Titipan ✦
          </h1>
          <p className="font-body text-sm sm:text-base text-brand-blue font-semibold">
            You want it, we get it!
          </p>
        </header>

        {/* ERROR STATE */}
        {fetchError ? (
          <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-tint border-2 border-brand-blue flex items-center justify-center text-brand-blue font-heading text-2xl font-extrabold">
              !
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg sm:text-xl text-brand-blue">
                Koneksi terganggu
              </h2>
              <p className="font-body text-xs sm:text-sm text-brand-blue/80">
                Katalog gagal dimuat. Silakan periksa kembali koneksi atau konfigurasi Airtable kamu.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 bg-brand-blue text-white font-bold text-sm rounded-[10px] border-2 border-brand-blue hover:bg-brand-blue/90 transition-all btn-hover"
            >
              Coba lagi
            </Link>
          </div>
        ) : (
          <>
            {/* CURRENT-BATCH HERO BANNER */}
            {activeBatch ? <BatchBanner batch={activeBatch} /> : null}

            {/* BATCH SWITCHER */}
            {activeBatch ? (
              <BatchSwitcher
                batches={batches}
                selectedBatchId={activeBatch.id}
                currentCategory={categoryParam}
                searchQuery={queryParam}
                currentSort={sortParam}
              />
            ) : null}

            {/* CATEGORY FILTER */}
            <CategoryFilter
              currentCategory={categoryParam}
              batchId={activeBatch?.id}
              searchQuery={queryParam}
              currentSort={sortParam}
            />

            {/* SEARCH & SORT TOOLBAR */}
            <CatalogControls
              initialSearch={queryParam}
              initialSort={sortParam}
            />

            {/* PRODUCT GRID CONTAINER */}
            <div className="w-full">
              {displayedProducts.length > 0 ? (
                /* Grid 2 kolom di HP, 4 kolom di desktop per PAGES.md */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      batchName={activeBatch?.name ?? "Katalog"}
                      isBatchClosed={isBatchClosed}
                    />
                  ))}
                </div>
              ) : queryParam ? (
                /* Pencarian Nihil */
                <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
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
                  <h3 className="font-heading text-base sm:text-lg text-brand-blue">
                    Barang tidak ditemukan
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-brand-blue/80 max-w-md">
                    Tidak ada barang yang cocok dengan kata kunci &quot;{queryParam}&quot;.
                  </p>
                  <Link
                    href={activeBatch ? `/?batch=${activeBatch.id}#product-catalog` : "/"}
                    className="inline-flex items-center justify-center min-h-[44px] px-5 bg-brand-tint text-brand-blue font-bold text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue mt-2"
                  >
                    Hapus pencarian
                  </Link>
                </div>
              ) : (
                /* Empty State Batch */
                <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
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
                    <h3 className="font-heading text-base sm:text-lg text-brand-blue">
                      Belum ada barang di batch ini.
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-brand-blue/80 max-w-md">
                      Coba pilih kategori lain atau request barang yang kamu mau lewat WhatsApp.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CUSTOM REQUEST BOX */}
            <CustomRequestBox />
          </>
        )}
      </div>
    </div>
  );
}
