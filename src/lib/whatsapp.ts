/**
 * Helper link WhatsApp.
 * Sumber: PAGES.md bagian "Link WhatsApp"
 */

const WA_BASE = "https://wa.me";

function getNumber(): string | undefined {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!num || num.trim() === "") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[WhatsApp] NEXT_PUBLIC_WHATSAPP_NUMBER belum diisi. Tombol WhatsApp tidak akan ditampilkan."
      );
    }
    return undefined;
  }
  return num.trim();
}

/**
 * Link WhatsApp umum (tombol di header).
 * Kembalikan undefined jika nomor belum diisi.
 */
export function getWhatsAppLinkGeneral(): string | undefined {
  const num = getNumber();
  if (!num) return undefined;
  const text = encodeURIComponent("Halo, saya mau tanya soal jastip Nces Dong.");
  return `${WA_BASE}/${num}?text=${text}`;
}

interface ProductMessageParams {
  productName: string;
  batchName: string;
  price?: number;
  variant?: string;
  productUrl: string;
}

/**
 * Link WhatsApp untuk pesan barang spesifik (tombol di Item Detail).
 * Kembalikan undefined jika nomor belum diisi.
 * Format pesan: PAGES.md bagian "Link WhatsApp".
 */
export function getWhatsAppLinkProduct(
  params: ProductMessageParams
): string | undefined {
  const num = getNumber();
  if (!num) return undefined;

  const { productName, batchName, price, variant, productUrl } = params;

  const lines = ["Halo, saya mau pesan:", `Barang: ${productName}`];

  if (variant) lines.push(`Varian: ${variant}`);
  lines.push(`Batch: ${batchName}`);
  if (price !== undefined) {
    lines.push(
      `Harga: Rp ${new Intl.NumberFormat("id-ID").format(price)}`
    );
  }
  lines.push(`Link: ${productUrl}`);

  return `${WA_BASE}/${num}?text=${encodeURIComponent(lines.join("\n"))}`;
}
