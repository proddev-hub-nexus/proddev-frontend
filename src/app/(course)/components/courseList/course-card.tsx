"use client";
import type React from "react";
import Image from "next/image";
import { Button } from "@/general/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Course {
  _id: string;
  name: string;
  description?: string;
  tutor?: string;
  price?: number;
  category?: string;
  available?: boolean;
}

interface CourseCardProps {
  course: Course;
}

// Moved outside so it's not recreated every render
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
  const hash = Array.from(courseId).reduce(
    (acc, char) => (acc << 5) - acc + char.charCodeAt(0),
    0
  );
  return imageOptions[Math.abs(hash) % imageOptions.length];
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const imageUrl = generateImageUrl(course._id);
  return (
    <div className="bg-slate-800 hover:bg-slate-750 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg p-6 rounded-xl border border-slate-700 hover:border-slate-600 w-full max-w-sm flex flex-col">
      {/* Course Image */}
      <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-slate-700">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Course: ${course.name}`}
          width={400}
          height={225}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Course Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-lg leading-tight mb-2">
          <span className="block truncate">{course.name}</span>
        </h3>
        {/* Wrapper for tutor and description to control their combined height */}
        <div className="flex-grow min-h-[80px] mb-2">
          {course.tutor && (
            <p className="text-slate-400 text-sm mb-1">by {course.tutor}</p>
          )}
          {course.description && (
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
              {course.description}
            </p>
          )}
        </div>
        {/* Footer */}
        <footer className="flex items-center justify-between pt-2">
          {course.price !== undefined && (
            <span className="text-white font-semibold">
              {course.price === 0 ? "Free" : `₦${course.price.toFixed(2)}`}
            </span>
          )}
          {course.category && (
            <span className="px-3 py-1 min-w-[80px] text-center bg-slate-700 text-slate-300 text-xs rounded-md whitespace-nowrap">
              {course.category}
            </span>
          )}
        </footer>
        {/* View Course Button */}
        <div className="pt-4">
          <Link
            href={`/courses/${course._id}`}
            aria-label={`View course: ${course.name}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 hover:text-white border border-slate-600/50 hover:border-slate-500/60 rounded-lg transition-all duration-300"
            >
              View Course
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
