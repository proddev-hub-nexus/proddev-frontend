"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Zap } from "lucide-react";

export default function OnboardingWelcome() {
  const [userType, setUserType] = useState<"new" | "returning" | null>(null);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/register");
  };

  const handleSignIn = () => {
    router.push("/onboarding/signin");
  };

  return (
    <div className="w-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
      {!userType ? (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-100">
              Welcome to ProdDev Hub
            </h1>
            <p className="text-slate-400">
              Your professional development journey starts here
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setUserType("new")}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              I&apos;m new here
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setUserType("returning")}
              className="w-full h-12 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-100 font-medium rounded-lg transition-all duration-200 flex items-center justify-center group"
            >
              I have an account
              <Users className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Join thousands of professionals advancing their careers
          </div>
        </div>
      ) : userType === "new" ? (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              Create Your Account
            </h2>
            <p className="text-slate-400">
              Join thousands of professionals already using our platform
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGetStarted}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setUserType(null)}
              className="w-full h-10 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              ← Back to options
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
            <p className="text-slate-400">
              Sign in to continue your professional development journey
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setUserType(null)}
              className="w-full h-10 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              ← Back to options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
