"use client";
import { JSX, useMemo } from "react";
import CourseCategoryCard from "./course-category-card";
import { BookOpen } from "lucide-react";
import CategoryCardSkeleton from "./course-category-skeleton";
import { useCourseStore } from "../../store/useCourseStore";

type CourseCategory = {
  id: string;
  name: string;
  numberOfCourses: number;
};

type Props = {
  courseCategories?: CourseCategory[];
  useStoreData?: boolean;
  limit?: number;
  showLoadingState?: boolean;
};

function CourseCategoryList({
  courseCategories = [],
  useStoreData = false,
  limit,
  showLoadingState = true,
}: Props): JSX.Element {
  const { courses, categories, isLoading, error } = useCourseStore();

  // Compute categories from store
  const storeBasedCategories = useMemo(() => {
    if (!useStoreData || !categories.length || !courses.length) return [];

    let categoryData = categories
      .map((category, index) => {
        const coursesInCategory = courses.filter(
          (course) => course.available && course.category === category
        ).length;
        return {
          id: `category-${index}`,
          name: category,
          numberOfCourses: coursesInCategory,
        };
      })
      .filter((categoryInfo) => categoryInfo.numberOfCourses > 0)
      .sort((a, b) => b.numberOfCourses - a.numberOfCourses);

    if (limit && limit > 0) {
      categoryData = categoryData.slice(0, limit);
    }
    return categoryData;
  }, [useStoreData, categories, courses, limit]);

  const dataToRender = useStoreData ? storeBasedCategories : courseCategories;

  // Loading state with responsive grid
  if (useStoreData && isLoading && showLoadingState) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 place-items-center">
            {Array.from({ length: limit || 8 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with responsive design
  if (useStoreData && error && showLoadingState) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center py-12 sm:py-16 lg:py-20">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center border border-red-800/30">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-red-300 mb-2">
            Error loading categories
          </h3>
          <p className="text-red-400/80 text-sm sm:text-base break-words">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600/20 text-red-300 rounded-lg border border-red-600/30 hover:bg-red-600/30 transition-colors text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state with responsive design
  if (dataToRender.length === 0 && !isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center py-12 sm:py-16 lg:py-20">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-4 sm:mb-6 bg-slate-700/50 rounded-full flex items-center justify-center border border-slate-600/30">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-slate-400" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-300 mb-2 sm:mb-3">
            No categories available
          </h3>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
            Check back later for new course categories
          </p>
        </div>
      </div>
    );
  }

  // Render categories with responsive grid and proper centering
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`
            grid gap-4 sm:gap-6 lg:gap-8 place-items-center
            ${
              dataToRender.length === 1
                ? "grid-cols-1"
                : dataToRender.length === 2
                ? "grid-cols-1 xs:grid-cols-2"
                : dataToRender.length === 3
                ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3"
                : dataToRender.length === 4
                ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : dataToRender.length <= 6
                ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                : "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            }
          `}
        >
          {dataToRender.map((courseCategory) => (
            <div
              key={courseCategory.id}
              className="w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[320px]"
            >
              <CourseCategoryCard
                categoryName={courseCategory.name}
                coursesCount={courseCategory.numberOfCourses}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseCategoryList;
