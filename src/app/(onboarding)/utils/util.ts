import axios from "axios";
import {
  OnboardingStepPayload,
  OnboardingStep,
} from "../onboarding/types/onboarding";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});
type InitResult =
  | { success: true; session_id: string }
  | { success: false; error: string };

type UpdateOnboardingResponse = {
  current_step: OnboardingStep;
  steps_completed: OnboardingStep[];
  has_completed_onboarding: boolean;
  updated_at: string;
};
export async function initOnboardingSession(): Promise<InitResult> {
  try {
    const response = await api.post("/onboarding/session-begin");

    // Extract session_id from the response
    const { session_id } = response.data;

    if (!session_id) {
      return { success: false, error: "No session_id returned from server" };
    }

    return { success: true, session_id };
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
