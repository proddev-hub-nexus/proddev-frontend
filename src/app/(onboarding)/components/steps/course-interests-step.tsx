"use client";

import { useState, useEffect } from "react";
import { OnboardingData } from "../../onboarding/types/onboarding";
import { useCourseActions } from "@/app/(course)/hooks/useCourseActions";
import { useCourseStore } from "@/general/store/course-store";
import { Course } from "@/app/(course)/types";
import { Button } from "@/general/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  DollarSign,
  Star,
  User,
} from "lucide-react";
import { Badge } from "@/general/components/ui/badge";

interface CourseInterestsStepProps {
  data: Partial<OnboardingData>;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CourseInterestsStep({
  data,
  updateData,
  onNext,
  onBack,
}: CourseInterestsStepProps) {
  const { fetchAllCourses, isFetchingCourses } = useCourseActions();
  const { courses } = useCourseStore();
  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    data.interested_courses || []
  );

  // Fetch courses on component mount
  useEffect(() => {
    if (courses.length === 0) {
      fetchAllCourses();
    }
  }, [fetchAllCourses, courses.length]);

  // Get filtered courses based on user preferences
  const getRecommendedCourses = (): Course[] => {
    let availableCourses = courses.filter((course) => course.available);

    // If we have user preferences, we could add smart filtering here
    // For now, let's prioritize by category based on their goals/industry
    if (data.primary_goal || data.industry) {
      // Simple categorization based on goals
      const goalToCategoryMap: Record<string, string[]> = {
        career_change: ["Programming", "Design", "Marketing", "Data Science"],
        skill_upgrade: ["Programming", "DevOps", "Management"],
        promotion: ["Management", "Leadership", "Business"],
        side_business: ["Marketing", "Entrepreneurship", "E-commerce"],
        personal_growth: ["Design", "Programming", "Personal Development"],
      };

      const relevantCategories =
        goalToCategoryMap[data.primary_goal || ""] || [];

      if (relevantCategories.length > 0) {
        const categorizedCourses = availableCourses.filter(
          (course) =>
            course.category &&
            relevantCategories.some((cat) =>
              course.category?.toLowerCase().includes(cat.toLowerCase())
            )
        );

        // If we have categorized courses, prioritize them, otherwise show all
        if (categorizedCourses.length > 0) {
          availableCourses = [
            ...categorizedCourses,
            ...availableCourses.filter(
              (course) => !categorizedCourses.includes(course)
            ),
          ];
        }
      }
    }

    // Limit to first 8-12 courses for better UX
    return availableCourses.slice(0, 12);
  };

  const recommendedCourses = getRecommendedCourses();

  const toggleCourse = (courseId: string) => {
    let newSelection = [...selectedCourses];

    if (newSelection.includes(courseId)) {
      newSelection = newSelection.filter((id) => id !== courseId);
    } else if (newSelection.length < 3) {
      newSelection.push(courseId);
    }

    setSelectedCourses(newSelection);
    updateData({ interested_courses: newSelection });
  };

  const handleNext = () => {
    if (selectedCourses.length > 0) {
      onNext();
    }
  };

  // Format price for display
  const formatPrice = (price?: number) => {
    if (!price) return "Free";
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price}`;
  };

  // Check if course is popular (you can define your own logic)
  const isPopularCourse = (course: Course) => {
    // Example: courses with certain categories or lower prices might be popular
    const popularCategories = ["Programming", "Data Science", "Design"];
    return course.category && popularCategories.includes(course.category);
  };

  if (isFetchingCourses) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full" />
        <h2 className="text-xl font-semibold text-slate-100">
          Finding Perfect Courses
        </h2>
        <p className="text-slate-400">
          Personalizing recommendations based on your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-100">
          Choose Your Learning Path
        </h2>
        <p className="text-slate-400">
          Select up to 3 courses that interest you. We will prioritize these in
          your dashboard.
        </p>
        <div className="flex justify-center">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
            {selectedCourses.length}/3 selected
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {recommendedCourses.map((course) => {
          const isSelected = selectedCourses.includes(course._id);
          const canSelect = selectedCourses.length < 3 || isSelected;
          const isPopular = isPopularCourse(course);

          return (
            <div
              key={course._id}
              onClick={() => canSelect && toggleCourse(course._id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : canSelect
                      ? "border-slate-600 hover:border-slate-500 bg-slate-700/30"
                      : "border-slate-700 bg-slate-700/10 opacity-50 cursor-not-allowed"
                }
              `}
            >
              {isPopular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-100 text-sm leading-tight">
                    {course.name}
                  </h3>
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {course.description ||
                    "Professional course designed to advance your skills"}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </span>
                    {course.tutor && (
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {course.tutor}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-300 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatPrice(course.price)}
                  </span>
                </div>

                {course.category && (
                  <div className="flex justify-start">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {recommendedCourses.length === 0 ? (
        <div className="text-center p-8 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            No Courses Available
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            We are working on adding more courses. You can continue and explore
            courses later.
          </p>
          <Button
            onClick={onNext}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            Continue Without Selecting
          </Button>
        </div>
      ) : selectedCourses.length === 0 ? (
        <div className="text-center p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <p className="text-sm text-slate-400">
            Select at least one course to continue, or{" "}
            <button
              onClick={onNext}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              skip this step
            </button>
          </p>
        </div>
      ) : null}

      <div className="flex justify-between space-x-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={false} // Allow continuing even without selection
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {selectedCourses.length > 0 ? "Continue" : "Skip for Now"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
