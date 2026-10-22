import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductById } from "@/src/lib/airtable/products";
import { getBatchById, getEffectiveStatus } from "@/src/lib/airtable/batches";
import { formatRupiah } from "@/src/lib/format";
import PhotoGallery from "@/src/components/PhotoGallery";
import BatchBanner from "@/src/components/BatchBanner";
import GuaranteeCard from "@/src/components/GuaranteeCard";
import ProductOrderSection from "@/src/components/ProductOrderSection";
import Tabs, { TabItem } from "@/src/components/Tabs";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  props: ItemDetailPageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Barang Tidak Ditemukan",
    };
  }

  const batch = product.batchId
    ? await getBatchById(product.batchId)
    : undefined;

  const batchInfo = batch ? ` · ${batch.name}` : "";

  return {
    title: `${product.name}${batchInfo}`,
    description: product.description
      ? product.description.slice(0, 160)
      : `Detail titipan barang ${product.name} di Jastip Nces Dong.`,
  };
}

export default async function ItemDetailPage(props: ItemDetailPageProps) {
  await connection();
  const { id } = await props.params;

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const batch = product.batchId
    ? await getBatchById(product.batchId)
    : undefined;

  const isBatchClosed = batch ? getEffectiveStatus(batch) === "Closed" : false;
  const isSoldOut = product.stock === "Sold Out";

  // URL halaman untuk referensi di pesan WhatsApp
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productUrl = `${siteUrl}/barang/${product.id}`;

  // Kumpulkan semua foto yang tidak kosong
  const photos = [product.photoUrl, ...product.photoUrls].filter(
    (url): url is string => Boolean(url && url.trim() !== "")
  );

  // Susun data tab yang tidak kosong
  const tabs: TabItem[] = [];
  if (product.description) {
    tabs.push({
      id: "deskripsi",
      label: "Deskripsi Barang",
      content: (
        <div className="whitespace-pre-line leading-relaxed">
          {product.description}
        </div>
      ),
    });
  }
  if (product.storeNotes) {
    tabs.push({
      id: "catatan-toko",
      label: "Aturan & Catatan Toko Fisik",
      content: (
        <div className="whitespace-pre-line leading-relaxed">
          {product.storeNotes}
        </div>
      ),
    });
  }
  if (product.shippingInfo) {
    tabs.push({
      id: "pengiriman",
      label: "Informasi Pengiriman Lokal",
      content: (
        <div className="whitespace-pre-line leading-relaxed">
          {product.shippingInfo}
        </div>
      ),
    });
  }

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 w-full py-6 flex flex-col gap-6">
        {/* Top Bar: Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-brand-blue pb-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-x-2 gap-y-1 font-body text-xs sm:text-sm text-brand-blue min-h-[44px]"
          >
            <Link
              href="/"
              className="hover:underline min-h-[44px] inline-flex items-center font-semibold"
            >
              Katalog
            </Link>
            <span aria-hidden="true" className="text-brand-blue/50 select-none">
              /
            </span>
            {batch ? (
              <>
                <Link
                  href={`/?batch=${batch.id}#product-catalog`}
                  className="hover:underline min-h-[44px] inline-flex items-center font-semibold"
                >
                  {batch.name}
                </Link>
                <span
                  aria-hidden="true"
                  className="text-brand-blue/50 select-none"
                >
                  /
                </span>
              </>
            ) : null}
            <span
              className="font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-md inline-flex items-center min-h-[44px]"
              aria-current="page"
              title={product.name}
            >
              {product.name}
            </span>
          </nav>

          <div className="flex items-baseline gap-2 shrink-0">
            <h1 className="font-heading font-extrabold text-lg sm:text-xl text-brand-blue tracking-tight">
              ✦ Detail Barang ✦
            </h1>
            <span className="font-body text-xs sm:text-sm text-brand-orange-text font-semibold hidden md:inline">
              You want it, we get it!
            </span>
          </div>
        </div>

        {/* Main Detail Grid (Desktop 2-Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image Gallery & Guarantee */}
          <section className="md:col-span-5 flex flex-col gap-4">
            <PhotoGallery
              photos={photos}
              productName={product.name}
              category={product.category}
              batchName={batch?.name}
            />
            <GuaranteeCard />
          </section>

          {/* Right Column: Product Detail & Order CTA */}
          <section className="md:col-span-7 flex flex-col gap-4">
            {/* Batch Banner compact if batch exists */}
            {batch ? <BatchBanner batch={batch} variant="compact" /> : null}

            {/* Brand & Product Titles */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-body text-xs sm:text-sm flex-wrap">
                {product.category ? (
                  <span className="text-brand-orange-text font-semibold">
                    {product.category}
                  </span>
                ) : null}
                {product.category && product.brand ? (
                  <span aria-hidden="true" className="text-brand-blue font-semibold">
                    ·
                  </span>
                ) : null}
                {product.brand ? (
                  <span className="text-brand-blue/80 font-semibold">
                    {product.brand}
                  </span>
                ) : null}
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue mt-1 leading-tight">
                {product.name}
              </h2>

              {product.price !== undefined ? (
                <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue tracking-tight">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="font-body text-xs sm:text-sm text-brand-blue/70 font-normal">
                    (Sudah termasuk tax belanja + fee jastip)
                  </span>
                </div>
              ) : null}
            </div>

            {/* Interactive Order Block */}
            <ProductOrderSection
              productName={product.name}
              batchName={batch?.name ?? "Katalog"}
              price={product.price}
              variants={product.variants}
              estWeight={product.estWeight}
              isSoldOut={isSoldOut}
              isBatchClosed={isBatchClosed}
              productUrl={productUrl}
            />
          </section>
        </div>

        {/* Product Information Tabs */}
        {tabs.length > 0 ? (
          <div className="mt-2">
            <Tabs tabs={tabs} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
