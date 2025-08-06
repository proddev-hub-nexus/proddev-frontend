"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/general/hooks/use-verify-email";
import {
  VerifyEmailResponse,
  ApiErrorResponse,
} from "@/general/types/auth-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function VerifyEmail() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const verifyEmailMutation = useVerifyEmailMutation(token);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email address...");

  const handleVerificationSuccess = (data: VerifyEmailResponse) => {
    setStatus("success");
    setMessage(data.message || "Email verified successfully!");
    toast.success("Your account is now verified! Please sign in.");
    setTimeout(() => router.replace("/account"), 1500);
  };

  const handleVerificationError = (error: unknown) => {
    console.error("Email verification error:", error);
    setStatus("error");

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      setMessage(
        errorData?.detail || errorData?.message || "Email verification failed."
      );
    } else if (error instanceof Error) {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred during verification.");
    }

    toast.error("Email verification failed");
  };

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email.");
      return;
    }

    verifyEmailMutation.mutate(undefined, {
      onSuccess: handleVerificationSuccess,
      onError: handleVerificationError,
    });
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-800 text-white">
        <CardHeader className="text-center">
          {status === "loading" && (
            <div className="animate-spin h-6 w-6 mx-auto border-2 border-white border-t-transparent rounded-full mb-2" />
          )}
          {status === "success" && (
            <CheckCircle className="h-6 w-6 mx-auto text-green-400 mb-2" />
          )}
          {status === "error" && (
            <XCircle className="h-6 w-6 mx-auto text-red-400 mb-2" />
          )}
          <CardTitle className="text-lg">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-300">{message}</p>
          {status === "success" && (
            <Button
              onClick={() => router.replace("/account")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {status === "error" && (
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/account")}
                variant="ghost"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
