"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth-store";
import { useApiMutation } from "./use-api-mutations";
import { useApiQuery } from "./use-api-query";

// Types for better type safety
interface User {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuthActions() {
  const { setUser, clearUser, setLoading, setError } = useAuthStore();

  // ---- Profile Query ----
  const profileQuery = useApiQuery<User>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    requiresAuth: true,
    enabled: false, // Fetch only when needed
  });

  // ---- Register Mutation ----
  const registerMutation = useApiMutation<User, RegisterData>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    "POST",
    {
      requiresAuth: false,
      onSuccess: (data) => {
        setUser({
          user_id: data.id,
          email: data.email,
          full_name: data.full_name,
          isVerified: data.is_verified,
          created_at: new Date(data.created_at),
        });
      },
      onError: () => setError("Registration failed"),
    }
  );

  // ---- Login Mutation ----
  const loginMutation = useApiMutation<unknown, LoginData>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    "POST",
    {
      requiresAuth: false,
      onSuccess: () => {
        profileQuery.refetch();
      },
      onError: () => setError("Login failed"),
    }
  );

  // ---- Logout Mutation ----
  const logoutMutation = useApiMutation<unknown, void>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    "POST",
    {
      requiresAuth: true,
      onSuccess: () => clearUser(),
      onError: () => setError("Logout failed"),
    }
  );

  // ---- Sync Zustand with profile query (moved to useEffect) ----
  useEffect(() => {
    if (profileQuery.data) {
      setUser({
        user_id: profileQuery.data.id,
        email: profileQuery.data.email,
        full_name: profileQuery.data.full_name,
        isVerified: profileQuery.data.is_verified,
        created_at: new Date(profileQuery.data.created_at),
      });
    }
  }, [profileQuery.data, setUser]);

  // ---- Sync loading states ----
  useEffect(() => {
    const isLoading =
      registerMutation.isPending ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      profileQuery.isLoading;

    setLoading(isLoading);
  }, [
    registerMutation.isPending,
    loginMutation.isPending,
    logoutMutation.isPending,
    profileQuery.isLoading,
    setLoading,
  ]);

  // ---- Sync errors ----
  useEffect(() => {
    if (profileQuery.error) {
      setError("Failed to fetch profile");
    }
  }, [profileQuery.error, setError]);

  // ---- Actions returned to components ----
  return {
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: () => logoutMutation.mutate(undefined), // Fixed void parameter
    fetchProfile: profileQuery.refetch,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    profileData: profileQuery.data,
    profileError: profileQuery.error,
  };
}
