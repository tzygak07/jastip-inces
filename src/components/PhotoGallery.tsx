"use client";

import { useState } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/src/lib/cloudinary";

interface PhotoGalleryProps {
  photos: string[];
  productName: string;
  category?: string;
  batchName?: string;
}

interface GalleryThumbProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  photoUrl?: string;
}

function GalleryThumb({
  index,
  isSelected,
  onClick,
  photoUrl,
}: GalleryThumbProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Lihat foto ${index + 1}`}
      aria-pressed={isSelected}
      className={`min-h-[44px] min-w-[44px] h-14 sm:h-16 w-full rounded-lg border-2 flex items-center justify-center p-1 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-orange relative overflow-hidden cursor-pointer ${
        isSelected
          ? "border-brand-blue ring-2 ring-brand-blue shadow-[2px_2px_0px_#0B3C91] opacity-100 scale-[1.02]"
          : "border-brand-blue/30 opacity-70 hover:opacity-100 hover:border-brand-blue hover:bg-brand-tint"
      }`}
    >
      {photoUrl ? (
        <Image
          src={cloudinaryUrl(photoUrl, 200)}
          alt={`Foto ${index + 1}`}
          fill
          unoptimized
          sizes="80px"
          className="object-cover"
        />
      ) : (
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-brand-blue"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )}
    </button>
  );
}

export default function PhotoGallery({
  photos,
  productName,
}: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[selectedIndex] || photos[0] : null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Big Picture Frame with Stitched Dashed Stroke */}
      <div className="relative bg-brand-tint rounded-xl border-2 border-dashed border-brand-blue aspect-square flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        {currentPhoto ? (
          <Image
            src={cloudinaryUrl(currentPhoto, 800)}
            alt={productName}
            fill
            unoptimized
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-blue flex items-center justify-center text-brand-blue shadow-[2px_2px_0px_#0B3C91]">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-brand-blue"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Bar: Only rendered if photos > 1 */}
      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 w-full">
          {photos.map((url, i) => (
            <GalleryThumb
              key={i}
              index={i}
              isSelected={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
              photoUrl={url}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
