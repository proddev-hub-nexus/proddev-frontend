import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface EnrolledCourse {
  course: {
    id: string;
    name: string;
    description?: string;
    tutor?: string;
    category?: string;
    price?: number;
    duration?: string;
    available: boolean;
    max_students?: number;
    language?: string;
    created_at: string;
  };
  enrollment_id: string;
  enrollment_status: string;
  badge: string;
  enrolled_at: string;
  whatsapp_link?: string;
}

interface EnrolledCoursesStore {
  enrolledCourses: EnrolledCourse[];
  filteredCourses: EnrolledCourse[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;

  // Actions
  setEnrolledCourses: (courses: EnrolledCourse[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  clearFilters: () => void;
  reset: () => void;

  // Computed
  getCategories: () => string[];
  getStatuses: () => string[];
}

export const useEnrolledCoursesStore = create<EnrolledCoursesStore>()(
  devtools(
    (set, get) => ({
      enrolledCourses: [],
      filteredCourses: [],
      isLoading: false,
      error: null,
      searchQuery: "",
      statusFilter: "all",
      categoryFilter: "all",

      setEnrolledCourses: (enrolledCourses) => {
        set({ enrolledCourses });
        // Apply current filters
        const { searchQuery, statusFilter, categoryFilter } = get();
        get().applyFilters(
          enrolledCourses,
          searchQuery,
          statusFilter,
          categoryFilter
        );
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        const { enrolledCourses, statusFilter, categoryFilter } = get();
        get().applyFilters(
          enrolledCourses,
          query,
          statusFilter,
          categoryFilter
        );
      },

      setStatusFilter: (status) => {
        set({ statusFilter: status });
        const { enrolledCourses, searchQuery, categoryFilter } = get();
        get().applyFilters(
          enrolledCourses,
          searchQuery,
          status,
          categoryFilter
        );
      },

      setCategoryFilter: (category) => {
        set({ categoryFilter: category });
        const { enrolledCourses, searchQuery, statusFilter } = get();
        get().applyFilters(
          enrolledCourses,
          searchQuery,
          statusFilter,
          category
        );
      },

      clearFilters: () => {
        set({
          searchQuery: "",
          statusFilter: "all",
          categoryFilter: "all",
        });
        const { enrolledCourses } = get();
        set({ filteredCourses: enrolledCourses });
      },

      reset: () => {
        set({
          enrolledCourses: [],
          filteredCourses: [],
          isLoading: false,
          error: null,
          searchQuery: "",
          statusFilter: "all",
          categoryFilter: "all",
        });
      },

      getCategories: () => {
        const { enrolledCourses } = get();
        const categories = [
          ...new Set(
            enrolledCourses
              .map((enrollment) => enrollment.course.category)
              .filter(Boolean)
          ),
        ];
        return categories;
      },

      getStatuses: () => {
        const { enrolledCourses } = get();
        const statuses = [
          ...new Set(
            enrolledCourses.map((enrollment) => enrollment.enrollment_status)
          ),
        ];
        return statuses;
      },

      // Internal helper method for filtering
      applyFilters: (courses, searchQuery, statusFilter, categoryFilter) => {
        let filtered = [...courses];

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (enrollment) =>
              enrollment.course.name?.toLowerCase().includes(query) ||
              enrollment.course.description?.toLowerCase().includes(query) ||
              enrollment.course.tutor?.toLowerCase().includes(query) ||
              enrollment.course.category?.toLowerCase().includes(query)
          );
        }

        // Status filter
        if (statusFilter !== "all") {
          filtered = filtered.filter(
            (enrollment) => enrollment.enrollment_status === statusFilter
          );
        }

        // Category filter
        if (categoryFilter !== "all") {
          filtered = filtered.filter(
            (enrollment) => enrollment.course.category === categoryFilter
          );
        }

        set({ filteredCourses: filtered });
      },
    }),
    { name: "enrolled-courses-store" }
  )
);
