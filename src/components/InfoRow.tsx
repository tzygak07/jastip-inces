import React from "react";
import { RiScales2Line } from "react-icons/ri";

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoRow({
  label,
  value,
  icon,
  className = "",
}: InfoRowProps) {
  return (
    <div
      className={`w-full bg-brand-tint p-3 rounded-[10px] border-2 border-brand-blue flex items-center gap-3 ${className}`}
    >
      <span aria-hidden="true" className="text-brand-blue shrink-0">
        {icon ?? <RiScales2Line className="w-5 h-5 text-brand-blue" />}
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-body text-xs text-brand-blue/80 font-normal">
          {label}:
        </span>
        <span className="font-body text-xs sm:text-sm text-brand-blue font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
}
