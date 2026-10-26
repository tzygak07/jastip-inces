import { unstable_cache } from "next/cache";
import { fetchRecord, getEnvTag } from "./client";
import { PRODUCT_FIELDS } from "./fields";

export interface CachedAttachment {
  id: string;
  url: string;
  type?: string;
  filename?: string;
}

export const ATTACHMENT_CACHE_SECONDS = 3000; // 50 menit (URL Airtable kedaluwarsa dalam ~2 jam)

/**
 * Mengambil record dari Airtable dan mengembalikan seluruh attachment pada field Foto.
 * Fungsi ini dibungkus dengan unstable_cache:
 * - Tidak menggunakan Map di memori (aman untuk serverless Vercel multi-instance).
 * - Berbagi cache di Data Cache Next.js antar seluruh instance.
 * - Otomatis ter-invalidasi saat tag "airtable" direvalidasi.
 * - Cache berlaku selama 50 menit (3000 detik) sesuai batas kedaluwarsa URL Airtable (~2 jam).
 */
export const getRecordAttachments = unstable_cache(
  async (recordId: string): Promise<Record<string, CachedAttachment>> => {
    try {
      // Ambil record satu kali dari tabel Products dengan revalidate 50 menit
      const record = await fetchRecord("Products", recordId, ATTACHMENT_CACHE_SECONDS);
      const rawAttachments = record.fields[PRODUCT_FIELDS.photoAttachments];

      const attachmentsMap: Record<string, CachedAttachment> = {};

      if (Array.isArray(rawAttachments)) {
        for (const item of rawAttachments) {
          if (
            typeof item === "object" &&
            item !== null &&
            typeof (item as { id?: unknown }).id === "string" &&
            typeof (item as { url?: unknown }).url === "string"
          ) {
            const att = item as {
              id: string;
              url: string;
              type?: unknown;
              filename?: unknown;
            };
            attachmentsMap[att.id] = {
              id: att.id,
              url: att.url,
              type: typeof att.type === "string" ? att.type : undefined,
              filename: typeof att.filename === "string" ? att.filename : undefined,
            };
          }
        }
      }

      return attachmentsMap;
    } catch (err) {
      const envTag = getEnvTag();
      console.error(`${envTag} [Airtable] Gagal memuat attachment record ${recordId}:`, err);
      return {};
    }
  },
  ["airtable-attachments"],
  {
    revalidate: ATTACHMENT_CACHE_SECONDS,
    tags: ["airtable"],
  }
);
