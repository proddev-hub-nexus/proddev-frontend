import { create } from "zustand";
import {
  OnboardingData,
  OnboardingStep,
  PersonalInfo,
  LegalTerms,
  LearningGoal,
  TimeCommitment,
} from "../types/onboarding";

type OnboardingStore = OnboardingData & {
  initSession: (session_id: string, user_id?: string) => void;
  setCurrentStep: (step: OnboardingStep) => void;
  setHasCompleted: () => void;
  setPersonalInfo: (patch: Partial<PersonalInfo>) => void;
  setLearningGoal: (goal: LearningGoal) => void;
  setTimeCommitment: (tc: TimeCommitment) => void;
  setLegalTerms: (patch: Partial<LegalTerms>) => void;
  setInterestedCourses: (ids: string[]) => void;
  hydrateFromApi: (data: OnboardingData) => void;
  reset: () => void;
};

const nowISO = () => new Date().toISOString();

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  // ----- initial state (matches your types) -----
  session_id: "",
  user_id: undefined,
  has_completed_onboarding: false,
  current_step: "welcome",
  steps_completed: [],
  personal_info: undefined,
  learning_goal: undefined,
  time_commitment: undefined,
  interested_course_ids: [],
  legal_terms: undefined,
  created_at: undefined,
  updated_at: undefined,

  // ----- actions -----
  initSession: (session_id, user_id) =>
    set((s) => ({
      session_id,
      user_id: user_id ?? s.user_id,
      created_at: s.created_at ?? nowISO(),
      updated_at: nowISO(),
    })),

  setCurrentStep: (step) =>
    set((s) => {
      const steps = s.steps_completed.includes(step)
        ? s.steps_completed
        : [...s.steps_completed, step];

      const completed =
        step === "completion" ? true : s.has_completed_onboarding;

      return {
        current_step: step,
        steps_completed: steps,
        has_completed_onboarding: completed,
        updated_at: nowISO(),
        created_at: s.created_at ?? nowISO(),
      };
    }),

  setHasCompleted: () =>
    set((s) => ({
      has_completed_onboarding: true,
      current_step: "completion",
      steps_completed: s.steps_completed.includes("completion")
        ? s.steps_completed
        : [...s.steps_completed, "completion"],
      updated_at: nowISO(),
      created_at: s.created_at ?? nowISO(),
    })),

  setPersonalInfo: (patch) =>
    set((s) => ({
      personal_info: { ...(s.personal_info ?? {}), ...patch },
      updated_at: nowISO(),
      created_at: s.created_at ?? nowISO(),
    })),

  setLearningGoal: (goal) =>
    set((s) => ({
      learning_goal: goal,
      updated_at: nowISO(),
      created_at: s.created_at ?? nowISO(),
    })),

  setTimeCommitment: (tc) =>
    set((s) => ({
      time_commitment: tc,
      updated_at: nowISO(),
      created_at: s.created_at ?? nowISO(),
    })),

  setLegalTerms: (patch) =>
    set((s) => {
      // normalize to a full object to satisfy TS (terms_accepted must be boolean)
      const base: LegalTerms = s.legal_terms ?? { terms_accepted: false };
      const merged: LegalTerms = {
        terms_accepted:
          typeof patch.terms_accepted === "boolean"
            ? patch.terms_accepted
            : base.terms_accepted,
        accepted_at: patch.accepted_at ?? base.accepted_at,
        terms_version: patch.terms_version ?? base.terms_version,
      };
      // auto-stamp accepted_at if acceptance flips to true
      if (
        !base.terms_accepted &&
        merged.terms_accepted &&
        !merged.accepted_at
      ) {
        merged.accepted_at = nowISO();
      }
      return {
        legal_terms: merged,
        updated_at: nowISO(),
        created_at: s.created_at ?? nowISO(),
      };
    }),

  setInterestedCourses: (ids) =>
    set((s) => {
      const unique = Array.from(new Set(ids)).slice(0, 3);
      return {
        interested_course_ids: unique,
        updated_at: nowISO(),
        created_at: s.created_at ?? nowISO(),
      };
    }),

  hydrateFromApi: (data) =>
    set((s) => ({
      ...s,
      ...data,
      personal_info: data.personal_info ?? s.personal_info ?? {},
      legal_terms: data.legal_terms ??
        s.legal_terms ?? { terms_accepted: false },
      created_at: data.created_at ?? s.created_at ?? nowISO(),
      updated_at: nowISO(),
    })),

  reset: () =>
    set({
      session_id: "",
      user_id: undefined,
      has_completed_onboarding: false,
      current_step: "welcome",
      steps_completed: [],
      personal_info: undefined,
      learning_goal: undefined,
      time_commitment: undefined,
      interested_course_ids: [],
      legal_terms: undefined,
      created_at: undefined,
      updated_at: undefined,
    }),
}));
