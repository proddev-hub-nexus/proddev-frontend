"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useApiQuery<TData = unknown>({
  url,
  requiresAuth = false,
  enabled = true,
  params = {},
  initialData,
}: {
  url: string;
  requiresAuth?: boolean;
  enabled?: boolean;
  params?: Record<string, unknown>;
  initialData?: TData;
}) {
  if (!url) {
    throw new Error("API URL is missing");
  }

  const fetchData = async (): Promise<TData> => {
    const response = await axios.get<TData>(url, {
      params,
      withCredentials: requiresAuth,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.data;
  };

  return useQuery<TData>({
    queryKey: ["fetch", url, params, requiresAuth],
    queryFn: fetchData,
    initialData,
    enabled: enabled && !!url,
  });
}
