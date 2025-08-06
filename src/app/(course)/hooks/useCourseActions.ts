"use client";

import { useEffect, useCallback } from "react";
import { useCourseStore } from "../store/useCourseStore";
import { Course } from "../types";
import { useApiQuery } from "@/general/hooks/use-api-query";
import { useApiMutation } from "@/general/hooks/use-api-mutations";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types for API operations
interface CreateCourseData {
  name: string;
  description?: string;
  tutor?: string;
  category?: string;
  price?: number;
  duration?: string;
  max_students?: number;
  language?: string;
}

interface UpdateCourseData extends Partial<CreateCourseData> {
  _id: string;
  available?: boolean;
}

export function useCourseActions() {
  const {
    setCourses,
    setFilteredCourses,
    setCategories,
    setLoading,
    setError,
    courses,
    selectedCategory,
    searchQuery,
  } = useCourseStore();

  // --- Fetch all courses ---
  const coursesQuery = useApiQuery<Course[]>({
    url: `${API_BASE_URL}/courses`,
    requiresAuth: false,
    enabled: false, // Manual control
  });

  // --- Sync courses data with Zustand ---
  useEffect(() => {
    if (coursesQuery.data) {
      const allCourses = coursesQuery.data;
      setCourses(allCourses);

      // Apply current filters to get filtered courses
      let filtered = allCourses.filter((course) => course.available);

      // Apply category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (course) => course.category === selectedCategory
        );
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (course) =>
            course.name.toLowerCase().includes(term) ||
            course.description?.toLowerCase().includes(term) ||
            course.tutor?.toLowerCase().includes(term) ||
            course.category?.toLowerCase().includes(term)
        );
      }

      setFilteredCourses(filtered);

      // Extract unique categories from available courses
      const availableCourses = allCourses.filter((c) => c.available);
      const categories = [
        ...new Set(
          availableCourses.filter((c) => c.category).map((c) => c.category!)
        ),
      ].sort();
      setCategories(categories);

      setError(null); // Clear any previous errors
    }
  }, [
    coursesQuery.data,
    setCourses,
    setFilteredCourses,
    setCategories,
    setError,
    selectedCategory,
    searchQuery,
  ]);

  // --- Sync loading states ---
  useEffect(() => {
    setLoading(coursesQuery.isLoading);
  }, [coursesQuery.isLoading, setLoading]);

  // --- Sync errors ---
  useEffect(() => {
    if (coursesQuery.error) {
      setError("Failed to fetch courses");
    }
  }, [coursesQuery.error, setError]);

  // --- Create Course Mutation ---
  const createCourseMutation = useApiMutation<Course, CreateCourseData>(
    `${API_BASE_URL}/courses`,
    "POST",
    {
      requiresAuth: true,
      invalidateKeys: [["fetch", `${API_BASE_URL}/courses`, false]],
      onSuccess: () => {
        // Refetch courses after successful creation
        coursesQuery.refetch();
      },
      onError: () => setError("Failed to create course"),
    }
  );

  // --- Update Course Mutation ---
  const updateCourseMutation = useApiMutation<Course, UpdateCourseData>(
    `${API_BASE_URL}/courses`,
    "PUT",
    {
      requiresAuth: true,
      invalidateKeys: [["fetch", `${API_BASE_URL}/courses`, false]],
      onSuccess: () => {
        coursesQuery.refetch();
      },
      onError: () => setError("Failed to update course"),
    }
  );

  // --- Delete Course Mutation ---
  const deleteCourseMutation = useApiMutation<
    { message: string },
    { _id: string }
  >(`${API_BASE_URL}/courses`, "DELETE", {
    requiresAuth: true,
    invalidateKeys: [["fetch", `${API_BASE_URL}/courses`, false]],
    onSuccess: () => {
      coursesQuery.refetch();
    },
    onError: () => setError("Failed to delete course"),
  });

  // --- Toggle Course Availability ---
  const toggleCourseAvailability = useCallback(
    (courseId: string) => {
      const course = courses.find((c) => c._id === courseId);
      if (course) {
        updateCourseMutation.mutate({
          _id: courseId,
          available: !course.available,
        });
      }
    },
    [courses, updateCourseMutation]
  );

  return {
    // Queries
    fetchAllCourses: coursesQuery.refetch,

    // Mutations
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    toggleCourseAvailability,

    // Loading states
    isFetchingCourses: coursesQuery.isLoading,
    isCreatingCourse: createCourseMutation.isPending,
    isUpdatingCourse: updateCourseMutation.isPending,
    isDeletingCourse: deleteCourseMutation.isPending,

    // Data
    coursesData: coursesQuery.data,
    coursesError: coursesQuery.error,
  };
}

// Separate hook for fetching individual courses
export function useCourseById(courseId: string) {
  return useApiQuery<Course>({
    url: `${API_BASE_URL}/courses/${courseId}`,
    requiresAuth: false,
    enabled: !!courseId,
  });
}
