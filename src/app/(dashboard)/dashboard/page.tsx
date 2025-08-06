"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";

export default function Dashboard() {
  const router = useRouter();
  const { logout } = useAuthActions();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out.");
      router.replace("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.full_name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-destructive px-4 py-2 rounded-md hover:bg-destructive/80 transition text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 px-4">
        {/* User Profile Card */}
        <div className="bg-card border border-border p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-foreground min-w-[120px]">Email:</strong>
              <span className="text-muted-foreground">
                {user?.email || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-foreground min-w-[120px]">
                Full Name:
              </strong>
              <span className="text-muted-foreground">
                {user?.full_name || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-foreground min-w-[120px]">Status:</strong>
              <span
                className={`inline-flex items-center gap-1 ${
                  user?.is_verified ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {user?.is_verified ? (
                  <>
                    <span className="text-green-500">✅</span>
                    Verified
                  </>
                ) : (
                  <>
                    <span className="text-yellow-500">⚠️</span>
                    Unverified
                  </>
                )}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <strong className="text-foreground min-w-[120px]">
                Member Since:
              </strong>
              <span className="text-muted-foreground">
                {user?.created_at || "Unknown"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <strong className="text-foreground min-w-[120px]">
                User ID:
              </strong>
              <span className="text-muted-foreground font-mono text-sm break-all">
                {user?.user_id || "Unknown"}
              </span>
            </div>
          </div>

          {/* Verification Status Banner - though this shouldn't show since AuthProvider handles it */}
          {!user?.is_verified && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                <p className="text-sm text-yellow-800">
                  Your email address is not verified.
                  <button
                    onClick={() => router.push("/verify-email")}
                    className="ml-1 underline hover:no-underline"
                  >
                    Verify now
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="mt-6 bg-card border border-border p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome to your dashboard, {user?.full_name || "User"}! This is
            where your main content will go.
          </p>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-foreground">Account Status</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.is_verified
                  ? "Active & Verified"
                  : "Pending Verification"}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-foreground">Account Type</h3>
              <p className="text-sm text-muted-foreground mt-1">Free Plan</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium text-foreground">Last Login</h3>
              <p className="text-sm text-muted-foreground mt-1">Just now</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
