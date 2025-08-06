import { Suspense } from "react";
import { SignInForm } from "@/general/components/auth/sign-in";

// Loading component that matches your onboarding theme
function OnboardingSignInLoading() {
  return (
    <div className="w-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full" />
        <h2 className="text-xl font-semibold text-slate-100">Loading...</h2>
        <p className="text-slate-400">Preparing sign in form</p>
      </div>
    </div>
  );
}

export default function OnboardingSignIn() {
  return (
    <Suspense fallback={<OnboardingSignInLoading />}>
      <div className="w-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-slate-400">
            Sign in to continue your professional development journey
          </p>
        </div>

        {/* Your existing SignIn form */}
        <SignInForm />
      </div>
    </Suspense>
  );
}
