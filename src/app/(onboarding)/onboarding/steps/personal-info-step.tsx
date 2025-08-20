"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateOnboardingStep } from "../../utils/util";
import { useOnboardingStore } from "../store/onboarding-store";

// Validation schema matching your existing signup validation
const personalInfoSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.email("Please enter a valid email address"),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Zustand store directly
  const { personal_info, setPersonalInfo, setCurrentStep } =
    useOnboardingStore();

  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: personal_info?.full_name || "",
      email: personal_info?.email || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: PersonalInfoForm) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Saving personal info:", formData);

      // Update Zustand store (automatically persisted to cookies)
      setPersonalInfo(formData);

      // Send to backend
      await updateOnboardingStep({
        step_name: "personal_info",
        step_data: formData,
      });

      console.log("Personal info saved successfully");

      // Navigate to next step using Zustand
      setCurrentStep("learning_goal");
    } catch (err) {
      console.error("Failed to save personal info:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save personal information"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("welcome");
  };

  return (
    <div className="w-full h-full min-h-screen sm:min-h-0 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Personal Information
            </h1>

            <p className="text-sm sm:text-base text-slate-600 px-2">
              Let us start with some basic information about you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                             placeholder-slate-400 text-slate-900 transition-colors"
                  {...form.register("full_name")}
                />
              </div>
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                             placeholder-slate-400 text-slate-900 transition-colors"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-1">Why do we need this?</p>
                  <p>
                    We will use your email to send course updates and your
                    account information. Your full name will appear on
                    certificates and in your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && personal_info && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <strong>Stored Data:</strong>{" "}
                {JSON.stringify(personal_info, null, 2)}
              </div>
            )}

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
                      Unable to save information
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
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:space-x-4">
            <button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || !form.formState.isValid}
              className="flex items-center justify-center px-4 sm:px-6 py-3 bg-slate-900 hover:bg-slate-800 
                         disabled:bg-slate-400 text-white font-medium rounded-lg 
                         transition-colors duration-200 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                         min-w-[120px] order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                  Saving...
                </>
              ) : (
                <>
                  Continue
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
                      d="M9 5l7 7-7 7"
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
