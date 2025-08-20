"use client";
import { useMemo } from "react";
import { useCourseStore } from "../../store/useCourseStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/general/components/ui/pagination";
import CourseCard from "./course-card";
import CourseCardSkeleton from "./course-card-skeleton";
import EmptyState from "../course-empty-state";
import { cn } from "@/lib/utils";

export function CourseList() {
  const paginatedCourses = useCourseStore((state) => state.paginatedCourses);
  const currentPage = useCourseStore((state) => state.currentPage);
  const itemsPerPage = useCourseStore((state) => state.itemsPerPage);
  const totalCourses = useCourseStore((state) => state.filteredCourses.length);
  const setCurrentPage = useCourseStore((state) => state.setCurrentPage);
  const isLoading = useCourseStore((state) => state.isLoading);

  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  // Smart pagination
  const visiblePages = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    const delta = 1;
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Results summary */}
      {totalCourses > 0 && !isLoading && (
        <div className="text-slate-400 text-sm">
          Showing{" "}
          <span className="font-medium text-slate-300">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-300">
            {Math.min(currentPage * itemsPerPage, totalCourses)}
          </span>{" "}
          of <span className="font-medium text-slate-300">{totalCourses}</span>{" "}
          courses
        </div>
      )}

      {/* Course grid with proper responsive breakpoints */}
      <div className="w-full">
        {paginatedCourses.length === 0 && !isLoading ? (
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
            <EmptyState />
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4 sm:gap-6 lg:gap-8",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
              "justify-items-center items-start"
            )}
          >
            {isLoading
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full max-w-sm flex flex-col h-full"
                  >
                    <CourseCardSkeleton />
                  </div>
                ))
              : paginatedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="w-full max-w-sm flex flex-col h-full"
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent className="flex flex-wrap gap-1 sm:gap-2">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  aria-label="Previous Page"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={cn(
                    "cursor-pointer px-2 sm:px-3 py-2 rounded text-xs sm:text-sm",
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-slate-700 text-slate-300"
                  )}
                />
              </PaginationItem>

              {/* Pages */}
              {visiblePages.map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "..." ? (
                    <span className="px-2 sm:px-3 py-2 text-slate-400 select-none text-xs sm:text-sm">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page as number);
                      }}
                      className={cn(
                        "cursor-pointer px-2 sm:px-3 py-2 rounded text-xs sm:text-sm min-w-[32px] sm:min-w-[36px]",
                        currentPage === page
                          ? "bg-slate-100 text-slate-900 hover:bg-slate-100"
                          : "hover:bg-slate-700 text-slate-300"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  aria-label="Next Page"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={cn(
                    "cursor-pointer px-2 sm:px-3 py-2 rounded text-xs sm:text-sm",
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-slate-700 text-slate-300"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
