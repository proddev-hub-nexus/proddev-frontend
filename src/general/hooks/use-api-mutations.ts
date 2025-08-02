import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import axios, { Method } from "axios";

/**
 * General API Mutation Hook
 *
 * @template TData - Type of API response
 * @template TVariables - Type of request body (payload)
 *
 * @param url - API endpoint
 * @param method - HTTP method (POST, PUT, PATCH, DELETE)
 * @param options - Config (auth, cache invalidation, callbacks)
 *
 * Example:
 *   const mutation = useApiMutation<UserResponse, CreateUserBody>(
 *     '/api/users', 'POST',
 *     { invalidateKeys: [['fetch', '/api/users']] }
 *   );
 *   mutation.mutate({ name: 'John', email: 'john@example.com' });
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  url: string,
  method: Method,
  options?: {
    requiresAuth?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (error: unknown) => void;
    invalidateKeys?: QueryKey;
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, unknown, TVariables>({
    // variables = payload sent to the API
    mutationFn: async (variables: TVariables) => {
      try {
        const response = await axios.request<TData>({
          url,
          method,
          data: variables,
          withCredentials: options?.requiresAuth ?? false,
        });
        return response.data;
      } catch (error) {
        // Enhanced error handling
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              error.message ||
              `${method} request failed`
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate cache keys
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          // Handle both string and array query keys
          const queryKey = Array.isArray(key) ? key : [key];
          queryClient.invalidateQueries({ queryKey });
        });
      }
      // Pass the response data to the success callback
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
