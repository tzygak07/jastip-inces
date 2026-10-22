export default function Loading() {
  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Page Title Skeleton */}
      <div className="text-center flex flex-col items-center gap-2 pt-2">
        <div className="h-9 w-64 bg-brand-tint rounded animate-pulse" />
        <div className="h-5 w-44 bg-brand-tint rounded animate-pulse" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="w-full h-36 bg-white border-2 border-brand-blue rounded-xl p-6 flex flex-col gap-3 animate-pulse">
        <div className="h-5 w-24 bg-brand-tint rounded-full" />
        <div className="h-7 w-64 bg-brand-tint rounded" />
        <div className="h-4 w-48 bg-brand-tint rounded" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border-2 border-brand-blue rounded-xl p-3 flex flex-col gap-3"
          >
            <div className="w-full h-44 rounded-lg bg-brand-tint animate-pulse stitched" />
            <div className="h-3 w-1/3 bg-brand-tint rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-brand-tint rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-brand-tint rounded animate-pulse" />
            <div className="h-10 w-full bg-brand-tint rounded-[10px] animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
