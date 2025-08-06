import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { VerifyEmailResponse } from "../types/auth-types";
import { useAuthStore } from "../store/auth-store";
import { setCookie } from "cookies-next/client";

export function useVerifyEmailMutation(token: string) {
  return useMutation<VerifyEmailResponse, AxiosError>({
    mutationFn: async () => {
      const response = await axios.get<VerifyEmailResponse>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/auth/verify-email?token=${encodeURIComponent(token)}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.token_id || !data.access_token) {
        console.error("Missing required verification data");
        return;
      }

      const expiryRaw = data.token_expires_in;
      let expiryDate = new Date(expiryRaw);

      if (!expiryRaw || isNaN(expiryDate.getTime())) {
        expiryDate = new Date(Date.now() + 60 * 60 * 1000); // fallback to 1 hour
      }

      useAuthStore.getState().setAuth({
        token_id: data.token_id,
        access_token: data.access_token,
        token_expires_in: expiryDate,
        device: data.device,
      });

      setCookie("access_token", data.access_token, {
        expires: expiryDate,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    },
  });
}
