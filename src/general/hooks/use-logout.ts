"use client";

import { useAuthStore } from "../store/auth-store";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  const logout = async (): Promise<void> => {
    try {
      // Call the logout API route
      await axios.post("/api/logout");

      // Clear local auth state
      clearAuth();

      router.push("/account");
    } catch (error) {
      console.error("Logout error:", error);

      // Always clear auth state even if API call fails
      clearAuth();

      throw error;
    }
  };

  return { logout };
}
