/**
 * Klien Airtable server-side.
 * - Token hanya dipakai di sini, tidak pernah sampai ke browser.
 * - Pagination otomatis: mengulang request sampai offset kosong.
 * - Caching lewat next fetch dengan revalidate.
 * Sumber: ARCHITECTURE.md
 */

const BASE_URL = "https://api.airtable.com/v0";

/** Durasi cache dalam detik. Ubah di sini untuk semua fetch. */
export const REVALIDATE_SECONDS = 300;

/** Tag cache untuk revalidasi manual jika diperlukan. */
export const CACHE_TAG = "airtable";

// ── Tipe respons mentah Airtable ─────────────────────────────────────────────

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// ── Fungsi utama ──────────────────────────────────────────────────────────────

/**
 * Ambil semua record dari sebuah tabel Airtable.
 * Otomatis mengulang request jika ada offset (pagination).
 *
 * @param tableId - Nama atau ID tabel di Airtable
 * @param params  - Query param tambahan (misalnya sort, view)
 */
export async function fetchAllRecords(
  tableId: string,
  params: Record<string, string> = {}
): Promise<AirtableRecord[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error(
      "[Airtable] AIRTABLE_TOKEN atau AIRTABLE_BASE_ID belum diisi di environment variable."
    );
  }

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const searchParams = new URLSearchParams(params);
    if (offset) searchParams.set("offset", offset);

    const url = `${BASE_URL}/${baseId}/${encodeURIComponent(tableId)}?${searchParams.toString()}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: [CACHE_TAG],
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `[Airtable] Gagal fetch tabel "${tableId}": ${res.status} ${res.statusText} — ${text}`
      );
    }

    const data = (await res.json()) as AirtableResponse;
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

// ── Helper pembaca field ──────────────────────────────────────────────────────

/** Baca string dari field, kembalikan undefined jika kosong. */
export function getString(
  fields: Record<string, unknown>,
  key: string
): string | undefined {
  const val = fields[key];
  return typeof val === "string" && val.trim() !== "" ? val.trim() : undefined;
}

/** Baca number dari field, kembalikan undefined jika tidak ada. */
export function getNumber(
  fields: Record<string, unknown>,
  key: string
): number | undefined {
  const val = fields[key];
  return typeof val === "number" ? val : undefined;
}

/** Baca array ID dari field relasi Airtable, kembalikan elemen pertama. */
export function getFirstLinkId(
  fields: Record<string, unknown>,
  key: string
): string | undefined {
  const val = fields[key];
  if (Array.isArray(val) && typeof val[0] === "string") return val[0];
  return undefined;
}
