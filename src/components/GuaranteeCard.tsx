import { RiVerifiedBadgeLine } from "react-icons/ri";

export const GUARANTEE_TITLE = "100% Original Guarantee";
export const GUARANTEE_DESCRIPTION =
  "Dibeli langsung dari store resmi di Seoul, lengkap dengan struk fisik toko.";

interface GuaranteeCardProps {
  className?: string;
}

export default function GuaranteeCard({ className = "" }: GuaranteeCardProps) {
  return (
    <div
      className={`bg-white border-2 border-brand-blue rounded-xl p-3.5 sm:p-4 flex items-center gap-3 ${className}`}
    >
      <div className="shrink-0 text-brand-orange">
        <RiVerifiedBadgeLine className="w-6 h-6 text-brand-orange" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="font-body text-xs sm:text-sm text-brand-blue text-label">
          {GUARANTEE_TITLE}
        </span>
        <p className="font-body text-xs text-brand-blue/80 mt-0.5 leading-relaxed font-normal">
          {GUARANTEE_DESCRIPTION}
        </p>
      </div>
    </div>
  );
}
