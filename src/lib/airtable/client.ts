/**
 * Klien Airtable server-side.
 * - Token hanya dipakai di sini, tidak pernah sampai ke browser.
 * - Pagination otomatis: mengulang request sampai offset kosong.
 * - Caching lewat next fetch dengan revalidate.
 * Sumber: ARCHITECTURE.md
 */

import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";

const BASE_URL = "https://api.airtable.com/v0";

export const AIRTABLE_REVALIDATE_SECONDS = 21600; // 6 jam
export const REVALIDATE_SECONDS = AIRTABLE_REVALIDATE_SECONDS; // alias mundur
export const CACHE_TAG = "airtable";

// ── Helper penanda log [dev] atau [prod] ──────────────────────────────────────
export function getEnvTag(): "[dev]" | "[prod]" {
  return process.env.NODE_ENV === "production" ? "[prod]" : "[dev]";
}

// ── Deteksi Mode Mock ─────────────────────────────────────────────────────────

/**
 * Mengecek apakah mode mock aktif.
 * Mode mock hanya boleh aktif saat development lokal dengan AIRTABLE_MOCK=true.
 * Variabel ini diproteksi agar TIDAK PERNAH aktif di Vercel maupun di production.
 */
export function isMockActive(): boolean {
  const isVercel = Boolean(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV
  );
  const isProd = process.env.NODE_ENV === "production";

  if (isVercel || isProd) {
    if (process.env.AIRTABLE_MOCK === "true") {
      const envTag = isProd ? "[prod]" : "[dev]";
      console.warn(
        `${envTag} [Airtable] AIRTABLE_MOCK diabaikan karena sistem berjalan di ${
          isVercel ? "Vercel" : "lingkungan production"
        }. Menggunakan data live Airtable.`
      );
    }
    return false;
  }

  return process.env.AIRTABLE_MOCK === "true";
}

/**
 * Membaca data fixture lokal dari src/lib/airtable/fixtures/*.json.
 */
function readFixtureRecords(tableId: string): AirtableRecord[] {
  const fileName = `${tableId.toLowerCase()}.json`;
  const filePath = path.join(process.cwd(), "src", "lib", "airtable", "fixtures", fileName);

  if (!fs.existsSync(filePath)) {
    const envTag = getEnvTag();
    throw new Error(
      `${envTag} [Airtable Mock] File fixture tidak ditemukan: "${filePath}". Pastikan file ${fileName} ada di src/lib/airtable/fixtures/.`
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return parsed as AirtableRecord[];
  }
  if (parsed && Array.isArray((parsed as { records?: unknown }).records)) {
    return (parsed as { records: AirtableRecord[] }).records;
  }
  const envTag = getEnvTag();
  throw new Error(
    `${envTag} [Airtable Mock] Format fixture "${fileName}" tidak valid. Harap sediakan array record Airtable.`
  );
}

function logMockCall(tableId: string, recordId?: string) {
  const envTag = getEnvTag();
  if (recordId) {
    console.log(
      `${envTag} [Airtable Mock] Membaca record "${recordId}" pada tabel "${tableId}" dari fixtures/${tableId.toLowerCase()}.json`
    );
  } else {
    console.log(
      `${envTag} [Airtable Mock] Membaca data tabel "${tableId}" dari fixtures/${tableId.toLowerCase()}.json`
    );
  }
}

// ── Penghitung Panggilan API Bulanan (Server-only log) ─────────────────────────
let currentMonthKey = "";
let monthlyApiCallCount = 0;
let devWorkspaceWarningShown = false;

function trackApiCall(endpointLabel: string) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (monthKey !== currentMonthKey) {
    currentMonthKey = monthKey;
    monthlyApiCallCount = 0;
  }

  monthlyApiCallCount++;
  const envTag = getEnvTag();
  console.log(
    `${envTag} [Airtable API] Panggilan ke-${monthlyApiCallCount} bulan ini (${currentMonthKey}) [${endpointLabel}]`
  );

  if (process.env.NODE_ENV !== "production" && !devWorkspaceWarningShown) {
    devWorkspaceWarningShown = true;
    console.log(
      `${envTag} [Airtable API] Catatan: Jika mock tidak dipakai saat development, pastikan token berasal dari workspace development terpisah agar kuota produksi tidak terpakai.`
    );
  }

  if (monthlyApiCallCount >= 800) {
    console.warn(
      `${envTag} [Airtable API] PERINGATAN: Jumlah panggilan API bulan ini telah mencapai ${monthlyApiCallCount}/1000 (mendekati batas kuota paket gratis Airtable).`
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

async function fetchAllRecordsDirect(tableId: string): Promise<AirtableRecord[]> {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  const envTag = getEnvTag();

  if (!token || !baseId) {
    throw new Error(
      `${envTag} [Airtable] AIRTABLE_TOKEN atau AIRTABLE_BASE_ID belum diisi di environment variable.`
    );
  }

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const searchParams = new URLSearchParams();
    if (offset) searchParams.set("offset", offset);

    const query = searchParams.toString();
    const url = `${BASE_URL}/${baseId}/${encodeURIComponent(tableId)}${query ? `?${query}` : ""}`;

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
        `${envTag} [Airtable] Gagal fetch tabel "${tableId}": ${res.status} ${res.statusText} — ${text}`
      );
    }

    const data = (await res.json()) as AirtableResponse;
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

const getCachedAllRecords = unstable_cache(
  async (tableId: string): Promise<AirtableRecord[]> => {
    return fetchAllRecordsDirect(tableId);
  },
  ["airtable-all-records"],
  {
    revalidate: AIRTABLE_REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  }
);

/**
 * Ambil semua record dari sebuah tabel Airtable.
 * - Jika AIRTABLE_MOCK=true (dan bukan di Vercel), membaca data dari src/lib/airtable/fixtures/*.json
 *   tanpa memanggil Airtable sama sekali.
 * - Jika mock tidak aktif, memanggil Airtable via fetch dengan cache tag "airtable" dan pagination otomatis.
 * - Tidak menyertakan batch, sort, atau kategori di URL Airtable.
 *
 * @param tableId - Nama atau ID tabel di Airtable
 */
export async function fetchAllRecords(tableId: string): Promise<AirtableRecord[]> {
  if (isMockActive()) {
    logMockCall(tableId);
    return readFixtureRecords(tableId);
  }

  return getCachedAllRecords(tableId);
}

async function fetchRecordDirect(
  tableId: string,
  recordId: string,
  revalidateSeconds: number
): Promise<AirtableRecord> {
  const token = process.env.AIRTABLE_TOKEN?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  const envTag = getEnvTag();

  if (!token || !baseId) {
    throw new Error(
      `${envTag} [Airtable] AIRTABLE_TOKEN atau AIRTABLE_BASE_ID belum diisi di environment variable.`
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
      `${envTag} [Airtable] Gagal fetch record "${recordId}" dari tabel "${tableId}": ${res.status} ${res.statusText} — ${text}`
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
 * - Jika AIRTABLE_MOCK=true (dan bukan di Vercel), membaca dari fixture lokal.
 * - Jika mock tidak aktif, memanggil Airtable via fetch dengan cache tag "airtable".
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
  if (isMockActive()) {
    logMockCall(tableId, recordId);
    const records = readFixtureRecords(tableId);
    const found = records.find((r) => r.id === recordId);
    if (!found) {
      const envTag = getEnvTag();
      throw new Error(
        `${envTag} [Airtable Mock] Record "${recordId}" tidak ditemukan di fixture tabel "${tableId}".`
      );
    }
    return found;
  }

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
