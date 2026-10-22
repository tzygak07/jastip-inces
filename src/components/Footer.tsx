import Image from "next/image";
import { getWhatsAppLinkGeneral } from "@/src/lib/whatsapp";

export default function Footer() {
  const currentYear = 2026;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL?.trim();
  const waLink = getWhatsAppLinkGeneral();

  const socialLinks: { name: string; url: string }[] = [];
  if (instagramUrl) socialLinks.push({ name: "Instagram", url: instagramUrl });
  if (tiktokUrl) socialLinks.push({ name: "TikTok", url: tiktokUrl });
  if (waLink) socialLinks.push({ name: "WhatsApp", url: waLink });

  return (
    <footer className="w-full bg-white border-t-2 border-brand-blue py-4 mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 min-h-[44px]">
        {/* Logo & Copyright */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-brand-blue shrink-0 bg-white">
            <Image
              src="/logo.png"
              alt="Logo Jastip Nces Dong"
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <span className="font-body text-xs sm:text-sm text-brand-blue font-semibold">
            © {currentYear} Jastip Nces Dong
          </span>
        </div>

        {/* Social Media Links (hanya tampil jika env variable ada) */}
        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-2 sm:gap-3 font-body text-xs sm:text-sm text-brand-blue">
            {socialLinks.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 sm:gap-3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline min-h-[44px] inline-flex items-center font-medium"
                >
                  {item.name}
                </a>
                {idx < socialLinks.length - 1 ? (
                  <span className="text-brand-blue/50" aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
