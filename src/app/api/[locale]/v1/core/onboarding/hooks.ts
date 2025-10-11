/**
 * Onboarding API Hooks
 * Production-ready hooks following template-api pattern for consistency
 */

import type {
  InferApiFormReturn,
  InferApiQueryReturn,
  InferEnhancedMutationResult,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";

import type { OnboardingPostRequestType } from "./definition";
import definitions from "./definition";

// Constants for default values (removed unused constants)

/****************************
 * QUERY HOOKS
 ****************************/

/**
 * Hook for fetching onboarding status by user ID
 */
export function useOnboardingStatus(
  userId: string,
  options?: { enabled?: boolean },
): InferApiQueryReturn<typeof definitions.GET> {
  return useApiQuery(definitions.GET, undefined, undefined, {
    enabled: options?.enabled !== false,
  });
}

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for creating onboarding data
 */
export function useCreateOnboarding(): InferApiFormReturn<
  typeof definitions.POST
> {
  return useApiForm(definitions.POST);
}

/**
 * Hook for updating onboarding data (using POST since PUT is not available)
 */
export function useUpdateOnboarding(): InferApiFormReturn<
  typeof definitions.POST
> {
  return useApiForm(definitions.POST);
}

/**
 * Hook for onboarding form with default values
 */
export function useOnboardingForm(params: {
  id: string;
  defaultValues?: Partial<OnboardingPostRequestType>;
}): InferApiFormReturn<typeof definitions.POST> {
  return useApiForm(definitions.POST, {
    defaultValues: {
      completedSteps: [],
      currentStep: "profile",
      isCompleted: false,
      ...params.defaultValues,
    },
  });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for completing the onboarding process
 * This is the main hook used in the onboarding questions form
 */
export function useCompleteOnboarding(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/**
 * Hook for onboarding mutations
 */
export function useOnboardingMutation(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/**
 * Hook for updating onboarding mutations (using POST since PUT is not available)
 */
export function useUpdateOnboardingMutation(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/****************************
 * SPECIALIZED HOOKS
 ****************************/

/**
 * Hook for plan selection during onboarding
 * This creates an initial onboarding record when a plan is selected
 */
export function useOnboardingPlanSelection(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/**
 * Hook for step progression during onboarding
 * Updates the current step and completed steps
 */
export function useOnboardingStepProgression(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/**
 * Hook for onboarding completion
 * Marks the onboarding as completed
 */
export function useOnboardingCompletion(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}
