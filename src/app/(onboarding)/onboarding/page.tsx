"use client";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { RegisterPayload } from "@/general/types/auth-types";
import { useOnboardingStore } from "./store/onboarding-store";
import ProgressBar from "@/general/components/progress-bar";
import WelcomeStep from "./steps/welcome-step";
import PersonalInfoStep from "./steps/personal-info-step";
import LearningGoalsStep from "./steps/learning-goal-step";
import CourseInterestsStep from "./steps/course-interests-step";
import CompletionStep from "./steps/completion-step";
import { OnboardingStep } from "./types/onboarding";
import { deleteCookie } from "cookies-next/client";

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store
  const {
    current_step,
    personal_info,
    learning_goal,
    time_commitment,
    interested_course_ids,
    legal_terms,
    getAllData,
    reset,
    isStepComplete,
  } = useOnboardingStore();

  // Auth actions for registration
  const { register } = useAuthActions();

  // Get current step index for progress bar
  const steps: OnboardingStep[] = [
    "welcome",
    "personal_info",
    "learning_goal",
    "course_interest",
    "completion",
  ];
  const currentStepIndex = steps.indexOf(current_step);

  // Final registration handler
  const handleComplete = useCallback(
    async (password: string) => {
      const id = toast.loading("Creating your account…", {
        description:
          "Finalizing your registration and setting up your profile.",
        duration: Infinity,
      });

      try {
        setLoading(true);
        setError(null);

        // Get all collected data
        const allData = getAllData();

        // Validate we have required data
        if (!personal_info?.full_name || !personal_info?.email) {
          throw new Error(
            "Missing personal information. Please go back and complete all steps."
          );
        }

        // Create registration payload
        const payload: RegisterPayload = {
          full_name: personal_info.full_name,
          email: personal_info.email,
          password: password,
        };

        console.log("Registering with complete data:", {
          registration: payload,
          onboardingData: allData,
        });

        // Register the user
        await register(payload);

        // Clear onboarding data since we're done
        reset();
        deleteCookie("__Host-onboarding_session");
        deleteCookie("onboarding-storage");

        // Show success message
        toast.success("Account created successfully!", {
          id,
          description:
            "Please check your email to verify your account before signing in.",
          duration: Infinity,
          closeButton: true,
          action: {
            label: "Open Email",
            onClick: () => window.open("mailto:", "_blank"),
          },
        });

        // Optional: Redirect after a delay
        setTimeout(() => {
          window.location.href =
            "/account?message=Please verify your email to continue";
        }, 3000);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";

        toast.error(
          errorMessage.includes("already registered")
            ? "This email is already registered. Please sign in instead."
            : errorMessage,
          {
            id,
            duration: Infinity,
            closeButton: true,
            action: {
              label: "Try Again",
              onClick: () => handleComplete(password),
            },
          }
        );

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAllData, personal_info, register, reset]
  );

  // Define step components (now self-contained)
  const stepComponents = {
    welcome: <WelcomeStep />,
    personal_info: <PersonalInfoStep />,
    learning_goal: <LearningGoalsStep />,
    course_interest: <CourseInterestsStep />,
    completion: <CompletionStep onComplete={handleComplete} />,
  };

  // Force rehydration on client side
  useEffect(() => {
    useOnboardingStore.persist.rehydrate();
  }, []);

  // Create items array for progress bar
  const progressItems = steps.map((step) => ({ step_name: step }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="onboarding-container w-full h-full flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Section */}
        <section className="w-full max-w-4xl mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-slate-900">
                  Setup Progress
                </h2>
                <p className="text-sm text-slate-500">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
              <div className="text-sm text-slate-500">
                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                Complete
              </div>
            </div>

            <ProgressBar
              variant="segmented"
              currentIndex={currentStepIndex}
              items={progressItems}
              activeColor="bg-slate-900"
              completedColor="bg-slate-700"
              defaultColor="bg-slate-200"
            />

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-slate-100 rounded text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Current Step:</strong> {current_step} (index:{" "}
                  {currentStepIndex})
                </div>
                <div>
                  <strong>Data Status:</strong>
                </div>
                <div className="ml-2">
                  Personal Info: {personal_info ? "✅" : "❌"} (
                  {personal_info?.full_name}, {personal_info?.email})
                </div>
                <div className="ml-2">
                  Learning Goal: {learning_goal ? "✅" : "❌"} ({learning_goal})
                </div>
                <div className="ml-2">
                  Time Commitment: {time_commitment ? "✅" : "❌"} (
                  {time_commitment})
                </div>
                <div className="ml-2">
                  Courses: {interested_course_ids.length > 0 ? "✅" : "❌"} (
                  {interested_course_ids.length} selected)
                </div>
                <div className="ml-2">
                  Legal Terms: {legal_terms?.terms_accepted ? "✅" : "❌"}
                </div>
                <div>
                  <strong>Step Completion:</strong>{" "}
                  {steps
                    .map(
                      (step) => `${step}: ${isStepComplete(step) ? "✅" : "❌"}`
                    )
                    .join(", ")}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-1 flex items-center justify-center w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full overflow-hidden">
            {stepComponents[current_step] || (
              <div className="text-center py-8 px-4">
                <p className="text-slate-500">Step not found: {current_step}</p>
              </div>
            )}
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <section className="w-full max-w-4xl mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5"
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
                    Something went wrong
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-red-600 hover:text-red-800 mt-2 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="w-full max-w-4xl mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>
              Need help?{" "}
              <a
                href="#"
                className="text-slate-700 hover:text-slate-900 underline"
              >
                Contact support
              </a>
            </div>
            <div>© 2024 EduPlatform. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
