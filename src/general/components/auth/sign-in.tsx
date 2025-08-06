"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../store/auth-store";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/general/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/general/components/ui/form";
import { Input } from "@/general/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInForm() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're in the onboarding flow
  const isOnboarding = pathname?.startsWith("/onboarding");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleBack = () => {
    if (isOnboarding) {
      router.push("/onboarding");
    } else {
      router.back();
    }
  };

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      setIsLoading(true);

      // Call the Next.js API route
      const response = await axios.post("/api/login", {
        email: values.email,
        password: values.password,
      });

      const loginData = response.data.data;

      if (!loginData) {
        toast.error("Login failed. Please try again.");
        return;
      }

      const auth = {
        token_id: loginData.token_id,
        access_token: loginData.access_token,
        device: loginData.device || "desktop",
        token_expires_in: new Date(loginData.token_expires_in),
      };

      setAuth(auth);
      toast.success(isOnboarding ? "Welcome back!" : "Login successful!");

      const redirectTo = searchParams?.get("redirect") || "/dashboard";
      router.push(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.error;
        toast.error(message || "Login failed. Please try again.");
      } else {
        toast.error("Unexpected error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-200">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:bg-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-200">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:bg-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        {/* Forgot Password Link */}
        {!isOnboarding && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Submit Button - Different layouts for onboarding vs regular */}
        {isOnboarding ? (
          <div className="flex justify-between space-x-3 pt-2">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-11 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        )}

        {/* Footer Text */}
        <div className="text-center text-sm text-slate-300 mt-4">
          {isOnboarding ? (
            <>
              New to ProdDev Hub?{" "}
              <button
                type="button"
                onClick={() => router.push("/onboarding/register")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <span className="text-blue-400 font-medium">
                Click &quot;Sign Up&quot; above
              </span>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
