/**
 * Tipe TypeScript untuk data domain Jastip Nces Dong.
 * Sumber: AIRTABLE-SCHEMA.md
 */

export type BatchStatus = "Open" | "Closed";
export type StockStatus = "Available" | "Sold Out";
export type Category =
  | "Skincare"
  | "Branded"
  | "Food"
  | "Cute Stuff"
  | "Luggage"
  | "Shoes"
  | "Bags";

export interface Batch {
  id: string; // record ID Airtable
  name: string; // Nama Batch
  country?: string; // Negara Tujuan
  openDate?: string; // ISO date string
  closeDate?: string; // ISO date string
  status: BatchStatus;
  estimatedArrival?: string; // ISO date string
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price?: number; // Rupiah, integer
  category?: Category;
  batchId?: string;
  /** URL foto utama */
  photoUrl?: string;
  /** URL foto tambahan (maksimal 3) */
  photoUrls: string[]; // mencakup photoUrl2–4 yang tidak kosong
  variants: string[]; // hasil split per baris dari field "Varian"
  stock: StockStatus;
  estWeight?: string;
  description?: string;
  storeNotes?: string;
  shippingInfo?: string;
}
