import { Skeleton } from "@/general/components/ui/skeleton";

const CategoryCardSkeleton = () => (
  <div className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] w-full max-w-sm mx-auto">
    <div className="flex flex-col gap-3 sm:gap-4 h-full">
      {/* Icon skeleton - responsive sizing */}
      <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-slate-600 flex-shrink-0" />

      {/* Content skeleton - responsive spacing and sizing */}
      <div className="flex flex-col gap-2 sm:gap-2.5 flex-1">
        {/* Title skeleton - responsive width and height */}
        <Skeleton className="h-5 sm:h-6 lg:h-7 w-full sm:w-3/4 lg:w-4/5 bg-slate-600" />

        {/* Subtitle skeleton - responsive width and height */}
        <Skeleton className="h-3.5 sm:h-4 lg:h-4.5 w-3/4 sm:w-1/2 lg:w-3/5 bg-slate-600" />

        {/* Optional third line for larger screens */}
        <Skeleton className="h-3 sm:h-3.5 w-1/3 sm:w-2/5 bg-slate-600 hidden sm:block" />
      </div>
    </div>
  </div>
);

export default CategoryCardSkeleton;
