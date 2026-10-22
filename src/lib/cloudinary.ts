/**
 * Helper URL gambar Cloudinary.
 * Website hanya membaca URL dari Airtable, tidak mengunggah ke Cloudinary.
 * Sumber: ARCHITECTURE.md
 */

/**
 * Sisipkan transformasi Cloudinary ke dalam URL.
 * Contoh: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *       → https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/sample.jpg
 *
 * Jika URL bukan dari Cloudinary atau format tidak dikenal, kembalikan URL asli.
 */
export function cloudinaryUrl(url: string, width = 800): string {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("cloudinary.com")) return url;

    // Sisipkan transformasi tepat setelah segmen /upload/
    const transformed = url.replace(
      /\/upload\//,
      `/upload/f_auto,q_auto,w_${width}/`
    );
    return transformed;
  } catch {
    return url;
  }
}

/**
 * Loader untuk next/image agar optimasi dilakukan Cloudinary,
 * bukan kuota optimasi gambar Vercel.
 */
export function cloudinaryLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  return cloudinaryUrl(src, width);
}
