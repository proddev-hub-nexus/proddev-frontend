"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
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
  Search,
  Loader2,
  PlusCircle,
} from "lucide-react";

import { useCourseActions } from "@/app/(course)/hooks/useCourseActions";
import { useCourseStore } from "@/app/(course)/store/useCourseStore";
// ⬇️ adjust path if different in your repo
import { enrollNow } from "@/app/(course)/util/course-api";
import CheckoutButton from "@/app/(cart)/component/checkout-btn";

type EnrollResponse = {
  whatsapp_link?: string;
  // add any other fields you return
};

export default function DashboardCourses() {
  const { fetchAllCourses, isFetchingCourses } = useCourseActions();
  const { filteredCourses, error } = useCourseStore();

  // track which card is enrolling (per-card loading)
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      const res = (await enrollNow(courseId)) as EnrollResponse;

      toast.success("Enrollment created 🎉", {
        description:
          "We’ve sent a confirmation email. You can also chat with us on WhatsApp.",
        action: res?.whatsapp_link
          ? {
              label: "Open WhatsApp",
              onClick: () =>
                window.open(res.whatsapp_link!, "_blank", "noopener"),
            }
          : undefined,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        toast.error("Please sign in to enroll.");
      } else if (status === 409) {
        toast.info("You’re already enrolled for this course.");
      } else {
        toast.error(detail || "Enrollment failed. Please try again.");
      }
    } finally {
      setEnrollingId(null);
    }
  };

  // Loading skeleton
  if (isFetchingCourses) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Courses</h1>
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

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Search className="w-10 h-10 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">
              Couldn’t load courses
            </h3>
            <p className="text-sm text-muted-foreground">{String(error)}</p>
          </div>
          <Button onClick={() => fetchAllCourses()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!filteredCourses || filteredCourses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-1">No courses available</h3>
            <p className="text-sm text-muted-foreground">
              Check back later as new courses are added regularly.
            </p>
          </div>
          <Button onClick={() => fetchAllCourses()}>Refresh</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <div className="text-sm text-muted-foreground">
          {filteredCourses.length} course
          {filteredCourses.length !== 1 ? "s" : ""}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const isBusy = enrollingId === course._id;
          const canEnroll = !!course.available;

          return (
            <Card
              key={course._id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 flex-1">
                    {course.name}
                  </CardTitle>
                  {course.available ? (
                    <Badge>Available</Badge>
                  ) : (
                    <Badge variant="secondary">Closed</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {course.category && (
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  )}
                  {course.language && (
                    <Badge variant="secondary" className="text-xs">
                      {course.language}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {course.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  {typeof course.max_students === "number" && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Max {course.max_students}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.tutor && (
                    <div className="col-span-2">
                      <strong>Tutor:</strong> {course.tutor}
                    </div>
                  )}
                  <div className="col-span-2">
                    <strong>Price:</strong>{" "}
                    {typeof course.price === "number"
                      ? `₦${course.price.toLocaleString()}`
                      : "Free"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <CheckoutButton />
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                  >
                    <Link href={`/dashboard-courses/${course._id}`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      View details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => fetchAllCourses()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
