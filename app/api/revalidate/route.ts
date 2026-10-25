import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.REVALIDATE_SECRET?.trim();

  // Jika query ?secret= tidak sama dengan REVALIDATE_SECRET, balas 401 tanpa detail.
  if (!expectedSecret || secret !== expectedSecret) {
    return new NextResponse(null, { status: 401 });
  }

  // Jika cocok, panggil revalidateTag("airtable") lalu balas 200 dengan pesan singkat.
  // Jangan log secret atau URL lengkap.
  revalidateTag("airtable", "max");

  return NextResponse.json({
    revalidated: true,
    message: "Katalog berhasil direvalidasi.",
  });
}
