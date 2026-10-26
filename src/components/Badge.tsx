import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "blue" | "tint";
  className?: string;
}

export default function Badge({
  children,
  variant = "tint",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    orange: "bg-brand-orange text-white border-brand-blue",
    blue: "bg-brand-blue text-white border-brand-blue",
    tint: "bg-brand-tint text-brand-blue border-brand-blue",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs text-btn rounded-full border-2 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
