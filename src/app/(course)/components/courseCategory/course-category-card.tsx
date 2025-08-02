"use client";
import { Button } from "@/general/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  BookOpen,
  LayoutGrid,
  TrendingUp,
  Palette,
  BarChart3,
  Smartphone,
  Database,
  Globe,
} from "lucide-react";
import { JSX } from "react";

export type CourseCategoryCardProps = {
  categoryName: string;
  coursesCount: number;
};

const getCategoryIcon = (name: string): JSX.Element => {
  const className = "w-6 h-6 sm:w-7 sm:h-7 text-white";
  const lowerName = name.toLowerCase();

  if (lowerName.includes("web") || lowerName.includes("development")) {
    return <Code className={className} />;
  }
  if (
    lowerName.includes("design") ||
    lowerName.includes("ui") ||
    lowerName.includes("ux")
  ) {
    return <Palette className={className} />;
  }
  if (lowerName.includes("marketing") || lowerName.includes("business")) {
    return <TrendingUp className={className} />;
  }
  if (lowerName.includes("data") || lowerName.includes("analytics")) {
    return <BarChart3 className={className} />;
  }
  if (lowerName.includes("mobile") || lowerName.includes("app")) {
    return <Smartphone className={className} />;
  }
  if (lowerName.includes("database") || lowerName.includes("sql")) {
    return <Database className={className} />;
  }
  if (lowerName.includes("seo") || lowerName.includes("digital")) {
    return <Globe className={className} />;
  }
  if (lowerName.includes("grid") || lowerName.includes("layout")) {
    return <LayoutGrid className={className} />;
  }

  return <BookOpen className={className} />;
};

function CourseCategoryCard({
  categoryName,
  coursesCount,
}: CourseCategoryCardProps): JSX.Element {
  return (
    <Link
      href={`/courses?category=${encodeURIComponent(categoryName)}`}
      className="group relative flex flex-col items-start gap-6 p-8 rounded-2xl border border-slate-700/60 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-750/90 hover:border-slate-600/70 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 hover:-translate-y-1 min-h-[200px]"
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/8 via-indigo-500/6 to-purple-500/8" />

      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl -z-20" />

      {/* Enhanced icon container */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 group-hover:from-slate-600 group-hover:to-slate-700 transition-all duration-500 border border-slate-600/60 group-hover:border-slate-500/70 group-hover:scale-110 shadow-lg">
        {getCategoryIcon(categoryName)}

        {/* Icon glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Enhanced content section */}
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors duration-300 leading-tight tracking-tight">
          {categoryName}
        </h3>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            {coursesCount} {coursesCount === 1 ? "Course" : "Courses"}
          </p>
          <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
            Explore now
          </p>
        </div>
      </div>

      {/* Enhanced arrow button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-6 right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-700/70 text-slate-300 border border-slate-600/60 hover:bg-slate-600/80 hover:text-white hover:border-slate-500/70 hover:scale-110 transition-all duration-300 shadow-md backdrop-blur-sm"
        aria-label={`View courses in ${categoryName} category`}
      >
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Button>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent group-hover:via-slate-500/70 transition-all duration-500" />

      {/* Corner decoration */}
      <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-slate-600/40 group-hover:bg-slate-500/60 transition-colors duration-500" />
    </Link>
  );
}

export default CourseCategoryCard;
