/**
 * Fungsi fetch dan pemetaan data Product dari Airtable.
 * Sumber: AIRTABLE-SCHEMA.md, ARCHITECTURE.md
 */

import { fetchAllRecords, getString, getNumber, getFirstLinkId } from "./client";
import { PRODUCT_FIELDS } from "./fields";
import type { Product, StockStatus, Category } from "./types";

const KNOWN_STOCKS: StockStatus[] = ["Available", "Sold Out"];
const KNOWN_CATEGORIES: Category[] = [
  "Skincare", "Branded", "Food", "Cute Stuff", "Luggage", "Shoes", "Bags",
];

function mapStock(raw: string | undefined): StockStatus {
  if (raw && (KNOWN_STOCKS as string[]).includes(raw)) {
    return raw as StockStatus;
  }
  if (raw) {
    console.warn(`[Airtable] Stock Status tidak dikenal: "${raw}", dianggap Sold Out.`);
  }
  return "Sold Out";
}

function mapCategory(raw: string | undefined): Category | undefined {
  if (raw && (KNOWN_CATEGORIES as string[]).includes(raw)) {
    return raw as Category;
  }
  return undefined;
}

/** Pecah field Varian per baris, buang baris kosong, rapikan spasi. */
function splitVariants(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function mapProduct(record: { id: string; fields: Record<string, unknown> }): Product {
  const f = record.fields;

  // Kumpulkan foto tambahan (URL 2–4) yang tidak kosong
  const extraPhotos = [
    getString(f, PRODUCT_FIELDS.photoUrl2),
    getString(f, PRODUCT_FIELDS.photoUrl3),
    getString(f, PRODUCT_FIELDS.photoUrl4),
  ].filter((url): url is string => url !== undefined);

  return {
    id: record.id,
    name: getString(f, PRODUCT_FIELDS.name) ?? "(tanpa nama)",
    brand: getString(f, PRODUCT_FIELDS.brand),
    price: getNumber(f, PRODUCT_FIELDS.price),
    category: mapCategory(getString(f, PRODUCT_FIELDS.category)),
    batchId: getFirstLinkId(f, PRODUCT_FIELDS.batch),
    photoUrl: getString(f, PRODUCT_FIELDS.photoUrl),
    photoUrls: extraPhotos,
    variants: splitVariants(getString(f, PRODUCT_FIELDS.variants)),
    stock: mapStock(getString(f, PRODUCT_FIELDS.stock)),
    estWeight: getString(f, PRODUCT_FIELDS.estWeight),
    description: getString(f, PRODUCT_FIELDS.description),
    storeNotes: getString(f, PRODUCT_FIELDS.storeNotes),
    shippingInfo: getString(f, PRODUCT_FIELDS.shippingInfo),
  };
}

/** Ambil semua produk. */
export async function getProducts(): Promise<Product[]> {
  const records = await fetchAllRecords("Products");
  return records.map(mapProduct);
}

/** Ambil produk yang terhubung ke satu batch. */
export async function getProductsByBatch(batchId: string): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.batchId === batchId);
}

/** Ambil satu produk berdasarkan ID. Kembalikan undefined jika tidak ada. */
export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.id === id);
}
