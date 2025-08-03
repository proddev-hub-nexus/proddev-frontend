/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface Dashboard {
  id: string;
  owner: string;
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

interface VerifyEmailResponse {
  message: string;
}

interface ResendVerificationData {
  email: string;
}

export function useAuthActions() {
  const { setUser, clearUser, setLoading, setError } = useAuthStore();

  // ---- Profile Query ----
  const profileQuery = useApiQuery<User>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    requiresAuth: true,
    enabled: false, // Fetch only when needed
  });

  // ---- Dashboard Query ----
  const dashboardQuery = useApiQuery<Dashboard>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/`,
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
      onError: (error: any) => {
        setError(error.message || "Registration failed");
      },
    }
  );

  // ---- Login Mutation ----
  const loginMutation = useApiMutation<User, LoginData>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
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
      onError: (error: any) => {
        setError(error.message || "Login failed");
      },
    }
  );

  // return login as async function
  const login = async (values: LoginData) => {
    return await loginMutation.mutateAsync(values);
  };
  // ---- Logout Mutation ----
  const logoutMutation = useApiMutation<unknown, void>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    "POST",
    {
      requiresAuth: true,
      onSuccess: () => clearUser(),
      onError: (error: any) => {
        setError(error.message || "Logout failed");
        // Clear user anyway on logout error
        clearUser();
      },
    }
  );

  // ---- Resend Verification Email Mutation ----
  const resendVerificationMutation = useApiMutation<
    VerifyEmailResponse,
    ResendVerificationData
  >(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification-mail`,
    "POST",
    {
      requiresAuth: false,
      onSuccess: () => {
        setError(null);
      },
      onError: (error: any) => {
        setError(error.message || "Failed to resend verification email");
      },
    }
  );

  // ---- Sync Zustand with profile query ----
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
      resendVerificationMutation.isPending ||
      profileQuery.isLoading ||
      dashboardQuery.isLoading;

    setLoading(isLoading);
  }, [
    registerMutation.isPending,
    loginMutation.isPending,
    logoutMutation.isPending,
    resendVerificationMutation.isPending,
    profileQuery.isLoading,
    dashboardQuery.isLoading,
    setLoading,
  ]);

  // ---- Sync errors ----
  useEffect(() => {
    if (profileQuery.error) {
      setError("Failed to fetch profile");
    }
  }, [profileQuery.error, setError]);

  // ---- Helper function for email verification ----
  const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
    if (!token) {
      const error = "No verification token provided";
      setError(error);
      throw new Error(error);
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/auth/verify-email?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("Invalid or expired verification token");
        } else if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 400) {
          throw new Error("Invalid token format");
        } else if (response.status === 429) {
          throw new Error(
            "Too many verification attempts. Please wait a moment."
          );
        } else {
          throw new Error("Verification failed");
        }
      }

      const data: VerifyEmailResponse = await response.json();
      setError(null);

      // Refresh profile to get updated verification status
      await profileQuery.refetch();

      return data;
    } catch (error: any) {
      const errorMessage = error.message || "Email verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ---- Manual fetch functions ----
  const fetchProfile = async () => {
    try {
      setLoading(true);
      await profileQuery.refetch();
      return profileQuery.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      await dashboardQuery.refetch();
      return dashboardQuery.data;
    } catch (error) {
      throw error;
    }
  };

  // ---- Actions returned to components ----
  return {
    // Auth actions
    register: registerMutation.mutate,
    login: login,
    logout: () => logoutMutation.mutate(undefined),
    fetchProfile,
    fetchDashboard,

    // Email verification actions
    verifyEmail,
    resendVerification: resendVerificationMutation.mutate,

    // Loading states
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,
    isFetchingProfile: profileQuery.isLoading,
    isFetchingDashboard: dashboardQuery.isLoading,

    // Data and errors
    profileData: profileQuery.data,
    profileError: profileQuery.error,
    dashboardData: dashboardQuery.data,
    dashboardError: dashboardQuery.error,
  };
}
