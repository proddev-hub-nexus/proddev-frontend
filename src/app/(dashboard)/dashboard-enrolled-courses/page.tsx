"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { Badge } from "@/general/components/ui/badge";
import { Button } from "@/general/components/ui/button";
import {
  BookOpen,
  Clock,
  Users,
  ExternalLink,
  MessageCircle,
  Search,
} from "lucide-react";

type Course = {
  id: string; // backend converts to string
  name: string;
  description?: string;
  tutor?: string;
  category?: string;
  price?: number;
  duration?: string;
  max_students?: number;
  language?: string;
  available?: boolean;
};

type EnrolledCourse = {
  enrollment_id: string;
  enrollment_status: "pending" | "paid" | "confirmed" | "cancelled";
  badge?: string;
  enrolled_at: string; // ISO
  whatsapp_link?: string | null;
  course: Course;
};

async function fetchEnrolled(): Promise<EnrolledCourse[]> {
  const res = await fetch("/api/enrollment/getEnrolledCourses", {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function statusVariant(status: EnrolledCourse["enrollment_status"]) {
  switch (status) {
    case "confirmed":
      return "default";
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "outline";
    default:
      return "secondary";
  }
}

function statusColor(status: EnrolledCourse["enrollment_status"]) {
  switch (status) {
    case "confirmed":
      return "text-green-600";
    case "paid":
      return "text-blue-600";
    case "pending":
      return "text-yellow-600";
    case "cancelled":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

export default function EnrolledPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolled,
    staleTime: 0,
  });

  // loading skeleton
  if (isLoading || isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Enrolled Courses</h1>
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="flex gap-2 mt-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-12" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // error state
  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Search className="w-10 h-10 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">
              Couldn’t load your courses
            </h3>
            <p className="text-sm text-muted-foreground">
              {(error as Error).message || "Please try again."}
            </p>
          </div>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const enrolled = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Enrolled Courses</h1>
        <div className="text-sm text-muted-foreground">
          {enrolled.length} course{enrolled.length !== 1 ? "s" : ""}
        </div>
      </div>

      {enrolled.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolled.map((enrollment) => (
            <Card
              key={enrollment.enrollment_id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 flex-1">
                    {enrollment.course?.name ?? "Untitled course"}
                  </CardTitle>
                  <Badge
                    variant={statusVariant(enrollment.enrollment_status) as any}
                    className={statusColor(enrollment.enrollment_status)}
                  >
                    {enrollment.enrollment_status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {enrollment.course?.category && (
                    <Badge variant="outline" className="text-xs">
                      {enrollment.course.category}
                    </Badge>
                  )}
                  {enrollment.course?.language && (
                    <Badge variant="secondary" className="text-xs">
                      {enrollment.course.language}
                    </Badge>
                  )}
                  {enrollment.course?.available && (
                    <Badge className="text-xs">Available</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {enrollment.course?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {enrollment.course.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  {typeof enrollment.course?.max_students === "number" && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Max {enrollment.course.max_students}</span>
                    </div>
                  )}
                  {enrollment.course?.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{enrollment.course.duration}</span>
                    </div>
                  )}
                  {enrollment.course?.tutor && (
                    <div className="col-span-2">
                      <strong>Tutor:</strong> {enrollment.course.tutor}
                    </div>
                  )}
                  <div className="col-span-2">
                    <strong>Enrolled:</strong>{" "}
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                    <strong>Price:</strong>{" "}
                    {typeof enrollment.course?.price === "number"
                      ? `₦${enrollment.course.price.toLocaleString()}`
                      : "Free"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/dashboard-courses/${enrollment.course?.id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      {enrollment.enrollment_status === "pending"
                        ? "View Course"
                        : "Continue"}
                    </Link>
                  </Button>

                  {enrollment.whatsapp_link && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={enrollment.whatsapp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start your learning journey by exploring and enrolling in courses
              that match your interests.
            </p>
            <Button asChild>
              <Link href="/dashboard-courses">
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse Available Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
