"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateOnboardingStep } from "../../utils/util";
import { useOnboardingStore } from "../store/onboarding-store";

// Validation schema for learning goals
const learningGoalSchema = z.object({
  learning_goal: z.enum(
    [
      "career_change",
      "skill_upgrade",
      "promotion",
      "side_business",
      "personal_growth",
    ],
    {
      message: "Please select a learning goal",
    }
  ),
  time_commitment: z.enum(
    ["1-3_hours", "4-6_hours", "7-10_hours", "10+_hours"],
    {
      message: "Please select your time commitment",
    }
  ),
});

type LearningGoalForm = z.infer<typeof learningGoalSchema>;

const learningGoalOptions = [
  {
    value: "career_change" as const,
    label: "Career Change",
    description: "Switch to a new field or industry",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    selectedBorder: "border-orange-500",
    selectedBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    value: "skill_upgrade" as const,
    label: "Skill Upgrade",
    description: "Enhance existing skills and knowledge",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBorder: "border-blue-500",
    selectedBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "promotion" as const,
    label: "Career Promotion",
    description: "Advance in your current role",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 11l5-5m0 0l5 5m-5-5v12"
        />
      </svg>
    ),
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    selectedBorder: "border-green-500",
    selectedBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    value: "side_business" as const,
    label: "Side Business",
    description: "Start or grow a side project",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
        />
      </svg>
    ),
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    selectedBorder: "border-purple-500",
    selectedBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    value: "personal_growth" as const,
    label: "Personal Growth",
    description: "Learn for personal satisfaction",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    selectedBorder: "border-teal-500",
    selectedBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const timeCommitmentOptions = [
  {
    value: "1-3_hours" as const,
    label: "1-3 hours per week",
    description: "Light commitment, flexible schedule",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: "4-6_hours" as const,
    label: "4-6 hours per week",
    description: "Moderate commitment, steady progress",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: "7-10_hours" as const,
    label: "7-10 hours per week",
    description: "High commitment, faster results",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: "10+_hours" as const,
    label: "10+ hours per week",
    description: "Intensive learning, rapid progress",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function LearningGoalsStep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Zustand store directly
  const {
    learning_goal,
    time_commitment,
    setLearningGoal,
    setTimeCommitment,
    setCurrentStep,
  } = useOnboardingStore();

  const form = useForm<LearningGoalForm>({
    resolver: zodResolver(learningGoalSchema),
    defaultValues: {
      learning_goal: learning_goal,
      time_commitment: time_commitment,
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: LearningGoalForm) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Saving learning goals:", formData);

      // Update Zustand store (automatically persisted to cookies)
      setLearningGoal(formData.learning_goal);
      setTimeCommitment(formData.time_commitment);

      // Send to backend
      await updateOnboardingStep({
        step_name: "learning_goal",
        step_data: formData,
      });

      console.log("Learning goals saved successfully");

      // Navigate to next step using Zustand
      setCurrentStep("course_interest");
    } catch (err) {
      console.error("Failed to save learning goals:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save learning goals"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("personal_info");
  };

  return (
    <div className="w-full min-h-[100dvh] sm:min-h-0 flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-xl md:max-w-2xl mx-auto space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 mx-auto shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Learning Goals & Time
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
              Help us personalize your experience by sharing your goals and
              availability
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-8 sm:space-y-10">
            {/* Learning Goals Section */}
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  What is your primary learning goal?
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  This helps us recommend the most relevant courses for you
                </p>
              </div>

              <div className="space-y-4">
                {learningGoalOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-4 sm:p-5 border-2 rounded-2xl cursor-pointer 
                               transition-all duration-300 motion-reduce:transition-none select-none
                               hover:shadow-md hover:-translate-y-0.5
                               focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
                               active:scale-[.99]
                               ${
                                 form.watch("learning_goal") === option.value
                                   ? `${option.selectedBorder} ${option.selectedBg} shadow-lg ring-2 ring-${option.selectedBorder.split("-")[1]}-500/20`
                                   : `${option.borderColor} bg-white hover:${option.bgColor}`
                               }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...form.register("learning_goal")}
                    />

                    <div className="flex items-start gap-4 w-full">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${option.bgColor} ${option.iconColor} shrink-0`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-base sm:text-lg">
                              {option.label}
                            </h4>
                            <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                          {form.watch("learning_goal") === option.value && (
                            <div
                              className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${option.color} shrink-0`}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {form.formState.errors.learning_goal && (
                <p className="text-sm text-red-600 mt-3 px-1 font-medium">
                  {form.formState.errors.learning_goal.message}
                </p>
              )}
            </div>

            {/* Time Commitment Section */}
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  How much time can you commit per week?
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  This helps us suggest a learning pace that works for you
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {timeCommitmentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-4 sm:p-5 border-2 rounded-2xl cursor-pointer 
                               transition-all duration-300 motion-reduce:transition-none select-none
                               hover:shadow-md hover:-translate-y-0.5
                               focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
                               active:scale-[.99]
                               ${
                                 form.watch("time_commitment") === option.value
                                   ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-500/20"
                                   : "border-slate-200 bg-white hover:bg-slate-50"
                               }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...form.register("time_commitment")}
                    />

                    <div className="flex items-start gap-3 w-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                          form.watch("time_commitment") === option.value
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                              {option.label}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                          {form.watch("time_commitment") === option.value && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shrink-0">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {form.formState.errors.time_commitment && (
                <p className="text-sm text-red-600 mt-3 px-1 font-medium">
                  {form.formState.errors.time_commitment.message}
                </p>
              )}
            </div>

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" &&
              (learning_goal || time_commitment) && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-xs">
                  <strong>Stored Data:</strong> Learning Goal: {learning_goal},
                  Time: {time_commitment}
                </div>
              )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 shrink-0">
                    <svg
                      className="w-5 h-5 text-red-600"
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
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-red-900">
                      Unable to save preferences
                    </h3>
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 border-t border-slate-200 p-4 sm:p-6 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-xl md:max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-slate-300 rounded-xl
                         text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400
                         transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
                         focus-visible:ring-slate-500 focus-visible:ring-offset-2 order-2 sm:order-1 touch-manipulation
                         hover:shadow-md active:scale-[.98]"
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
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 
                         text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                         transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                         min-w-[140px] order-1 sm:order-2 touch-manipulation active:scale-[.98]"
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
