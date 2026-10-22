/**
 * Fungsi fetch dan pemetaan data Batch dari Airtable.
 * Sumber: AIRTABLE-SCHEMA.md, ARCHITECTURE.md
 */

import { fetchAllRecords, getString } from "./client";
import { BATCH_FIELDS } from "./fields";
import type { Batch, BatchStatus } from "./types";

const KNOWN_STATUSES: BatchStatus[] = ["Open", "Closed"];

function mapStatus(raw: string | undefined): BatchStatus {
  if (raw && (KNOWN_STATUSES as string[]).includes(raw)) {
    return raw as BatchStatus;
  }
  // Nilai tidak dikenal → paling aman: Closed
  if (raw) {
    console.warn(`[Airtable] Status batch tidak dikenal: "${raw}", dianggap Closed.`);
  }
  return "Closed";
}

function mapBatch(record: { id: string; fields: Record<string, unknown> }): Batch {
  const f = record.fields;

  return {
    id: record.id,
    name: getString(f, BATCH_FIELDS.name) ?? "(tanpa nama)",
    country: getString(f, BATCH_FIELDS.country),
    openDate: getString(f, BATCH_FIELDS.openDate),
    closeDate: getString(f, BATCH_FIELDS.closeDate),
    status: mapStatus(getString(f, BATCH_FIELDS.status)),
    estimatedArrival: getString(f, BATCH_FIELDS.estimatedArrival),
    notes: getString(f, BATCH_FIELDS.notes),
  };
}

/**
 * Hitung status efektif batch.
 * Jika `Tanggal Tutup` sudah lewat, anggap Closed meskipun Status di Airtable masih Open.
 * Sumber: keputusan developer (WORKFLOW.md item 6).
 */
export function getEffectiveStatus(batch: Batch, nowMs: number = Date.now()): BatchStatus {
  if (batch.status === "Closed") return "Closed";
  if (batch.closeDate) {
    const closeAt = new Date(batch.closeDate);
    closeAt.setHours(23, 59, 59, 999); // tutup di akhir hari
    if (nowMs > closeAt.getTime()) return "Closed";
  }
  return "Open";
}

/** Ambil semua batch. */
export async function getBatches(): Promise<Batch[]> {
  const records = await fetchAllRecords("Batches", {
    "sort[0][field]": BATCH_FIELDS.openDate,
    "sort[0][direction]": "desc",
  });
  return records.map(mapBatch);
}

/** Ambil satu batch berdasarkan ID. Kembalikan undefined jika tidak ada. */
export async function getBatchById(id: string): Promise<Batch | undefined> {
  const batches = await getBatches();
  return batches.find((b) => b.id === id);
}
