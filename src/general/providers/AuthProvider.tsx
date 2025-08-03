"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { fetchProfile } = useAuthActions();
  const { user_id, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = getCookie("user_authenticated");

      // If no cookie → show toast + delay redirect
      if (!isAuthenticated) {
        toast.warning("You need to log in to access the dashboard.");
        setTimeout(() => router.push("/account"), 1500); // ⏳ 1.5s delay
        return;
      }

      try {
        // Try to fetch profile if cookie exists
        if (!user_id) {
          await fetchProfile();
        }
      } catch (error) {
        console.error(error);
        toast.warning("Your session has expired. Please log in again.");
        setTimeout(() => router.push("/account"), 1500);
      }
    };

    checkAuth();
  }, [router, fetchProfile, user_id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
