"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthActions } from "../../hooks/use-auth-actions";
import { useAuthStore } from "../../store/auth-store";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { RegisterPayload } from "@/general/types/auth-types";
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
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AxiosError } from "axios";

const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const { register } = useAuthActions();
  const { isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const payload: RegisterPayload = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      };
      await register(payload);
      toast.success(
        "Account created! Please check your email for verification."
      );
      form.reset();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string; detail?: string }>;
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Registration failed. Please try again.";

      if (message.includes("already registered")) {
        toast.error(
          "This email is already registered. Please sign in instead."
        );
      } else {
        toast.error(message);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Enter your full name"
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

              <Button
                type="button"
                onClick={async () => {
                  const valid = await form.trigger(["full_name", "email"]);
                  if (valid) setStep(2);
                }}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
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
                          placeholder="Create a strong password"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 h-11 bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:bg-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {showConfirmPassword ? (
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

              <div className="text-xs text-slate-300 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• One uppercase and one lowercase letter</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-start space-x-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <span>
                          I agree to the{" "}
                          <a
                            href="/terms"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex justify-between space-x-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                >
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
                      Creating...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-sm text-slate-300 mt-4">
          Already have an account?{" "}
          <span className="text-blue-400 font-medium">
            Click &quot;Sign In&quot; above
          </span>
        </div>
      </form>
    </Form>
  );
}
