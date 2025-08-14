"use client";
import React, { useState } from "react";
import { initOnboardingSession } from "../../utils/util";
import { useOnboardingStore } from "../store/onboarding-store";

// Why: store expects a session_id; we treat it as a non-secret opaque ID for client state/analytics only.
export default function WelcomeStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCurrentStep, initSession } = useOnboardingStore();

  type InitResp = { success: boolean; session_id?: string; error?: string };

  const handleGetStarted = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = (await initOnboardingSession()) as InitResp | undefined;
      if (!result?.success) {
        setError(result?.error || "Unable to start onboarding");
        return;
      }

      // Must have session_id when success === true
      if (!result.session_id) {
        setError("Session started but no session_id returned.");
        return;
      }

      // Keep the ID in-memory store (not persistent) for UI/analytics/debug.
      try {
        initSession?.(result.session_id);
      } catch {
        /* no-op if initSession signature differs */
      }

      setCurrentStep("personal_info");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start onboarding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-white">
      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-3 text-sm">
              {error}
            </div>
          )}

          {/* Header Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome to EduPlatform
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto">
              Let us personalize your learning journey. We will help you set up
              your profile and find the perfect courses for your goals.
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-slate-50 rounded-xl p-5 sm:p-6 space-y-4 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
              What we will set up together:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Personal info
                  </div>
                  <div className="text-sm text-slate-600">
                    Tell us about your background
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Learning goals
                  </div>
                  <div className="text-sm text-slate-600">
                    Set outcomes and pace
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Course interests
                  </div>
                  <div className="text-sm text-slate-600">
                    Pick topics you like
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    Recommendations
                  </div>
                  <div className="text-sm text-slate-600">
                    Get a tailored path
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-slate-200 p-4 sm:p-6 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-white font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting...
              </span>
            ) : (
              <span className="inline-flex items-center">
                Get started
                <svg
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
