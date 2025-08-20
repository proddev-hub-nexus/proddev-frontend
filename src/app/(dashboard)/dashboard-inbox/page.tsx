"use client";

import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@/general/components/ui/skeleton";

import {
  MessageCircle,
  ExternalLink,
  Clipboard,
  ClipboardCheck,
  Search,
} from "lucide-react";

type EnrolledCourse = {
  enrollment_id: string;
  enrollment_status: "pending" | "paid" | "confirmed" | "cancelled";
  enrolled_at: string; // ISO
  whatsapp_link?: string | null;
  course: {
    id: string;
    name?: string;
    category?: string;
    language?: string;
  };
};

async function fetchEnrolled(): Promise<EnrolledCourse[]> {
  const res = await fetch("/api/enrollment/getEnrolledCourses", {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to load inbox (${res.status})`);
  }
  return res.json();
}

function statusVariant(s: EnrolledCourse["enrollment_status"]) {
  switch (s) {
    case "confirmed":
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

export default function DashboardInbox() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["enrolledCoursesForInbox"],
    queryFn: fetchEnrolled,
    staleTime: 0,
  });

  const items =
    (data || [])
      .filter((e) => !!e.whatsapp_link)
      .sort(
        (a, b) =>
          new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime()
      ) ?? [];

  // loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Inbox</h1>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="bg-card border border-border animate-pulse"
            >
              <CardHeader>
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-40" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // error
  if (isError) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Search className="w-10 h-10 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">Couldn’t load inbox</h3>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message || "Please try again."}
            </p>
          </div>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // empty
  if (items.length === 0) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="py-12 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
          <p className="text-sm text-muted-foreground">
            When you enroll for a course, your WhatsApp chat link with our team
            will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // copy helper
  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("WhatsApp link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <div className="text-sm text-muted-foreground">
          {items.length} message{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((e) => (
          <Card key={e.enrollment_id} className="bg-card border border-border">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  {e.course?.name || "Course"}
                </CardTitle>
                <Badge variant={statusVariant(e.enrollment_status) as any}>
                  {e.enrollment_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Your WhatsApp link for this enrollment:
              </div>

              <div className="text-sm break-all rounded-md border border-border px-3 py-2 bg-muted/50">
                {e.whatsapp_link}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link
                    href={e.whatsapp_link!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open WhatsApp
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copy(e.whatsapp_link!)}
                  className="shrink-0"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Sent on {new Date(e.enrolled_at).toLocaleString()} • ID:{" "}
                <span className="font-mono">{`enroll-id-${e.enrollment_id}`}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
