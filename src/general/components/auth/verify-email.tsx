"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { useAuthStore } from "@/general/store/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyEmail() {
  const { verifyEmail, resendVerification, fetchProfile } = useAuthActions();
  const { isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email address...");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [email, setEmail] = useState("");

  // Prevent multiple API calls
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    if (!token) {
      setMessage("No verification token found in the URL");
      setStatus("error");
      return;
    }

    hasVerified.current = true;

    verifyEmail(token)
      .then(async (response) => {
        console.log("✅ Verification success:", response);
        setMessage(response.message || "Email verified successfully!");
        setStatus("success");

        // 🔑 Attempt to immediately fetch the profile (ensures auth session is set)
        try {
          await fetchProfile();
          console.log("✅ Profile fetched successfully after verification");
        } catch (err) {
          console.warn("⚠️ Could not fetch profile immediately", err);
        }

        // Redirect to dashboard
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((error) => {
        console.log("❌ Verification error:", error.message);

        if (
          error.message?.includes("429") ||
          error.message?.toLowerCase().includes("rate limit")
        ) {
          setMessage(
            "Too many verification attempts. Please wait a moment before trying again."
          );
        } else {
          setMessage(
            error.message ||
              "Verification failed. The link may be expired or invalid."
          );
        }
        setStatus("error");
        hasVerified.current = false;
      });
  }, [token, verifyEmail, fetchProfile, router]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address to resend verification.");
      return;
    }
    try {
      await resendVerification({ email });
      setMessage("Verification email sent! Please check your inbox.");
      setStatus("success");
    } catch (error: any) {
      if (
        error.message?.includes("429") ||
        error.message?.toLowerCase().includes("rate limit")
      ) {
        setMessage(
          "Too many email requests. Please wait a moment before trying again."
        );
      } else {
        setMessage(error.message || "Failed to resend verification email.");
      }
    }
  };

  const handleRetryVerification = () => {
    if (!token) return;
    hasVerified.current = false;
    setStatus("loading");
    setMessage("Verifying your email address...");
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-2">
            {status === "loading" && (
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <div className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              </div>
            )}
            {status === "success" && (
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center border border-green-500/30">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/30">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl font-bold text-slate-100">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-6 text-center space-y-6">
          <p className="text-slate-300 leading-relaxed">{message}</p>

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full"></div>
                <span>Redirecting to dashboard...</span>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-sm text-slate-300 mb-3">
                  Need a new verification link?
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleResendVerification}
                    disabled={isLoading || !email}
                    variant="outline"
                    size="sm"
                    className="px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => router.push("/account")}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
                  Back to Sign In
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="ghost"
                  className="w-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <Button
              onClick={() => router.push("/account")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            >
              Back to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
