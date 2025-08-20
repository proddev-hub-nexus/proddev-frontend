"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/general/components/ui/card";
import { SignInForm } from "./sign-in";

const Account = () => {
  const [userType, setUserType] = useState<"new" | "returning" | null>(null);
  const router = useRouter();

  const handleGetStarted = () => {
    // Go directly to onboarding for registration
    router.push("/onboarding");
  };

  const resetToWelcome = () => setUserType(null);

  // Welcome Screen (First view)
  if (!userType) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
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
              Get Started
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
      </div>
    );
  }

  if (userType === "new") {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              Let&apos;s Get You Started
            </h2>
            <p className="text-slate-400">
              We&apos;ll guide you through a quick setup to personalize your
              experience
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGetStarted}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
            >
              Start Setup
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={resetToWelcome}
              className="w-full h-10 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              ← Back to options
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Returning user - show sign in form
  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-xl rounded-2xl">
      <CardHeader className="text-center space-y-3 pb-5">
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl tracking-wide">P</span>
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-slate-400 text-sm">
          Sign in to continue your learning journey
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-100">
              Sign in to your account
            </h3>
            <p className="text-sm text-slate-400">
              Continue where you left off
            </p>
          </div>
          <SignInForm />
          <button
            onClick={resetToWelcome}
            className="w-full h-10 text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            ← Back to options
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;
