"use client";
import { useEffect, useState, useRef } from "react";
import WelcomeStep from "./steps/welcome-step";
import PersonalInfoStep from "./steps/personal-info-step";
import LearningGoalsStep from "./steps/learning-goal-step";
import CourseInterestsStep from "./steps/course-interests-step";
import CompletionStep from "./steps/completion-step";
import { Step } from "./types/onboarding";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import ProgressBar from "@/general/components/progress-bar";

const onboarding_steps: Step[] = [
  { step_name: "welcome", step_component: <WelcomeStep /> },
  { step_name: "personal_info", step_component: <PersonalInfoStep /> },
  { step_name: "learning_goal", step_component: <LearningGoalsStep /> },
  { step_name: "course_interest", step_component: <CourseInterestsStep /> },
  { step_name: "completion", step_component: <CompletionStep /> },
];

export default function Onboarding() {
  const currentIndex = useRef(0);

  return (
    <section>
      <div>
        <header className="flex flex-col justify-center items-center w-11/12 h-1/12 rounded-lg p-4">
          <ProgressBar
            variant="segmented"
            currentIndex={currentIndex.current}
            items={onboarding_steps}
          />
        </header>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={currentIndex.current}
            addEndListener={(node, done) =>
              node.addEventListener("transitionend", done, false)
            }
            classNames="fade"
          >
            <div className="h-full flex flex-col justify-center items-center w-full"></div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </section>
  );
}
