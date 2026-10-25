import Link from "next/link";
import { getBatches, getEffectiveStatus } from "@/src/lib/airtable/batches";
import { getProducts } from "@/src/lib/airtable/products";
import type { Batch, Product } from "@/src/lib/airtable/types";

import BatchBanner from "@/src/components/BatchBanner";
import BatchSwitcher from "@/src/components/BatchSwitcher";
import CatalogSection from "@/src/components/CatalogSection";
import CustomRequestBox from "@/src/components/CustomRequestBox";

export const revalidate = 21600; // harus sama dengan AIRTABLE_REVALIDATE_SECONDS di client.ts

interface HomePageProps {
  searchParams: Promise<{
    batch?: string;
    kategori?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function HomePage(props: HomePageProps) {
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
        batches.find((b) => getEffectiveStatus(b) === "Open") ?? batches[0];
    }
  }

  const isBatchClosed = activeBatch
    ? getEffectiveStatus(activeBatch) === "Closed"
    : false;

  // Barang untuk batch aktif (kategori, pencarian, dan sortir diproses di sisi klien secara instan)
  const batchProducts = activeBatch
    ? allProducts.filter((p) => p.batchId === activeBatch.id)
    : allProducts;

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

            {/* INTERACTIVE CATALOG SECTION (Kategori, Cari, Urutkan, & Grid) */}
            <CatalogSection
              products={batchProducts}
              batchName={activeBatch?.name ?? "Katalog"}
              isBatchClosed={isBatchClosed}
              initialCategory={categoryParam}
              initialSearch={queryParam}
              initialSort={sortParam}
            />

            {/* CUSTOM REQUEST BOX */}
            <CustomRequestBox />
          </>
        )}
      </div>
    </div>
  );
}
