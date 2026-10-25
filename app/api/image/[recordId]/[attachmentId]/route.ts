import { NextRequest, NextResponse } from "next/server";
import { getRecordAttachments } from "@/src/lib/airtable/attachments";

// Validasi format ID Airtable untuk keamanan & pencegahan SSRF
const RECORD_ID_REGEX = /^rec[a-zA-Z0-9]+$/;
const ATTACHMENT_ID_REGEX = /^att[a-zA-Z0-9]+$/;

interface ImageRouteProps {
  params: Promise<{
    recordId: string;
    attachmentId: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  props: ImageRouteProps
) {
  const { recordId, attachmentId } = await props.params;

  // Validasi recordId dan attachmentId (tidak menerima URL langsung dari input pengguna)
  if (!RECORD_ID_REGEX.test(recordId) || !ATTACHMENT_ID_REGEX.test(attachmentId)) {
    return new NextResponse(null, { status: 400 });
  }

  // Ambil data attachment via fungsi yang dibungkus unstable_cache (tag "airtable", TTL 50 menit)
  const attachments = await getRecordAttachments(recordId);
  const targetAttachment = attachments[attachmentId];

  if (!targetAttachment || !targetAttachment.url) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Unduh gambar dari URL attachment Airtable
    const imageRes = await fetch(targetAttachment.url);

    if (!imageRes.ok) {
      return new NextResponse(null, { status: 502 });
    }

    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const imageBuffer = await imageRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error(`[Image Proxy] Gagal fetch attachment ${recordId}/${attachmentId}:`, err);
    return new NextResponse(null, { status: 502 });
  }
}
