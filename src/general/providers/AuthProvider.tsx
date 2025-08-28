"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/general/store/auth-store";
import axios from "axios";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];
//protects route
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
        const profileData = await fetchProfile();
        if (profileData) {
          setUser(profileData);
          if (pathname === "/" || pathname === "/account") {
            router.replace("/");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          if (isProtectedRoute) {
            router.replace(`/account`);
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
