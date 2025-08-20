"use client";

import { useParams, useRouter } from "next/navigation";
import type { Course } from "@/app/(course)/types";
import { useCourseById } from "@/app/(course)/hooks/useCourseActions";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { Badge } from "@/general/components/ui/badge";
import { Button } from "@/general/components/ui/button";
import { Skeleton } from "@/general/components/ui/skeleton";
import { ArrowLeft, Clock, Users } from "lucide-react";

export default function EnrolledCourseDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseIdFromUrl = params?.id ?? "";

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseById(courseIdFromUrl);

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Card className="bg-card border border-border">
          <CardHeader>
            <Skeleton className="h-7 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Error ----
  if (isError || !course) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="py-10 flex flex-col items-center gap-3">
          <div className="text-lg font-semibold">Couldn’t load course</div>
          <div className="text-sm text-muted-foreground">
            {error ? String(error) : "Please try again."}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // prefer _id, then id, then URL param
  const courseId = (course as Partial<Course>)._id ?? courseIdFromUrl;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-muted-foreground">
          Course ID: {courseId}
        </div>
      </div>

      {/* content */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-2xl">{course.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {course.category && (
                <Badge variant="outline">{course.category}</Badge>
              )}
              {course.language && (
                <Badge variant="secondary">{course.language}</Badge>
              )}
              {typeof course.available === "boolean" && (
                <Badge>{course.available ? "Available" : "Closed"}</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* two-column: left facts, right description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* left: quick facts */}
            <div className="space-y-3 text-sm text-muted-foreground lg:col-span-1">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              )}
              {typeof course.max_students === "number" && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Max {course.max_students}</span>
                </div>
              )}
              {course.tutor && (
                <div>
                  <strong className="text-foreground">Tutor:</strong>{" "}
                  {course.tutor}
                </div>
              )}
              <div>
                <strong className="text-foreground">Price:</strong>{" "}
                {typeof course.price === "number"
                  ? `₦${course.price.toLocaleString()}`
                  : "Free"}
              </div>
            </div>

            {/* right: description */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-2">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {course.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* footer actions */}
          <div className="flex flex-wrap gap-2 pt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
