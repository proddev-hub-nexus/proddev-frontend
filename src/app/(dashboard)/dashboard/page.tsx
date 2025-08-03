"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";

export default function Dashboard() {
  const router = useRouter();
  const {
    logout,
    fetchProfile,
    fetchDashboard,
    isLoggingOut,
    dashboardData,
    isFetchingDashboard,
  } = useAuthActions();

  const { user_id, email, full_name, isVerified, created_at, isLoading } =
    useAuthStore();

  const [hasInitialized, setHasInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Memoize the initialization function to prevent infinite loops
  const initializeDashboard = useCallback(async () => {
    if (hasInitialized) return;

    console.log("Initializing dashboard...");
    setInitError(null);

    try {
      // Check backend session by fetching profile directly
      console.log("Fetching profile...");
      await fetchProfile();

      // If profile fetch succeeds, fetch dashboard
      console.log("Fetching dashboard...");
      await fetchDashboard();

      console.log("Dashboard initialized successfully");
      setHasInitialized(true);
    } catch (error) {
      console.error("Auth/session invalid:", error);
      setInitError("Authentication failed");
      router.replace("/account");
    }
  }, [hasInitialized, fetchProfile, fetchDashboard, router]);

  // Use effect with minimal dependencies
  useEffect(() => {
    initializeDashboard();
  }, []); // Empty dependency array - only run once

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
  };

  const handleRetryDashboard = async () => {
    try {
      await fetchDashboard();
    } catch (error) {
      console.error("Retry dashboard fetch failed:", error);
    }
  };

  // Show loading state
  if (!hasInitialized || isLoading || isFetchingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {initError ? "Authentication failed..." : "Loading dashboard..."}
          </p>
          {initError && (
            <p className="text-destructive text-sm mt-2">{initError}</p>
          )}
        </div>
      </div>
    );
  }

  // Show error if initialization failed but we're still here
  if (hasInitialized && (!user_id || !email)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-destructive">Session expired. Redirecting...</p>
        </div>
      </div>
    );
  }
  console.log(dashboardData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {full_name}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    Logging out...
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Information Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-foreground">{full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-foreground">{email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-foreground">
                  {isVerified ? (
                    <span className="text-green-600">✅ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠️ Unverified</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </label>
                <p className="text-foreground">
                  {created_at
                    ? new Date(created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* User ID for debugging */}
          <div className="mt-4 pt-4 border-t border-border">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                User ID
              </label>
              <p className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded">
                {user_id}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Information Card */}
        {dashboardData && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Dashboard Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dashboard ID
                </label>
                <p className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded">
                  {dashboardData.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-foreground">
                  {new Date(dashboardData.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Owner ID
                </label>
                <p className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded">
                  {dashboardData.owner}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard fetch error */}
        {!dashboardData && hasInitialized && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Dashboard Information
            </h2>
            <p className="text-muted-foreground">
              Unable to load dashboard information.
              <button
                onClick={handleRetryDashboard}
                disabled={isFetchingDashboard}
                className="ml-2 text-primary hover:underline disabled:opacity-50"
              >
                {isFetchingDashboard ? "Retrying..." : "Try again"}
              </button>
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/courses")}
              className="p-4 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1">
                Browse Courses
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore available learning content
              </p>
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="p-4 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1">Edit Profile</h3>
              <p className="text-sm text-muted-foreground">
                Update your account information
              </p>
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="p-4 text-left border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your preferences
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
