"use client";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/general/components/ui/input";
import { Search, BookOpen, Clock, Star, Users, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/general/components/ui/select";
import { useState, useRef, useEffect, useCallback } from "react";
import { useCourseStore } from "@/app/(course)/store/useCourseStore";
import { useCourseActions } from "@/app/(course)/hooks/useCourseActions";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Zustand store
  const {
    filteredCourses,
    categories,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
  } = useCourseStore();

  const { fetchAllCourses } = useCourseActions();

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchCourses = useCallback(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  // Load courses on component mount - fixed dependencies
  useEffect(() => {
    if (filteredCourses.length === 0 && !isLoading && !error) {
      fetchCourses();
    }
  }, [filteredCourses.length, isLoading, error, fetchCourses]);

  // Create a search function that filters courses
  const searchCourses = useCallback(
    (query: string) => {
      if (!query.trim()) return filteredCourses;

      const searchTerm = query.toLowerCase();
      return filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm) ||
          course.tutor?.toLowerCase().includes(searchTerm) ||
          course.category?.toLowerCase().includes(searchTerm)
      );
    },
    [filteredCourses]
  );

  // Real-time search results
  const searchResults = searchQuery.trim()
    ? searchCourses(searchQuery).slice(0, 10)
    : filteredCourses.slice(0, 8);

  // Show results when focused
  const shouldShowResults = isSearchFocused && !isLoading;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate smart dropdown height
  const calculateDropdownHeight = () => {
    if (typeof window === "undefined") return 400;
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - rect.bottom - 40;
      return Math.max(Math.min(availableHeight, 500), 200);
    }
    return 400;
  };

  const handleSearch = () => {
    if (searchQuery.trim() || selectedCategory) {
      // Navigate to courses page with search params
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      router.push(`/courses?${params.toString()}`);
      setIsSearchFocused(false);
    }
  };

  const handleResultClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
    setIsSearchFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleClearSearch = () => {
    clearFilters();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateRating = (courseId: string) => {
    // Generate consistent fake rating based on course ID
    const hash = courseId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 3.5 + (Math.abs(hash) % 16) / 10; // Rating between 3.5 and 5.0
  };

  const generateStudentCount = (courseId: string) => {
    // Generate consistent fake student count based on course ID
    const hash = courseId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 500 + (Math.abs(hash) % 4000); // Between 500 and 4500 students
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="flex w-full h-12 rounded-lg border border-slate-700 bg-slate-800 px-2 sm:px-3 shadow-md items-center space-x-2">
        {/* Category Select */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[120px] sm:w-[140px] h-9 border-none bg-slate-700 text-white text-sm rounded-md px-3 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-md bg-slate-800 text-white border border-slate-600 shadow-lg z-[70]">
            <SelectGroup>
              <SelectLabel className="px-3 py-1 text-xs text-slate-400 uppercase tracking-wide">
                Courses
              </SelectLabel>
              <SelectItem
                value="all"
                className="px-3 py-2 text-sm hover:bg-slate-700 cursor-pointer"
              >
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="px-3 py-2 text-sm hover:bg-slate-700 cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Search Input with Clear Button */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search courses, instructors..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full h-9 text-sm bg-slate-800 border-none focus:outline-none focus:ring-0 text-white placeholder:text-slate-400 px-3 pr-8"
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <Button
          size="icon"
          className="w-9 h-9 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 text-sm">
          <p>Error loading courses: {error}</p>
          <button onClick={() => fetchAllCourses()}>Try again</button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {shouldShowResults && !error && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{
            maxHeight: `${calculateDropdownHeight()}px`,
          }}
        >
          {/* Conditional Header */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-700/30">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory !== "all"
                    ? `${selectedCategory} Courses`
                    : "Search Results"}
                </h3>
                <span className="text-xs text-slate-400">
                  {searchResults.length} course
                  {searchResults.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          )}

          {/* Scrollable Results */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${calculateDropdownHeight() - 100}px` }}
          >
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((course) => (
                  <div
                    key={course._id}
                    className="px-4 py-3 hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-slate-700/20 last:border-b-0"
                    onClick={() => handleResultClick(course._id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Course Icon */}
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <BookOpen className="w-5 h-5 text-slate-300" />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-100 mb-1 truncate">
                          {course.name}
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          by {course.tutor || "Unknown Instructor"}
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{generateRating(course._id).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {generateStudentCount(
                                course._id
                              ).toLocaleString()}
                            </span>
                          </div>
                          {course.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-medium text-slate-100">
                          {formatPrice(course.price)}
                        </div>
                        {course.category && (
                          <div className="text-xs text-slate-400 capitalize">
                            {course.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show more indicator */}
                {(searchQuery
                  ? searchCourses(searchQuery).length
                  : filteredCourses.length) > searchResults.length && (
                  <div className="px-4 py-3 text-center border-t border-slate-700/30">
                    <button
                      onClick={handleSearch}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all{" "}
                      {searchQuery
                        ? searchCourses(searchQuery).length
                        : filteredCourses.length}{" "}
                      results
                    </button>
                  </div>
                )}
              </div>
            ) : searchQuery || selectedCategory !== "all" ? (
              <div className="px-4 py-8 text-center">
                <div className="text-slate-400 mb-2">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                </div>
                <p className="text-sm text-slate-400">
                  No courses found{searchQuery && ` for "${searchQuery}"`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try different keywords or adjust your category filter
                </p>
              </div>
            ) : (
              <div className="px-4 py-4">
                <h4 className="text-sm font-medium text-slate-200 mb-3">
                  Popular Courses
                </h4>
                <div className="space-y-2">
                  {filteredCourses.slice(0, 6).map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer transition-colors"
                      onClick={() => handleResultClick(course._id)}
                    >
                      <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">
                          {course.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {course.category || "General"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-300 flex-shrink-0">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {(searchQuery || selectedCategory !== "all") &&
            searchResults.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-700/30">
                <div className="flex items-center justify-between">
                  <button
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={handleSearch}
                  >
                    View all results
                  </button>
                  <button
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={handleClearSearch}
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
