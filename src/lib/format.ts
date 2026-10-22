/**
 * Helper format tampilan: harga Rupiah dan tanggal.
 */

/** Format angka ke format harga Rupiah. Contoh: 285000 → "Rp 285.000" */
export function formatRupiah(amount: number): string {
  return (
    "Rp " +
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  );
}

/**
 * Format tanggal ISO ke format lokal Indonesia.
 * Contoh: "2024-03-15" → "15 Mar 2024"
 */
export function formatDate(isoDate: string): string {
  // Hindari shift timezone dengan parse manual
  const [year, month, day] = isoDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format tanggal singkat.
 * Contoh: "2024-03-15" → "15 Mar"
 */
export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
