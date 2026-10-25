/**
 * Klien Airtable server-side.
 * - Token hanya dipakai di sini, tidak pernah sampai ke browser.
 * - Pagination otomatis: mengulang request sampai offset kosong.
 * - Caching lewat next fetch dengan revalidate.
 * Sumber: ARCHITECTURE.md
 */

import { unstable_cache } from "next/cache";

const BASE_URL = "https://api.airtable.com/v0";

export const AIRTABLE_REVALIDATE_SECONDS = 21600; // 6 jam
export const REVALIDATE_SECONDS = AIRTABLE_REVALIDATE_SECONDS; // alias mundur
export const CACHE_TAG = "airtable";

// ── Penghitung Panggilan API Bulanan (Server-only log) ─────────────────────────
let currentMonthKey = "";
let monthlyApiCallCount = 0;

function trackApiCall(endpointLabel: string) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (monthKey !== currentMonthKey) {
    currentMonthKey = monthKey;
    monthlyApiCallCount = 0;
  }

  monthlyApiCallCount++;
  console.log(
    `[Airtable API] Panggilan ke-${monthlyApiCallCount} bulan ini (${currentMonthKey}) [${endpointLabel}]`
  );

  if (monthlyApiCallCount >= 800) {
    console.warn(
      `[Airtable API] PERINGATAN: Jumlah panggilan API bulan ini telah mencapai ${monthlyApiCallCount}/1000 (mendekati batas kuota paket gratis Airtable).`
    );
  }
}

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

async function fetchAllRecordsDirect(
  tableId: string,
  params: Record<string, string> = {}
): Promise<AirtableRecord[]> {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();

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

    trackApiCall(`table: ${tableId}`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: AIRTABLE_REVALIDATE_SECONDS,
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

const getCachedAllRecords = unstable_cache(
  async (tableId: string, paramsJson: string): Promise<AirtableRecord[]> => {
    const params = paramsJson ? (JSON.parse(paramsJson) as Record<string, string>) : {};
    return fetchAllRecordsDirect(tableId, params);
  },
  ["airtable-all-records"],
  {
    revalidate: AIRTABLE_REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  }
);

/**
 * Ambil semua record dari sebuah tabel Airtable.
 * Otomatis mengulang request jika ada offset (pagination).
 * Hasil dibungkus unstable_cache agar counter API tidak bertambah saat cache aktif.
 *
 * @param tableId - Nama atau ID tabel di Airtable
 * @param params  - Query param tambahan (misalnya sort, view)
 */
export async function fetchAllRecords(
  tableId: string,
  params: Record<string, string> = {}
): Promise<AirtableRecord[]> {
  return getCachedAllRecords(tableId, JSON.stringify(params));
}

async function fetchRecordDirect(
  tableId: string,
  recordId: string,
  revalidateSeconds: number
): Promise<AirtableRecord> {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();

  if (!token || !baseId) {
    throw new Error(
      "[Airtable] AIRTABLE_TOKEN atau AIRTABLE_BASE_ID belum diisi di environment variable."
    );
  }

  const url = `${BASE_URL}/${baseId}/${encodeURIComponent(tableId)}/${encodeURIComponent(recordId)}`;

  trackApiCall(`record: ${tableId}/${recordId}`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: revalidateSeconds,
      tags: [CACHE_TAG],
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[Airtable] Gagal fetch record "${recordId}" dari tabel "${tableId}": ${res.status} ${res.statusText} — ${text}`
    );
  }

  return (await res.json()) as AirtableRecord;
}

const getCachedRecord = unstable_cache(
  async (tableId: string, recordId: string, revalidateSeconds: number): Promise<AirtableRecord> => {
    return fetchRecordDirect(tableId, recordId, revalidateSeconds);
  },
  ["airtable-single-record"],
  {
    revalidate: AIRTABLE_REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  }
);

/**
 * Ambil satu record dari sebuah tabel Airtable berdasarkan ID.
 *
 * @param tableId - Nama atau ID tabel di Airtable
 * @param recordId - ID record (contoh: recXXXXX)
 * @param revalidateSeconds - Durasi cache Next.js dalam detik (default: AIRTABLE_REVALIDATE_SECONDS)
 */
export async function fetchRecord(
  tableId: string,
  recordId: string,
  revalidateSeconds: number = AIRTABLE_REVALIDATE_SECONDS
): Promise<AirtableRecord> {
  return getCachedRecord(tableId, recordId, revalidateSeconds);
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
