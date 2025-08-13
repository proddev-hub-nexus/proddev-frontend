"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingData } from "../../onboarding/types/onboarding";
import WelcomeStep from "./welcome-step";
import PersonalInfoStep from "./personal-info-step";
import ProfessionalBackgroundStep from "./professional-goal-step";
import LearningGoalsStep from "./learning-goal-step";
import CourseInterestsStep from "./course-interests-step";
import CompletionStep from "./completion-step";

const TOTAL_STEPS = 6;

export default function OnboardingContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {
      interested_courses: [],
    }
  );

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
    <PersonalInfoStep
      key="personal"
      data={onboardingData}
      updateData={updateOnboardingData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <ProfessionalBackgroundStep
      key="professional"
      data={onboardingData}
      updateData={updateOnboardingData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <LearningGoalsStep
      key="goals"
      data={onboardingData}
      updateData={updateOnboardingData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <CourseInterestsStep
      key="courses"
      data={onboardingData}
      updateData={updateOnboardingData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <CompletionStep
      key="completion"
      data={onboardingData as OnboardingData}
      onBack={prevStep}
    />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>
                Step {currentStep} of {TOTAL_STEPS - 1}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        <div className="w-full bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
