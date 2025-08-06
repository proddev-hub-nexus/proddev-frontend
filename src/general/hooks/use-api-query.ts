import { useQuery, QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next/client";

export function useApiQuery<TData = unknown>({
  url,
  queryKey,
  enabled = true,
  requiresAuth = false,
}: {
  url: string;
  queryKey?: QueryKey;
  enabled?: boolean;
  requiresAuth?: boolean;
}) {
  return useQuery<TData>({
    queryKey: queryKey || [url],
    enabled,
    queryFn: async () => {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // 🔐 Add Bearer token from cookie if auth is required
        if (requiresAuth) {
          const access_token = getCookie("access_token");
          if (access_token) {
            headers.Authorization = `Bearer ${access_token}`;
            console.log(`🔐 Adding Bearer token to request: ${url}`);
          } else {
            console.warn(`⚠️ Auth required but no token found for: ${url}`);
          }
        }

        console.log(`📡 Making GET request to: ${url}`);
        const response = await axios.get<TData>(url, { headers });
        console.log(`✅ Request successful: ${url}`);

        return response.data;
      } catch (error) {
        console.error(`❌ Request failed: ${url}`, error);
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail ||
              error.response?.data?.message ||
              error.message
          );
        }
        throw error;
      }
    },
  });
}
