import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Course } from "../types";
import { CourseSearchService } from "@/general/service/filtering-service";

interface CourseStore {
  courses: Course[];
  filteredCourses: Course[];
  paginatedCourses: Course[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  setCourses: (courses: Course[]) => void;
  setFilteredCourses: (courses: Course[]) => void;
  setCategories: (categories: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  clearFilters: () => void;
  reset: () => void;
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set, get) => ({
      courses: [],
      filteredCourses: [],
      paginatedCourses: [],
      categories: [],
      isLoading: false,
      error: null,
      selectedCategory: "all",
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 4,

      setCourses: (courses) => {
        const { itemsPerPage } = get();
        const searchService = new CourseSearchService(courses);
        const filtered = searchService.filterAvailableCourses();
        const paginated = searchService.paginateCourses(
          filtered,
          1,
          itemsPerPage
        );

        set({
          courses,
          filteredCourses: filtered,
          paginatedCourses: paginated,
        });
      },

      setFilteredCourses: (filteredCourses) => {
        const { currentPage, itemsPerPage } = get();
        const searchService = new CourseSearchService(filteredCourses);
        const paginated = searchService.paginateCourses(
          filteredCourses,
          currentPage,
          itemsPerPage
        );

        set({
          filteredCourses,
          paginatedCourses: paginated,
        });
      },

      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        const { courses, selectedCategory, itemsPerPage } = get();
        const searchService = new CourseSearchService(courses);
        const filtered = searchService.filterCourses(query, selectedCategory);
        const paginated = searchService.paginateCourses(
          filtered,
          1,
          itemsPerPage
        );

        set({
          filteredCourses: filtered,
          paginatedCourses: paginated,
        });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category, currentPage: 1 });
        const { courses, searchQuery, itemsPerPage } = get();
        const searchService = new CourseSearchService(courses);
        const filtered = searchService.filterCourses(searchQuery, category);
        const paginated = searchService.paginateCourses(
          filtered,
          1,
          itemsPerPage
        );

        set({
          filteredCourses: filtered,
          paginatedCourses: paginated,
        });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
        const { filteredCourses, itemsPerPage } = get();
        const searchService = new CourseSearchService(filteredCourses);
        const paginated = searchService.paginateCourses(
          filteredCourses,
          page,
          itemsPerPage
        );

        set({
          paginatedCourses: paginated,
        });
      },

      clearFilters: () => {
        const { courses, itemsPerPage } = get();
        const searchService = new CourseSearchService(courses);
        const filtered = searchService.filterAvailableCourses();
        const paginated = searchService.paginateCourses(
          filtered,
          1,
          itemsPerPage
        );

        set({
          searchQuery: "",
          selectedCategory: "all",
          filteredCourses: filtered,
          paginatedCourses: paginated,
          currentPage: 1,
        });
      },

      reset: () => {
        set({
          courses: [],
          filteredCourses: [],
          paginatedCourses: [],
          categories: [],
          isLoading: false,
          error: null,
          selectedCategory: "all",
          searchQuery: "",
          currentPage: 1,
        });
      },
    }),
    { name: "course-store" }
  )
);
