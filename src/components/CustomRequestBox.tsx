import { getWhatsAppLinkGeneral } from "@/src/lib/whatsapp";

export default function CustomRequestBox() {
  const waLink = getWhatsAppLinkGeneral();

  return (
    <section className="w-full bg-white border-2 border-brand-blue rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1 max-w-2xl">
        <h3 className="font-heading text-lg sm:text-xl text-brand-blue">
          Punya titipan di luar katalog?
        </h3>
        <p className="font-body text-xs sm:text-sm text-brand-blue/90">
          Kirim foto dan link barang yang kamu inginkan, kami langsung cek ketersediaannya di toko.
        </p>
      </div>

      {waLink ? (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center min-h-[44px] px-5 bg-brand-orange hover:bg-brand-orange-text text-white font-bold text-xs sm:text-sm rounded-[10px] border-2 border-brand-blue transition-all whitespace-nowrap active:translate-x-[1px] active:translate-y-[1px] btn-hover"
        >
          Pesan lewat WhatsApp
        </a>
      ) : null}
    </section>
  );
}
