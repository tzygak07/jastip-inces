"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center">
      <div className="w-full bg-white border-2 border-brand-blue rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 max-w-lg">
        <div className="w-14 h-14 rounded-full bg-brand-tint border-2 border-brand-blue flex items-center justify-center text-brand-blue font-heading text-2xl font-extrabold">
          !
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg sm:text-xl text-brand-blue">
            Koneksi terganggu
          </h2>
          <p className="font-body text-xs sm:text-sm text-brand-blue/80">
            Katalog gagal dimuat. Silakan periksa kembali jaringan kamu.
          </p>
        </div>
        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex items-center justify-center min-h-[44px] px-6 bg-brand-blue text-white font-bold text-sm rounded-[10px] border-2 border-brand-blue hover:bg-brand-blue/90 transition-all btn-hover"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
