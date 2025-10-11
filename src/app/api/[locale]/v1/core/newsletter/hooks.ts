"use client";

/**
 * Newsletter API Hooks
 * Simplified hooks for interacting with the Newsletter API
 */

import { type ChangeEvent, useCallback, useMemo } from "react";

import { LeadTrackingClientRepository } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
import { useLeadId } from "@/app/api/[locale]/v1/core/leads/tracking/engagement/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";
import {
  createCustomStateKey,
  useCustomState,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/store";
import type {
  InferApiFormReturn,
  InferApiQueryReturn,
  InferEnhancedMutationResult,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import { useUser } from "@/app/api/[locale]/v1/core/user/private/me/hooks";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

import statusEndpoints from "./status/definition";
import subscribeEndpoints from "./subscribe/definition";
import unsubscribeEndpoints from "./unsubscribe/definition";

/****************************
 * TYPED STATE KEYS
 ****************************/

// Create typed state keys for newsletter-related state

// eslint-disable-next-line i18next/no-literal-string
const manualEmailKey = createCustomStateKey<string>("newsletter_manual_email");
const showConfirmUnsubscribeKey = createCustomStateKey<boolean>(
  // eslint-disable-next-line i18next/no-literal-string
  "newsletter_show_confirm_unsubscribe",
);

/****************************
 * QUERY HOOKS
 ****************************/

/**
 * Hook for fetching newsletter status
 */
export function useNewsletterStatus(params: {
  email: string;
  enabled?: boolean;
}): InferApiQueryReturn<typeof statusEndpoints.GET> {
  const { locale } = useTranslation();
  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);

  return useApiQuery({
    endpoint: statusEndpoints.GET,
    requestData: { email: params.email },
    urlParams: {},
    logger,
    options: {
      enabled: params.enabled !== false,
    },
  });
}

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for newsletter subscription with form validation
 */
export function useNewsletterSubscription(): InferApiFormReturn<
  typeof subscribeEndpoints.POST
> {
  const formResult = useApiForm(subscribeEndpoints.POST, {
    email: "",
    name: "",
    preferences: [],
    inputLeadId: LeadTrackingClientRepository.LOADING_LEAD_ID, // Will be set by useEffect
  });

  // Use lead ID hook with callback to set lead ID in form
  useLeadId((leadId: string) => {
    formResult.form.setValue("inputLeadId", leadId);
  });

  return formResult;
}

/**
 * Hook for newsletter unsubscription
 */
export function useNewsletterUnsubscription(): InferApiFormReturn<
  typeof unsubscribeEndpoints.POST
> {
  return useApiForm(unsubscribeEndpoints.POST, {
    email: "",
  });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for subscription mutations
 * @deprecated Use useNewsletterManager instead for comprehensive newsletter management
 */
export function useSubscriptionMutation(): InferEnhancedMutationResult<
  typeof subscribeEndpoints.POST
> {
  return useApiMutation(subscribeEndpoints.POST, {
    onSuccess: () => {},
    onError: () => {},
  });
}

/**
 * Hook for unsubscription mutations
 * @deprecated Use useNewsletterManager instead for comprehensive newsletter management
 */
export function useUnsubscriptionMutation(): InferEnhancedMutationResult<
  typeof unsubscribeEndpoints.POST
> {
  return useApiMutation(unsubscribeEndpoints.POST, {
    onSuccess: () => {},
    onError: () => {},
  });
}

/****************************
 * COMBINED HOOKS
 ****************************/

/**
 * Newsletter manager hook return type
 */
interface NewsletterManagerResult {
  email: string;
  setEmail: (email: string) => void;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  isSubmitting: boolean;
  isUnsubscribing: boolean;
  isAnyOperationInProgress: boolean;
  subscribe: (emailParam?: string) => void;
  unsubscribe: (emailParam?: string, leadIdParam?: string) => void;
  showConfirmUnsubscribe: boolean;
  notification: {
    type: "error" | "success" | "confirm" | "info";
    message: TranslationKey;
  } | null;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clearMessages: () => void;
}

/**
 * Hook for comprehensive newsletter management with manual email input support
 * Supports both logged-in users (auto-fill email) and non-logged-in users (manual input)
 */
export function useNewsletterManager(): NewsletterManagerResult {
  const { locale } = useTranslation();
  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);
  // Fetch current user data to get email
  const { user, isLoggedIn } = useUser(logger);

  // Get lead tracking functionality
  const { leadId } = useLeadId();

  // Use typed custom state for newsletter-related state
  const [manualEmail, setManualEmail] = useCustomState(manualEmailKey, "");
  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useCustomState(
    showConfirmUnsubscribeKey,
    false,
  );

  // Use user email if logged in, otherwise use manual input
  const email =
    isLoggedIn && user && "email" in user ? user.email : manualEmail;

  // Improved email validation
  const isValidEmail = useCallback((emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailToValidate.length > 0 && emailRegex.test(emailToValidate);
  }, []);

  const isCurrentEmailValid = isValidEmail(email);

  // Hooks for newsletter operations using mutations
  const subscriptionMutation = useApiMutation(subscribeEndpoints.POST, {
    onSuccess: () => {},
    onError: () => {},
  });
  const unsubscribeMutation = useApiMutation(unsubscribeEndpoints.POST, {
    onSuccess: () => {},
    onError: () => {},
  });

  // Handle email change - only allow changes when not logged in
  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      if (!isLoggedIn) {
        setManualEmail(e.target.value);
      }
    },
    [isLoggedIn, setManualEmail],
  );

  // Check if any operation is in progress
  const isAnyOperationInProgress = useMemo(() => {
    return subscriptionMutation.isPending || unsubscribeMutation.isPending;
  }, [subscriptionMutation.isPending, unsubscribeMutation.isPending]);

  // Check status when we have a valid email but don't auto-trigger on typing
  const statusQuery = useNewsletterStatus({
    email: email,
    enabled:
      isCurrentEmailValid &&
      !subscriptionMutation.isPending &&
      !unsubscribeMutation.isPending,
  });

  // Type guard for newsletter status response
  const isNewsletterStatusResponse = (
    data: any,
  ): data is { subscribed: boolean } => {
    return (
      data !== null &&
      typeof data === "object" &&
      "subscribed" in data &&
      typeof (data as { subscribed: any }).subscribed === "boolean"
    );
  };

  const isSubscribed = isNewsletterStatusResponse(statusQuery.data)
    ? statusQuery.data.subscribed
    : false;

  // Override subscription status based on recent mutations for immediate UI feedback
  const effectiveIsSubscribed = unsubscribeMutation.isSuccess
    ? false
    : subscriptionMutation.isSuccess
      ? true
      : isSubscribed;

  // Single notification state (priority: errors > success > confirmation > subscription status)
  const notification: NewsletterManagerResult["notification"] = useMemo(() => {
    if (subscriptionMutation.error) {
      return {
        type: "error" as const,
        message: "newsletter.subscription.error.description" as const,
      };
    }
    if (unsubscribeMutation.error) {
      return {
        type: "error" as const,
        message: "newsletter.subscription.unsubscribe.error" as const,
      };
    }
    if (subscriptionMutation.isSuccess) {
      return {
        type: "success" as const,
        message: "newsletter.subscription.success.description" as const,
      };
    }
    if (unsubscribeMutation.isSuccess) {
      return {
        type: "success" as const,
        message: "newsletter.subscription.unsubscribe.success" as const,
      };
    }
    if (showConfirmUnsubscribe) {
      return {
        type: "confirm" as const,
        message: "newsletter.subscription.unsubscribe.confirmQuestion" as const,
      };
    }
    // Show unsubscribe text when email is already subscribed
    if (isSubscribed && isCurrentEmailValid) {
      return {
        type: "info" as const,
        message: "newsletter.subscription.status.subscribed" as const,
      };
    }
    return null;
  }, [
    subscriptionMutation.error,
    subscriptionMutation.isSuccess,
    unsubscribeMutation.error,
    unsubscribeMutation.isSuccess,
    showConfirmUnsubscribe,
    isSubscribed,
    isCurrentEmailValid,
  ]);

  const subscribe = useCallback(
    (emailParam?: string): void => {
      const emailToUse = emailParam || email;
      const isEmailValid = emailParam
        ? isValidEmail(emailParam)
        : isCurrentEmailValid;

      if (emailToUse && isEmailValid) {
        // Reset unsubscribe mutation to clear any previous unsubscribe success/error
        unsubscribeMutation.reset();
        // Reset confirmation state
        setShowConfirmUnsubscribe(false);

        // Get leadId from client tracking if available, server will create anonymous lead if needed
        const handleSubscription = (): void => {
          try {
            subscriptionMutation.mutate({
              requestData: {
                email: emailToUse,
                inputLeadId: leadId, // Lead ID is always required now
              },
              urlParams: undefined,
            });
          } catch {
            // If tracking fails, let server handle lead creation
            subscriptionMutation.mutate({
              requestData: {
                email: emailToUse,
                inputLeadId: leadId, // Use leadId from hook
              },
              urlParams: undefined,
            });
          }
        };

        void handleSubscription();
      }
    },
    [
      email,
      isCurrentEmailValid,
      isValidEmail,
      unsubscribeMutation,
      subscriptionMutation,
      setShowConfirmUnsubscribe,
      leadId,
    ],
  );

  const unsubscribe = useCallback(
    (emailParam?: string, leadIdParam?: string): void => {
      const emailToUse = emailParam || email;
      const isEmailValid = emailParam
        ? isValidEmail(emailParam)
        : isCurrentEmailValid;

      if (emailToUse && isEmailValid) {
        if (!showConfirmUnsubscribe) {
          // Clear any existing messages before showing confirmation
          subscriptionMutation.reset();
          unsubscribeMutation.reset();
          setShowConfirmUnsubscribe(true);
          return;
        }

        // Reset subscription mutation to clear any previous subscription success/error
        subscriptionMutation.reset();

        // Lead ID is required - use from hook if not provided as param
        const finalLeadId = leadIdParam || leadId;

        if (!finalLeadId) {
          return;
        }

        const requestData = {
          email: emailToUse,
        };
        unsubscribeMutation.mutate({
          requestData,
          urlParams: undefined,
        });
        setShowConfirmUnsubscribe(false);
      }
    },
    [
      email,
      isCurrentEmailValid,
      isValidEmail,
      showConfirmUnsubscribe,
      subscriptionMutation,
      unsubscribeMutation,
      setShowConfirmUnsubscribe,
      leadId,
    ],
  );

  const setEmail = useCallback(
    (newEmail: string): void => {
      if (!isLoggedIn) {
        setManualEmail(newEmail);
        setShowConfirmUnsubscribe(false); // Reset confirmation state when email changes

        // Clear success/error messages when user starts typing
        if (subscriptionMutation.isSuccess || subscriptionMutation.isError) {
          subscriptionMutation.reset();
        }
        if (unsubscribeMutation.isSuccess || unsubscribeMutation.isError) {
          unsubscribeMutation.reset();
        }
      }
    },
    [
      isLoggedIn,
      subscriptionMutation,
      unsubscribeMutation,
      setManualEmail,
      setShowConfirmUnsubscribe,
    ],
  );

  return {
    email,
    setEmail,
    isLoggedIn,
    isSubscribed: effectiveIsSubscribed,
    isSubmitting: subscriptionMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    isAnyOperationInProgress,
    subscribe,
    unsubscribe,
    showConfirmUnsubscribe,
    notification,
    handleEmailChange,
    clearMessages: useCallback((): void => {
      subscriptionMutation.reset();
      unsubscribeMutation.reset();
      setShowConfirmUnsubscribe(false);
    }, [subscriptionMutation, unsubscribeMutation, setShowConfirmUnsubscribe]),
  };
}
