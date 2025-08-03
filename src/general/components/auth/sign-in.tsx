"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthActions } from "../../hooks/use-auth-actions";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export function SignInForm() {
  const { login } = useAuthActions();
  const { isLoading } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await login(values);
      // Only redirect if login was successful (user is verified)
      toast.success("Welcome back! Redirecting to your dashboard...");
      form.reset();
      setTimeout(() => router.push("/dashboard"), 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.message?.includes("verification") ||
        error.message?.includes("Email not verified")
      ) {
        // Backend already sent verification email
        toast.info(
          "Please check your email and click the verification link to complete your login."
        );
      } else if (error.message?.includes("Invalid")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 text-slate-300">
            <input
              type="checkbox"
              className="rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
            />
            <span>Remember me</span>
          </label>
          <a
            href="/forgot-password"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>

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

        <div className="text-center text-sm text-slate-300">
          Don&apos;t have an account?{" "}
          <span className="text-blue-400 font-medium">
            Click &quot;Create Account&quot; above
          </span>
        </div>
      </form>
    </Form>
  );
}
