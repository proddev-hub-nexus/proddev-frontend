"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { fetchProfile } = useAuthActions();
  const { setUser } = useAuthStore();

  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    const token = getCookie("access_token");

    if (isProtectedRoute && !token) {
      router.replace(`/account?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (token) {
      // Fetch profile if token exists
      fetchProfile()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }

    if (token && (pathname === "/" || pathname === "/account")) {
      router.replace("/dashboard");
      return;
    }

    setCheckedAuth(true);
  }, [pathname, router, isProtectedRoute, fetchProfile, setUser]);

  if (!checkedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
