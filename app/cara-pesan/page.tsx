import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppLinkGeneral } from "@/src/lib/whatsapp";

export const metadata: Metadata = {
  title: "Cara Pesan",
  description:
    "Panduan 4 langkah mudah titip belanja barang impian dari luar negeri lewat Jastip Nces Dong.",
};

const STEPS = [
  {
    number: "1",
    title: "Cek Status Batch",
    description:
      "Pilih batch perjalanan yang sedang berstatus Buka di halaman Katalog.",
  },
  {
    number: "2",
    title: "Tentukan Barang",
    description:
      "Pilih barang dari katalog batch atau siapkan link dan foto barang yang ingin kamu titip di luar katalog.",
  },
  {
    number: "3",
    title: "Kirim Format Pesanan",
    description:
      'Kirim pesan chat ke admin WhatsApp resmi dengan klik tombol "Pesan lewat WhatsApp".',
  },
  {
    number: "4",
    title: "Konfirmasi & Pembayaran",
    description:
      "Lakukan pembayaran dengan admin melalui WhatsApp setelah admin mengonfirmasi ketersediaan barang dan total estimasi harga bersih.",
  },
];

export default function CaraPesanPage() {
  const waLink = getWhatsAppLinkGeneral();

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Title & Brand Tagline (Maksimal 2 sparkle sesuai DESIGN.md) */}
        <header className="text-center flex flex-col items-center gap-1.5 pt-1">
          <h1 className="font-heading text-2xl sm:text-4xl text-brand-blue tracking-tight font-extrabold">
            ✦ Cara Pesan ✦
          </h1>
          <p className="font-body text-sm sm:text-base text-brand-blue font-semibold">
            You want it, we get it!
          </p>
          <p className="font-body text-xs sm:text-sm text-brand-blue/80 max-w-xl mx-auto mt-1">
            Panduan langkah mudah titip belanja barang impian dari luar negeri lewat Jastip Nces Dong.
          </p>
        </header>

        {/* Main Instruction Container with Stitched Dashed Border */}
        <div className="relative bg-white border-2 border-dashed border-brand-blue rounded-xl p-5 sm:p-8 md:p-10 flex flex-col gap-6">
          {/* Decorative Heart Hang Tag (Maksimal 1 per layar sesuai DESIGN.md) */}
          <div className="absolute -top-4 right-6 sm:right-10 flex flex-col items-center select-none pointer-events-none">
            <div className="w-0.5 h-3 bg-brand-blue" />
            <div className="relative flex items-center justify-center bg-brand-orange text-white px-3 py-0.5 rounded-full border-2 border-brand-blue shadow-[2px_2px_0px_#0B3C91] rotate-6">
              <span className="font-heading text-xs text-white font-bold tracking-wide">
                ♥ Panduan
              </span>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex flex-col items-start gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-tint border-2 border-brand-blue text-brand-blue font-heading text-xs uppercase tracking-wider font-bold">
              Alur Pemesanan
            </span>
            <h2 className="font-heading text-xl sm:text-2xl text-brand-blue font-bold">
              4 Langkah Mudah Titip Belanja
            </h2>
          </div>

          {/* Numbered Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-white border-2 border-brand-blue rounded-xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start shadow-[2px_2px_0px_#0B3C91]"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-brand-tint border-2 border-brand-blue text-brand-blue font-heading text-base sm:text-lg font-bold flex items-center justify-center">
                  {step.number}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-sm sm:text-base text-brand-blue font-bold">
                    {step.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-brand-blue/80 font-normal leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action Box */}
        <div className="bg-white border-2 border-brand-blue rounded-xl p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[2px_2px_0px_#0B3C91]">
          <div className="flex flex-col text-center md:text-left gap-1">
            <h3 className="font-heading text-lg sm:text-xl text-brand-blue font-bold">
              Sudah Siap Titip Belanjaan?
            </h3>
            <p className="font-body text-xs sm:text-sm text-brand-blue/80 font-normal">
              Langsung chat WhatsApp admin sekarang sebelum kuota koper batch ditutup!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <Link
              href="/"
              className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[10px] bg-white hover:bg-brand-tint text-brand-blue border-2 border-brand-blue font-heading font-bold text-xs sm:text-sm shadow-[2px_2px_0px_#0B3C91] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all btn-hover flex items-center justify-center text-center"
            >
              Kembali ke Katalog
            </Link>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-[10px] bg-brand-orange hover:bg-brand-orange-text text-white border-2 border-brand-blue font-heading font-bold text-xs sm:text-sm shadow-[2px_2px_0px_#0B3C91] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all btn-hover flex items-center justify-center text-center whitespace-nowrap"
              >
                Pesan lewat WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
