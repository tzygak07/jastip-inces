/**
 * Pemetaan nama field Airtable ke konstanta TypeScript.
 * Bagian lain codebase tidak boleh menulis string nama field Airtable secara langsung.
 * Sumber: AIRTABLE-SCHEMA.md
 */

// ── Tabel Batches ────────────────────────────────────────────────────────────
export const BATCH_FIELDS = {
  name: "Nama Batch",
  country: "Negara Tujuan",
  openDate: "Tanggal Buka",
  closeDate: "Tanggal Tutup",
  status: "Status",
  estimatedArrival: "Estimasi Tiba",
  notes: "Catatan",
} as const;

// ── Tabel Products ───────────────────────────────────────────────────────────
export const PRODUCT_FIELDS = {
  name: "Nama Barang",
  brand: "Merek",
  price: "Harga",
  category: "Kategori",
  batch: "Batch",
  photoUrl: "Foto URL",
  photoUrl2: "Foto URL 2",
  photoUrl3: "Foto URL 3",
  photoUrl4: "Foto URL 4",
  variants: "Varian",
  stock: "Stock Status",
  estWeight: "Est. Berat",
  description: "Deskripsi",
  storeNotes: "Catatan Toko",
  shippingInfo: "Info Pengiriman",
} as const;
