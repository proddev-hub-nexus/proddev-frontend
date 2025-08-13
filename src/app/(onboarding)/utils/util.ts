import axios from "axios";
import {
  OnboardingStepPayload,
  OnboardingStep,
} from "../onboarding/types/onboarding";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

type InitResult = { success: true } | { success: false; error: string };

type UpdateOnboardingResponse = {
  current_step: OnboardingStep;
  steps_completed: OnboardingStep[];
  has_completed_onboarding: boolean;
  updated_at: string;
};

export async function initOnboardingSession(): Promise<InitResult> {
  try {
    await api.post("/onboarding/session-begin");
    return { success: true };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.detail || error.message
      : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateOnboardingStep(
  payload: OnboardingStepPayload
): Promise<UpdateOnboardingResponse> {
  try {
    const { data } = await api.patch<UpdateOnboardingResponse>(
      "/onboarding/update-onboarding",
      payload
    );
    return data;
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.detail || error.message
      : "Unknown error";
    throw new Error(message);
  }
}
