"use client";

import React from "react";

interface VariantOptionProps {
  variant: string;
  isSelected: boolean;
  onSelect: (variant: string) => void;
  disabled?: boolean;
}

function VariantOption({
  variant,
  isSelected,
  onSelect,
  disabled = false,
}: VariantOptionProps) {
  return (
    <label
      className={`cursor-pointer flex items-center justify-between p-3 min-h-[44px] rounded-[10px] border-2 transition-all focus-within:ring-3 focus-within:ring-brand-orange select-none ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-brand-tint border-brand-blue"
          : isSelected
            ? "bg-brand-blue text-white border-brand-blue shadow-[2px_2px_0px_#0B3C91]"
            : "bg-white text-brand-blue border-brand-blue hover:bg-brand-tint"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="product-variant"
          value={variant}
          checked={isSelected}
          disabled={disabled}
          onChange={() => onSelect(variant)}
          className="w-4 h-4 accent-brand-orange cursor-pointer focus:outline-none"
        />
        <span
          className={`font-body text-xs sm:text-sm ${
            isSelected ? "text-btn" : "font-normal"
          }`}
        >
          {variant}
        </span>
      </div>
    </label>
  );
}

interface VariantPickerProps {
  variants: string[];
  selectedVariant: string | undefined;
  onSelectVariant: (v: string) => void;
  disabled?: boolean;
}

export default function VariantPicker({
  variants,
  selectedVariant,
  onSelectVariant,
  disabled = false,
}: VariantPickerProps) {
  if (variants.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-2 pt-2 border-t-2 border-brand-blue">
      <legend className="text-heading text-xs sm:text-sm text-brand-blue mb-1">
        Pilih Varian:
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {variants.map((variant) => (
          <VariantOption
            key={variant}
            variant={variant}
            isSelected={selectedVariant === variant}
            onSelect={onSelectVariant}
            disabled={disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}
