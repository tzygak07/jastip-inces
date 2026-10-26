import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-brand-tint border-2 border-brand-blue flex items-center justify-center text-brand-blue text-display text-3xl shadow-[2px_2px_0px_#0B3C91]">
        ?
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h1 className="font-heading text-2xl sm:text-3xl text-brand-blue">
          Halaman Tidak Ditemukan
        </h1>
        <p className="font-body text-xs sm:text-sm text-brand-blue/80">
          Barang atau halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center min-h-[44px] px-6 bg-brand-blue text-white text-btn text-sm rounded-[10px] border-2 border-brand-blue hover:bg-brand-blue/90 transition-all active:translate-x-[1px] active:translate-y-[1px] btn-hover mt-2"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}
