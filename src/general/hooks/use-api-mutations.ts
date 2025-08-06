import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import axios, { Method } from "axios";
import { getCookie, deleteCookie } from "cookies-next/client";

export function useApiMutation<TData = unknown, TVariables = unknown>(
  url: string,
  method: Method,
  options?: {
    requiresAuth?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (error: unknown) => void;
    invalidateKeys?: QueryKey;
    isLogout?: boolean;
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (options?.requiresAuth) {
          const access_token = getCookie("access_token");
          if (access_token) {
            headers.Authorization = `Bearer ${access_token}`;
          } else {
            console.warn(
              `⚠️ Auth required but no token found for mutation: ${url}`
            );
          }
        }

        const response = await axios.request<TData>({
          url,
          method,
          data: variables,
          headers,
        });

        if (options?.isLogout) {
          deleteCookie("access_token");
        }

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const apiMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message;

          throw new Error(apiMessage || `${method} request failed`);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          const queryKey = Array.isArray(key) ? key : [key];
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
