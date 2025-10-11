/**
 * Onboarding options hooks
 *
 * This file contains hooks for managing onboarding options selection and related functionality.
 */

import { useOnboardingForm, useOnboardingMutation } from "../hooks";

/**
 * Onboarding option type
 */
export type OnboardingOptionType = "payment" | "consultation";

/**
 * Hook for payment option submission
 */
export function useOnboardingPaymentOption(userData: {
  name?: string;
  email?: string;
  id: string;
}): {
  handlePayment: () => Promise<void>;
  isPaymentPending: boolean;
  paymentForm: ReturnType<typeof useOnboardingForm>;
} {
  const paymentMutation = useOnboardingMutation();
  const paymentForm = useOnboardingForm({ id: userData.id });

  const handlePayment = async (): Promise<void> => {
    await paymentForm.submitForm(undefined);
  };

  return {
    handlePayment,
    isPaymentPending: paymentMutation.isPending,
    paymentForm,
  };
}

/**
 * Hook for consultation option submission
 */
export function useOnboardingConsultationOption(userData: {
  name?: string;
  email?: string;
  id: string;
}): {
  handleConsultation: () => Promise<void>;
  isConsultationPending: boolean;
  consultationForm: ReturnType<typeof useOnboardingForm>;
} {
  const consultationMutation = useOnboardingMutation();
  const consultationForm = useOnboardingForm({ id: userData.id });

  const handleConsultation = async (): Promise<void> => {
    await consultationForm.submitForm(undefined);
  };

  return {
    handleConsultation,
    isConsultationPending: consultationMutation.isPending,
    consultationForm,
  };
}

/**
 * Hook for managing both onboarding options
 */
export function useOnboardingOptions(userData: {
  name?: string;
  email?: string;
  id: string;
}): {
  payment: ReturnType<typeof useOnboardingPaymentOption>;
  consultation: ReturnType<typeof useOnboardingConsultationOption>;
} {
  const payment = useOnboardingPaymentOption(userData);
  const consultation = useOnboardingConsultationOption(userData);

  return {
    payment,
    consultation,
  };
}
