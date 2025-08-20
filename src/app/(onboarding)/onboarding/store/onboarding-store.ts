import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCookie, setCookie } from "cookies-next/client";
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
  // New utility methods
  getAllData: () => Partial<OnboardingData>;
  isStepComplete: (step: OnboardingStep) => boolean;
};

const nowISO = () => new Date().toISOString();

// Custom cookie storage for persistence
const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = getCookie(name);
      return value ? String(value) : null;
    } catch (error) {
      console.error("Error reading from cookie:", error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      setCookie(name, value, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
      });
    } catch (error) {
      console.error("Error writing to cookie:", error);
    }
  },
  removeItem: (name: string): void => {
    try {
      setCookie(name, "", {
        maxAge: 0,
        path: "/",
      });
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  },
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
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

      // ----- New utility methods -----
      getAllData: () => {
        const state = get();
        return {
          session_id: state.session_id,
          user_id: state.user_id,
          has_completed_onboarding: state.has_completed_onboarding,
          current_step: state.current_step,
          steps_completed: state.steps_completed,
          personal_info: state.personal_info,
          learning_goal: state.learning_goal,
          time_commitment: state.time_commitment,
          interested_course_ids: state.interested_course_ids,
          legal_terms: state.legal_terms,
          created_at: state.created_at,
          updated_at: state.updated_at,
        };
      },

      isStepComplete: (step: OnboardingStep) => {
        const state = get();
        switch (step) {
          case "welcome":
            return true; // Welcome step has no data requirements
          case "personal_info":
            return !!(
              state.personal_info?.full_name && state.personal_info?.email
            );
          case "learning_goal":
            return !!(state.learning_goal && state.time_commitment);
          case "course_interest":
            return state.interested_course_ids.length > 0;
          case "completion":
            return !!state.legal_terms?.terms_accepted;
          default:
            return false;
        }
      },
    }),
    {
      name: "onboarding-storage", // unique name for the storage key
      storage: createJSONStorage(() => cookieStorage),
      // Only persist the data, not the functions
      partialize: (state) => ({
        session_id: state.session_id,
        user_id: state.user_id,
        has_completed_onboarding: state.has_completed_onboarding,
        current_step: state.current_step,
        steps_completed: state.steps_completed,
        personal_info: state.personal_info,
        learning_goal: state.learning_goal,
        time_commitment: state.time_commitment,
        interested_course_ids: state.interested_course_ids,
        legal_terms: state.legal_terms,
        created_at: state.created_at,
        updated_at: state.updated_at,
      }),
      // Skip hydration on SSR to avoid mismatches
      skipHydration: typeof window === "undefined",
    }
  )
);
