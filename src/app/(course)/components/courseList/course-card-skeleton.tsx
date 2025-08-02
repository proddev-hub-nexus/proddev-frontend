"use client";

import type React from "react";

import { Skeleton } from "@/general/components/ui/skeleton";

const CourseCardSkeleton: React.FC = () => (
  <div className="bg-slate-800 p-4 sm:p-6 lg:p-7 rounded-xl border border-slate-700 w-full max-w-xs sm:max-w-sm lg:max-w-md">
    {/* Image skeleton - responsive aspect ratio and spacing */}
    <div className="mb-3 sm:mb-4 lg:mb-5 aspect-video rounded-lg overflow-hidden bg-slate-700">
      <Skeleton className="w-full h-full bg-slate-600" />
    </div>

    {/* Content skeleton */}
    <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
      {/* Title skeleton - responsive height and width */}
      <Skeleton className="h-5 sm:h-6 lg:h-7 w-4/5 sm:w-3/4 lg:w-5/6 bg-slate-600" />

      {/* Tutor skeleton - responsive sizing */}
      <Skeleton className="h-3.5 sm:h-4 lg:h-4.5 w-2/5 sm:w-1/2 lg:w-3/5 bg-slate-600" />

      {/* Description skeleton - responsive lines */}
      <div className="space-y-1.5 sm:space-y-2">
        <Skeleton className="h-3.5 sm:h-4 w-full bg-slate-600" />
        <Skeleton className="h-3.5 sm:h-4 w-full bg-slate-600" />
        <Skeleton className="h-3.5 sm:h-4 w-3/4 sm:w-2/3 lg:w-3/4 bg-slate-600" />
        {/* Additional line for larger screens */}
        <Skeleton className="h-3.5 sm:h-4 w-1/2 bg-slate-600 hidden lg:block" />
      </div>

      {/* Footer skeleton - responsive spacing and sizing */}
      <div className="flex items-center justify-between pt-1.5 sm:pt-2 lg:pt-3">
        {/* Price/rating skeleton */}
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-12 sm:w-16 lg:w-20 bg-slate-600" />

        {/* Button skeleton */}
        <Skeleton className="h-8 sm:h-9 lg:h-10 w-16 sm:w-20 lg:w-24 rounded-md bg-slate-600" />
      </div>
    </div>
  </div>
);

export default CourseCardSkeleton;
