// Single source of truth for allowed values
export const ONBOARDING_STEPS = [
  "welcome",
  "personal_info",
  "learning_goal",
  "course_interest",
  "completion",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const LEARNING_GOALS = [
  "career_change",
  "skill_upgrade",
  "promotion",
  "side_business",
  "personal_growth",
] as const;
export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const TIME_COMMITMENTS = [
  "1-3_hours",
  "4-6_hours",
  "7-10_hours",
  "10+_hours",
] as const;
export type TimeCommitment = (typeof TIME_COMMITMENTS)[number];

export type PersonalInfo = {
  full_name?: string;
  email?: string;
};

export type LegalTerms = {
  terms_accepted: boolean;
  accepted_at?: string; // ISO string from API; parse to Date in UI if needed
  terms_version?: string;
};

export interface OnboardingData {
  session_id: string;
  user_id?: string;

  has_completed_onboarding: boolean;
  current_step: OnboardingStep;
  steps_completed: OnboardingStep[];

  personal_info?: PersonalInfo;
  learning_goal?: LearningGoal;
  time_commitment?: TimeCommitment;

  interested_course_ids: string[]; // ≤ 3

  legal_terms?: LegalTerms;

  created_at?: string;
  updated_at?: string;
}

export type Step = {
  step_name: OnboardingStep;
  step_component: React.ReactNode;
};

export type LearningGoalInput = {
  learning_goal?: LearningGoal;
  time_commitment?: TimeCommitment;
};

export type OnboardingStepPayload =
  | { step_name: "welcome"; step_data?: undefined }
  | { step_name: "personal_info"; step_data: PersonalInfo }
  | { step_name: "learning_goal"; step_data: LearningGoalInput } // <- both allowed
  | { step_name: "course_interest"; step_data: string[] } // <- up to 3 ids
  | { step_name: "completion"; step_data: LegalTerms };

export interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export interface WelcomeStepProps extends StepProps {
  data?: PersonalInfo;
  setData?: (data: PersonalInfo) => void;
}
export interface PersonalInfoStepProps extends StepProps {
  data?: PersonalInfo;
  setData: (data: PersonalInfo) => void;
}

export interface LearningGoalStepProps extends StepProps {
  data?: LearningGoalInput;
  setData: (data: LearningGoalInput) => void;
}

export interface CourseInterestStepProps extends StepProps {
  data: string[];
  setData: (data: string[]) => void;
}

export interface CompletionStepProps {
  data?: LegalTerms;
  setData: (data: LegalTerms) => void;
  onComplete: (password: string) => void;
  onBack: () => void;
  allData: {
    personalInfo?: PersonalInfo;
    learningGoal?: LearningGoalInput;
    interestedCoursesId: string[];
    legalTerms?: LegalTerms;
  };
}
