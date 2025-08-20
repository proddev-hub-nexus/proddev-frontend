"use client";
import { useState, useEffect, useRef } from "react";
import { useCourseActions } from "@/app/(course)/hooks/useCourseActions";
import { useCourseStore } from "@/app/(course)/store/useCourseStore";
import { updateOnboardingStep } from "../../utils/util";
import { useOnboardingStore } from "../store/onboarding-store";

export default function CourseInterestsStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Zustand onboarding store directly
  const { interested_course_ids, setInterestedCourses, setCurrentStep } =
    useOnboardingStore();

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(
    interested_course_ids || []
  );

  // Course hooks and store
  const { fetchAllCourses, isFetchingCourses } = useCourseActions();
  const {
    courses,
    filteredCourses,
    categories,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    error: courseError,
  } = useCourseStore();

  // Fetch courses exactly once on mount
  const requestedRef = useRef(false);
  useEffect(() => {
    if (!requestedRef.current && (!courses || courses.length === 0)) {
      requestedRef.current = true;
      fetchAllCourses();
    }
  }, [courses?.length, fetchAllCourses]);

  if (courseError) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="font-semibold mb-1">Error loading courses</div>
          <div className="text-sm">{courseError}</div>
        </div>
      </div>
    );
  }

  // Handlers
  const handleCategorySelect = (category: string) =>
    setSelectedCategory(category);
  const handleSearchChange = (query: string) => setSearchQuery(query);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleNext = async () => {
    if (selectedCourseIds.length === 0) {
      setError("Please select at least one course to continue");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Saving course interests:", selectedCourseIds);

      // Update Zustand store (automatically persisted to cookies)
      setInterestedCourses(selectedCourseIds);

      // Send to backend
      await updateOnboardingStep({
        step_name: "course_interest",
        step_data: selectedCourseIds,
      });

      console.log("Course interests saved successfully");

      // Navigate to next step using Zustand
      setCurrentStep("completion");
    } catch (e) {
      console.error("Failed to save course interests:", e);
      setError(
        e instanceof Error ? e.message : "Failed to save course preferences"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("learning_goal");
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Choose Your Courses
          </h2>
          <p className="text-sm sm:text-base text-slate-600 px-2">
            Select courses that interest you most. You can always add more
            later.
          </p>

          {/* Selection counter */}
          <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
            {selectedCourseIds.length === 0
              ? "No courses selected"
              : `${selectedCourseIds.length} course${selectedCourseIds.length === 1 ? "" : "s"} selected`}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6 mt-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label
                  htmlFor="category"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="search"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  Search Courses
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, description, or instructor..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {isFetchingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg border border-slate-200 bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-600 mb-1">
                No courses found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => {
                const isSelected = selectedCourseIds.includes(course._id);

                return (
                  <div key={course._id}>
                    <label
                      className={`group flex flex-col p-4 rounded-lg border cursor-pointer select-none transition-all duration-200 hover:shadow-sm
                      ${
                        isSelected
                          ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                          : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          checked={isSelected}
                          onChange={() => handleCourseSelect(course._id)}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2">
                            {course.name}
                          </h3>
                          {course.description && (
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-3">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Course metadata */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                        <div className="flex items-center space-x-4">
                          {course.tutor && (
                            <div className="flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="truncate max-w-[100px]">
                                {course.tutor}
                              </span>
                            </div>
                          )}

                          {course.duration && (
                            <div className="flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {course.duration}
                            </div>
                          )}
                        </div>

                        {course.category && (
                          <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
                            {course.category}
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" &&
            interested_course_ids.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs">
                <strong>Stored Course IDs:</strong>{" "}
                {JSON.stringify(interested_course_ids)}
              </div>
            )}

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Unable to save course selection
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-slate-200 p-4 sm:p-6 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 order-2 sm:order-1"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={selectedCourseIds.length === 0 || loading}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 order-1 sm:order-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Continue
                {selectedCourseIds.length > 0 && (
                  <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded text-sm">
                    {selectedCourseIds.length}
                  </span>
                )}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
