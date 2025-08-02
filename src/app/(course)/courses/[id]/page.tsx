"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCourseStore } from "../../store/useCourseStore";
import { useCourseActions, useCourseById } from "../../hooks/useCourseActions";
import { CourseList } from "../../components/courseList/course-list";
import {
  Star,
  Calendar,
  Users,
  Clock,
  Award,
  AlertCircle,
  PlayCircle,
  Download,
  Globe,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/general/components/ui/button";
import { Skeleton } from "@/general/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

const CourseDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
    <div className="relative z-10">
      {/* Back Button Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-6">
        <Skeleton className="h-10 w-24 bg-slate-600" />
      </div>

      {/* Hero Skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto bg-slate-600" />
          <Skeleton className="h-6 w-1/2 mx-auto bg-slate-600" />
          <div className="flex justify-center gap-6">
            <Skeleton className="h-4 w-24 bg-slate-600" />
            <Skeleton className="h-4 w-32 bg-slate-600" />
            <Skeleton className="h-4 w-28 bg-slate-600" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 lg:gap-8 xl:gap-12 space-y-6 lg:space-y-0">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <Skeleton className="h-48 w-full mb-6 bg-slate-600" />
                <Skeleton className="h-8 w-24 mx-auto mb-4 bg-slate-600" />
                <Skeleton className="h-12 w-full mb-4 bg-slate-600" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-slate-600" />
                  <Skeleton className="h-4 w-full bg-slate-600" />
                  <Skeleton className="h-4 w-full bg-slate-600" />
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 lg:order-1 space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <Skeleton className="h-64 w-full bg-slate-600" />
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <Skeleton className="h-6 w-48 mb-4 bg-slate-600" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-slate-600" />
                  <Skeleton className="h-4 w-3/4 bg-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default function CourseDetails() {
  const params = useParams();
  const courseId = params?.id as string;

  // Use the course hooks
  const { fetchAllCourses } = useCourseActions();
  const {
    data: currentCourse,
    isLoading,
    error,
    refetch,
  } = useCourseById(courseId);

  // Get courses from store for related courses
  const { courses } = useCourseStore();

  // Generate consistent image URL
  const generateImageUrl = (courseId: string) => {
    const imageOptions = [
      "/courseDetailImage.png",
      "/courseImage.png",
      "/courseImage1.png",
      "/courseImage2_cloud.png",
      "/courseImage3.png",
      "/courseImage4.png",
      "/courseImage5.png",
    ];
    const hash = courseId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return imageOptions[Math.abs(hash) % imageOptions.length];
  };

  // Generate consistent course stats
  const generateCourseStats = (courseId: string) => {
    const hash = courseId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return {
      rating: 3.5 + (Math.abs(hash) % 16) / 10, // 3.5 to 5.0
      students: 500 + (Math.abs(hash) % 4000), // 500 to 4500
      reviews: 50 + (Math.abs(hash) % 300), // 50 to 350 reviews
    };
  };

  // Format price
  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  // Get related courses (same category, different course)
  const getRelatedCourses = () => {
    if (!currentCourse || !courses.length) return [];
    return courses
      .filter(
        (course) =>
          course.available &&
          course._id !== currentCourse._id &&
          course.category === currentCourse.category
      )
      .slice(0, 3);
  };

  // Fetch all courses for related courses section
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  // Loading state
  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  // Error state
  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            Course Not Found
          </h1>
          <p className="text-slate-400 mb-6">{error ? String(error) : null}</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const courseStats = generateCourseStats(currentCourse._id);
  const relatedCourses = getRelatedCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-blue-600/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 sm:w-[400px] lg:w-[600px] h-72 sm:h-[400px] lg:h-[600px] bg-indigo-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/courses">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 p-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-100 leading-tight px-2">
                {currentCourse.name}
              </h1>
              {currentCourse.description && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
                  {currentCourse.description}
                </p>
              )}

              {/* Course quick stats */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-4 text-slate-400 text-xs sm:text-sm">
                {currentCourse.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500/60" />
                    <span>{currentCourse.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500/60" />
                  <span>{courseStats.students.toLocaleString()}+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500/60" />
                  <span>Certificate Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span>{courseStats.rating.toFixed(1)} Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-12">
              {/* Pricing Card */}
              <div className="lg:col-span-1 lg:order-2">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6 shadow-2xl">
                    <div className="relative rounded-xl overflow-hidden mb-6">
                      <Image
                        src={generateImageUrl(currentCourse._id)}
                        alt={currentCourse.name}
                        width={400}
                        height={240}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    </div>

                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
                          {formatPrice(currentCourse.price)}
                        </div>
                        <p className="text-slate-400 text-sm">
                          One-time payment • Lifetime access
                        </p>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-blue-500/20"
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Enroll Now
                      </Button>

                      <div className="space-y-4 pt-4 border-t border-slate-600/30">
                        <h4 className="text-slate-200 font-semibold mb-3">
                          This course includes:
                        </h4>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-slate-300">
                                Lifetime access
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4 text-blue-500" />
                              <span className="text-slate-300">
                                Downloadable resources
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-purple-500" />
                              <span className="text-slate-300">
                                Certificate of completion
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-indigo-500" />
                              <span className="text-slate-300">
                                Access on mobile and desktop
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-600/30 space-y-3">
                          {currentCourse.duration && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Duration</span>
                              <span className="text-slate-200">
                                {currentCourse.duration}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Language</span>
                            <span className="text-slate-200">
                              {currentCourse.language || "English"}
                            </span>
                          </div>

                          {currentCourse.max_students && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">
                                Max Students
                              </span>
                              <span className="text-slate-200">
                                {currentCourse.max_students}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Skill Level</span>
                            <span className="text-slate-200">All Levels</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="lg:col-span-2 lg:order-1 space-y-6">
                {/* Course Image */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6 shadow-2xl">
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={generateImageUrl(currentCourse._id)}
                      alt={currentCourse.name}
                      width={800}
                      height={400}
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <Button
                        size="lg"
                        className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/90 text-white border border-slate-600/50"
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Preview Course
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Course Info Bar */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <span className="text-slate-200 font-bold text-lg">
                          {(currentCourse.tutor || "I")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">
                          {currentCourse.tutor || "Expert Instructor"}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Course Instructor
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300 text-sm font-medium">
                          Created
                        </span>
                      </div>
                      <p className="text-slate-200">
                        {new Date(
                          currentCourse.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-300 text-sm font-medium">
                          Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(courseStats.rating)
                                  ? "text-yellow-500 fill-current"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-slate-400 text-sm">
                          {courseStats.rating.toFixed(1)} ({courseStats.reviews}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/60 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-slate-100 mb-4">
                    About This Course
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    {currentCourse.description ||
                      "This comprehensive course provides in-depth training and hands-on experience to help you master the essential skills needed in this field. You'll learn from industry experts and gain practical knowledge through real-world projects and exercises."}
                  </p>

                  {/* Course Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">Hands-on projects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">Expert instruction</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">
                        Certificate of completion
                      </span>
                    </div>
                  </div>

                  {currentCourse.category && (
                    <div className="pt-4 border-t border-slate-600/30">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">
                          Category:
                        </span>
                        <span className="px-3 py-1 bg-slate-700/60 text-slate-200 text-sm rounded-lg border border-slate-600/50">
                          {currentCourse.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                  Related Courses
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Expand your skills with these complementary courses in{" "}
                  {currentCourse.category}
                </p>
              </div>
              <CourseList />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
