"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateOnboardingStep } from "../../utils/util";
import { useOnboardingStore } from "../store/onboarding-store";

// Validation schema for completion step
const completionSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CompletionForm = z.infer<typeof completionSchema>;

interface CompletionStepProps {
  onComplete: (password: string) => void;
}

export default function CompletionStep({ onComplete }: CompletionStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use Zustand store directly
  const {
    personal_info,
    learning_goal,
    time_commitment,
    interested_course_ids,
    legal_terms,
    setLegalTerms,
    setCurrentStep,
    getAllData,
  } = useOnboardingStore();

  const form = useForm<CompletionForm>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      terms_accepted: legal_terms?.terms_accepted || false,
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: CompletionForm) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Completing onboarding setup...");

      // First, save legal terms to onboarding backend
      const legalTermsData = {
        terms_accepted: formData.terms_accepted,
        accepted_at: new Date().toISOString(),
        terms_version: "1.0",
      };

      // Update Zustand store (automatically persisted to cookies)
      setLegalTerms(legalTermsData);

      // Send legal terms to onboarding backend
      await updateOnboardingStep({
        step_name: "completion",
        step_data: legalTermsData,
      });

      console.log("Legal terms saved, triggering final registration...");

      // Now trigger the final registration with password
      onComplete(formData.password);
    } catch (err) {
      console.error("Failed to complete setup:", err);
      setError(err instanceof Error ? err.message : "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("course_interest");
  };

  return (
    <div className="w-full h-full min-h-screen sm:min-h-0 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Complete Your Account
            </h1>

            <p className="text-sm sm:text-base text-slate-600 px-2">
              You are almost done! Just set up your password and review your
              information.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 mb-3">
              Account Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-slate-600">Name</dt>
                <dd className="text-slate-900">
                  {personal_info?.full_name || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-600">Email</dt>
                <dd className="text-slate-900">
                  {personal_info?.email || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-600">Learning Goal</dt>
                <dd className="text-slate-900 capitalize">
                  {learning_goal?.replace("_", " ") || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-600">Time Commitment</dt>
                <dd className="text-slate-900">
                  {time_commitment?.replace("_", " ") || "Not specified"}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="font-medium text-slate-600">Selected Courses</dt>
                <dd className="text-slate-900">
                  {interested_course_ids.length} course
                  {interested_course_ids.length !== 1 ? "s" : ""} selected
                </dd>
              </div>
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                <strong>Complete Data:</strong>
                <pre className="mt-1 whitespace-pre-wrap">
                  {JSON.stringify(getAllData(), null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Create Your Password
              </h3>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                               placeholder-slate-400 text-slate-900 transition-colors"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                               placeholder-slate-400 text-slate-900 transition-colors"
                    {...form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Password requirements:
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex items-center">
                    <svg
                      className="w-3 h-3 text-slate-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-3 h-3 text-slate-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    One uppercase and one lowercase letter
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-3 h-3 text-slate-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    At least one number
                  </li>
                </ul>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Terms & Conditions
              </h3>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    {...form.register("terms_accepted")}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-slate-700 leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-slate-900 font-medium hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-slate-900 font-medium hover:underline"
                    >
                      Privacy Policy
                    </a>
                    . I understand that by creating an account, I will receive
                    course updates and platform notifications via email.
                  </label>
                </div>

                {form.formState.errors.terms_accepted && (
                  <p className="text-sm text-red-600 ml-6">
                    {form.formState.errors.terms_accepted.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Unable to complete registration
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center px-4 sm:px-6 py-3 border border-slate-300 rounded-lg
                         text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400
                         transition-colors duration-200 focus:outline-none focus:ring-2 
                         focus:ring-slate-500 focus:ring-offset-2 order-2 sm:order-1"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || !form.formState.isValid}
              className="flex items-center justify-center px-6 sm:px-8 py-3 bg-emerald-600 hover:bg-emerald-700 
                         disabled:bg-slate-400 text-white font-semibold rounded-lg 
                         transition-colors duration-200 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                         min-w-[160px] order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
