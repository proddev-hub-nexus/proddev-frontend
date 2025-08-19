"use client";
import { useAuthStore } from "@/general/store/auth-store";

import { useCourseActions } from "@/app/(course)/hooks/useCourseActions";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { fetchAllCourses, getUserEnrolledCourses } = useCourseActions();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {user?.full_name ?? "User"}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Account Status</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.is_verified ? "Active & Verified" : "Pending Verification"}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Account Type</h3>
          <p className="text-sm text-muted-foreground mt-1">Free Plan</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Last Login</h3>
          <p className="text-sm text-muted-foreground mt-1">Just now</p>
        </div>
      </section>

      {!user?.is_verified && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            Your email is not verified.&nbsp;
            <a className="underline" href="/verify-email">
              Verify now
            </a>
          </p>
        </div>
      )}

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            {user?.email ?? "—"}
          </div>
          <div>
            <span className="text-muted-foreground">Full name:</span>{" "}
            {user?.full_name ?? "—"}
          </div>
          <div>
            <span className="text-muted-foreground">Member since:</span>{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "—"}
          </div>
        </div>
      </section>
    </div>
  );
}
