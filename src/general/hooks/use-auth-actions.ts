import { useApiMutation } from "./use-api-mutations";
import { useApiQuery } from "./use-api-query";
import { useAuthStore } from "../store/auth-store";
import {
  User,
  LoginResponse,
  LoginData,
  RegisterData,
  RegisterResponse,
  Dashboard,
} from "../types/auth-types";
import { deleteCookie } from "cookies-next/client";

// Logout response interface
interface LogoutResponse {
  message: string;
}

export function useAuthActions() {
  const { token_id, clearAuth } = useAuthStore();

  // 🔐 Login
  const loginMutation = useApiMutation<LoginResponse, LoginData>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    "POST",
    { requiresAuth: false }
  );

  // 📝 Register
  const registerMutation = useApiMutation<RegisterResponse, RegisterData>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    "POST",
    { requiresAuth: false }
  );

  // 🚪 Logout
  const logoutMutation = useApiMutation<LogoutResponse, { token_id: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    "POST",
    { requiresAuth: true, isLogout: true }
  );

  // 👤 Profile
  const profileQuery = useApiQuery<User>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    requiresAuth: true,
    enabled: false,
  });

  // 📊 Dashboard
  const dashboardQuery = useApiQuery<Dashboard>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/`,
    requiresAuth: true,
    enabled: false,
  });

  // Custom logout function that handles both API call and local state
  const logout = async (): Promise<void> => {
    try {
      if (!token_id) {
        clearAuth();
        deleteCookie("access_token");
        return;
      }

      await logoutMutation.mutateAsync({ token_id });

      clearAuth();
      deleteCookie("access_token");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      deleteCookie("access_token");
      throw error;
    }
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    fetchProfile: profileQuery.refetch,
    fetchDashboard: dashboardQuery.refetch,
    loginMutation,
    registerMutation,
    logoutMutation,
    profileQuery,
    dashboardQuery,
  };
}
