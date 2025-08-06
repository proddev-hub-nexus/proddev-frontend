import { useState } from "react";
import { ArrowRight, Users, Zap } from "lucide-react";

export default function OnboardingWelcome() {
  const [userType, setUserType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
        {!userType ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-100">
                Welcome to Our Platform
              </h1>
              <p className="text-slate-400">Get started in just a few steps</p>
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
                Join thousands of users already using our platform
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
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
              <h2 className="text-2xl font-bold text-slate-100">
                Welcome Back
              </h2>
              <p className="text-slate-400">
                Sign in to continue where you left off
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In
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
    </div>
  );
}
