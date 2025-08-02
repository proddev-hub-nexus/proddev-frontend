"use client";

import { useEffect } from "react";
import Hero from "@/general/components/hero";
import CallToAction from "@/general/components/call-to-action";
import CourseCategoryList from "../(course)/components/courseCategory/course-category-list";
import Link from "next/link";
import { useCourseActions } from "../(course)/hooks/useCourseActions";
import { CourseList } from "../(course)/components/courseList/course-list";

export default function Home() {
  const { fetchAllCourses } = useCourseActions();

  // Fetch courses on mount
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Hero Section */}
      <Hero />

      {/* Course Categories Section */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-blue-600/4 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 sm:w-[400px] lg:w-[600px] h-72 sm:h-[400px] lg:h-[600px] bg-indigo-600/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
              Explore{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Categories</span>
                <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 lg:h-1.5 bg-gradient-to-r from-blue-500/40 via-indigo-500/60 to-blue-500/40 rounded-full"></div>
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Discover courses across various domains and accelerate your
              learning journey
            </p>
          </div>

          <CourseCategoryList
            useStoreData={true}
            limit={8}
            showLoadingState={true}
          />
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-4">
            Featured{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Courses</span>
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 lg:h-1.5 bg-gradient-to-r from-blue-500/40 via-indigo-500/60 to-blue-500/40 rounded-full"></div>
            </span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Start your learning journey with our most popular and highly-rated
            courses
          </p>
        </div>

        <CourseList />

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/courses"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-blue-500/20"
          >
            View All Courses
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <CallToAction />
        </div>
      </section>
    </div>
  );
}
