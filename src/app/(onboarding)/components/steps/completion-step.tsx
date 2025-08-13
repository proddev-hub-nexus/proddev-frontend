"use client";

import { useState } from "react";
import { OnboardingData } from "../../onboarding/types/onboarding";
import { Button } from "@/general/components/ui/button";
import { ArrowLeft, CheckCircle, Mail, Loader2 } from "lucide-react";
import { useAuthActions } from "@/general/hooks/use-auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CompletionStepProps {
  data: OnboardingData;
  onBack: () => void;
}

export default function CompletionStep({ data, onBack }: CompletionStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthActions();
  const router = useRouter();

  const handleCompleteOnboarding = async () => {
    const toastId = toast.loading("Creating your account...", {
      description: "Setting up your personalized learning experience",
      duration: Infinity,
    });

    try {
      setIsLoading(true);

      // Register user with complete onboarding data
      await register({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        // Additional onboarding data
        current_role: data.current_role,
        experience_level: data.experience_level,
        industry: data.industry,
        primary_goal: data.primary_goal,
        time_commitment: data.time_commitment,
        interested_courses: data.interested_courses,
        has_completed_onboarding: true,
      });

      toast.success("Welcome to ProdDev Hub! 🎉", {
        id: toastId,
        description: "Check your email to verify your account and get started.",
        duration: Infinity,
        closeButton: true,
        action: {
          label: "Open Email",
          onClick: () => window.open("mailto:", "_blank"),
        },
      });

      // Redirect to email verification or dashboard
      router.push("/verify-email");
    } catch (error: any) {
      toast.error("Registration failed", {
        id: toastId,
        description: error.message || "Please try again or contact support.",
        duration: 5000,
        action: {
          label: "Retry",
          onClick: handleCompleteOnboarding,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">
          You're All Set, {data.full_name?.split(" ")[0]}!
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          We've personalized your learning experience based on your preferences.
          Ready to start your professional development journey?
        </p>
      </div>

      {/* Summary */}
      <div className="bg-slate-700/20 rounded-lg p-4 space-y-2 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-slate-200 text-sm">
          Your Profile Summary:
        </h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• Goal: {data.primary_goal?.replace("_", " ")}</li>
          <li>• Experience: {data.experience_level}</li>
          <li>
            • Time commitment: {data.time_commitment?.replace("_", "-")} per
            week
          </li>
          <li>• Interested in {data.interested_courses?.length} courses</li>
        </ul>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleCompleteOnboarding}
          disabled={isLoading}
          size="lg"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              Complete Registration
            </>
          )}
        </Button>

        <Button
          onClick={onBack}
          variant="ghost"
          disabled={isLoading}
          className="w-full text-slate-400 hover:text-slate-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course Selection
        </Button>
      </div>

      <p className="text-xs text-slate-500">
        By completing registration, you agree to our Terms of Service and
        Privacy Policy
      </p>
    </div>
  );
}
