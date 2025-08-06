"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/general/store/auth-store";
import axios from "axios";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { setUser } = useAuthStore();

  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/profile");
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Always try to fetch profile - the API will handle token validation
        const profileData = await fetchProfile();
        if (profileData) {
          setUser(profileData);

          // If user is authenticated and on login/home page, redirect to dashboard
          if (pathname === "/" || pathname === "/account") {
            router.replace("/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);

        // If profile fetch fails (401 = no/invalid token), redirect to login for protected routes
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          if (isProtectedRoute) {
            router.replace(`/account?redirect=${encodeURIComponent(pathname)}`);
            return;
          }
        }
      }

      setCheckedAuth(true);
    };

    initAuth();
  }, [pathname, router, isProtectedRoute, setUser]);

  if (!checkedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
