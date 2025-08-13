import { ArrowRight, Zap, Users, Trophy, BookOpen } from "lucide-react";
import { Button } from "@/general/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
          <Zap className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-100">
          Welcome to ProdDev Hub
        </h1>
        <p className="text-xl text-slate-300 max-w-lg mx-auto">
          Transform your career with expert-led courses and personalized
          learning paths
        </p>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-slate-200">15,000+ Students</h3>
          <p className="text-sm text-slate-400">Join our thriving community</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-semibold text-slate-200">Industry Certified</h3>
          <p className="text-sm text-slate-400">Recognized credentials</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-slate-200">Expert Instructors</h3>
          <p className="text-sm text-slate-400">Learn from the best</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-slate-400">
          We will help you find the perfect courses to achieve your goals.
          <br />
          This takes just 2 minutes.
        </p>

        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs text-slate-500">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}
