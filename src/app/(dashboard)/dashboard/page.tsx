"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

interface Dashboard {
  id: string;
  owner_id: string;
  created_at: string;
  // Add other dashboard fields as needed
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndDashboard();
  }, []);

  const fetchProfileAndDashboard = async () => {
    try {
      // Fetch user profile
      const userData = await api("/auth/profile");
      setUser(userData);

      // Fetch dashboard data
      const dashboardData = await api("/dashboard/");
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Redirect anyway in case of error
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Logout
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
                <p className="text-foreground">{user.full_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-foreground">
                  {user.is_verified ? (
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
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Information Card */}
        {dashboard && (
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
                  {dashboard.id}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-foreground">
                  {new Date(dashboard.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
