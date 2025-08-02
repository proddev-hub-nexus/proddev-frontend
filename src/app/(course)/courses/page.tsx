"use client";

import { useEffect } from "react";
import { useCourseActions } from "../hooks/useCourseActions";
import SearchBar from "../../../general/components/search-bar";
import { CourseList } from "../components/courseList/course-list";
import CallToAction from "@/general/components/call-to-action";
import { useCourseStore } from "../store/useCourseStore";
export default function LearnWithUsPage() {
  const { fetchAllCourses } = useCourseActions();
  const { courses, categories } = useCourseStore();

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight text-center py-4">
        Professional{" "}
        <span className="relative inline-block">
          <span className="relative z-10">Courses</span>
          <div className="absolute -bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500/40 via-indigo-500/60 to-blue-500/40 rounded-full"></div>
        </span>
      </h1>
      {/* Stats */}

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
          <span>{courses.length} Courses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500/60 rounded-full"></div>
          <span>{categories.length} Categories</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
          <span>Expert Instructors</span>
        </div>
      </div>

      {/* Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8 lg:pt-12">
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </section>
      <CourseList />
      <CallToAction />

      {/* Trust Section */}
      <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                {courses.length}+
              </div>
              <div className="text-sm text-slate-300">Expert Courses</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-slate-300">Categories</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                24/7
              </div>
              <div className="text-sm text-slate-300">Support</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                100%
              </div>
              <div className="text-sm text-slate-300">Online</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
