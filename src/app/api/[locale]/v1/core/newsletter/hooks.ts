"use client";

/**
 * Newsletter API Hooks
 * Simplified hooks for interacting with the Newsletter API
 */

import { type ChangeEvent, useCallback, useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EnhancedMutationResult } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-api-mutation";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import {
  createCustomStateKey,
  useCustomState,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/store";
import type {
  ApiFormReturn,
  ApiQueryReturn,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import { useUser } from "@/app/api/[locale]/v1/core/user/private/me/hooks";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

import statusEndpoints, {
  type StatusGetResponseOutput,
} from "./status/definition";
import type {
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
} from "./subscribe/definition";
import subscribeEndpoints from "./subscribe/definition";
import type {
  UnsubscribePostRequestOutput,
  UnsubscribePostResponseOutput,
} from "./unsubscribe/definition";
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
}): ApiQueryReturn<StatusGetResponseOutput> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useApiQuery({
    endpoint: statusEndpoints.GET,
    requestData: { email: params.email },
    urlPathParams: undefined,
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
 * Server gets leadId from JWT payload (user.leadId)
 */
export function useNewsletterSubscription(): ApiFormReturn<
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
  never
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const formResult = useApiForm(subscribeEndpoints.POST, logger, {
    defaultValues: {
      email: "",
      name: "",
      preferences: [],
      // Note: leadId removed - server gets it from JWT
    },
  });

  return formResult;
}

/**
 * Hook for newsletter unsubscription
 */
export function useNewsletterUnsubscription(): ApiFormReturn<
  UnsubscribePostRequestOutput,
  UnsubscribePostResponseOutput,
  never
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useApiForm(unsubscribeEndpoints.POST, logger, {
    defaultValues: {
      email: "",
    },
  });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for subscription mutations
 * @deprecated Use useNewsletterManager instead for comprehensive newsletter management
 */
export function useSubscriptionMutation(): EnhancedMutationResult<
  SubscribePostResponseOutput,
  SubscribePostRequestOutput,
  never
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useApiMutation(subscribeEndpoints.POST, logger, {
    onSuccess: () => {},
    onError: () => {},
  });
}

/**
 * Hook for unsubscription mutations
 * @deprecated Use useNewsletterManager instead for comprehensive newsletter management
 */
export function useUnsubscriptionMutation(): EnhancedMutationResult<
  UnsubscribePostResponseOutput,
  UnsubscribePostRequestOutput,
  never
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useApiMutation(unsubscribeEndpoints.POST, logger, {
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
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  // Fetch current user data to get email
  const { user, isLoggedIn } = useUser(logger);

  // Use typed custom state for newsletter-related state
  const [manualEmail, setManualEmail] = useCustomState(manualEmailKey, "");
  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useCustomState(
    showConfirmUnsubscribeKey,
    false,
  );

  // Use user email if logged in, otherwise use manual input
  const email: string =
    isLoggedIn && user && "email" in user && typeof user.email === "string"
      ? user.email
      : manualEmail;

  // Improved email validation
  const isValidEmail = useCallback((emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailToValidate.length > 0 && emailRegex.test(emailToValidate);
  }, []);

  const isCurrentEmailValid = email ? isValidEmail(email) : false;

  // Hooks for newsletter operations using mutations
  const subscriptionMutation = useApiMutation(subscribeEndpoints.POST, logger, {
    onSuccess: () => {},
    onError: () => {},
  });
  const unsubscribeMutation = useApiMutation(
    unsubscribeEndpoints.POST,
    logger,
    {
      onSuccess: () => {},
      onError: () => {},
    },
  );

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
    email: email || "",
    enabled:
      isCurrentEmailValid &&
      !subscriptionMutation.isPending &&
      !unsubscribeMutation.isPending,
  });

  // Type guard for newsletter status response
  const isNewsletterStatusResponse = (
    data: StatusGetResponseOutput | undefined,
  ): data is StatusGetResponseOutput => {
    return (
      data !== null &&
      data !== undefined &&
      typeof data === "object" &&
      "subscribed" in data &&
      typeof data.subscribed === "boolean"
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
  const notification: NewsletterManagerResult["notification"] =
    useMemo((): NewsletterManagerResult["notification"] => {
      if (subscriptionMutation.error) {
        return {
          type: "error",
          message: "app.api.v1.core.newsletter.subscription.error.description",
        };
      }
      if (unsubscribeMutation.error) {
        return {
          type: "error",
          message: "app.api.v1.core.newsletter.subscription.unsubscribe.error",
        };
      }
      if (subscriptionMutation.isSuccess) {
        return {
          type: "success",
          message:
            "app.api.v1.core.newsletter.subscribe.post.success.description",
        };
      }
      if (unsubscribeMutation.isSuccess) {
        return {
          type: "success",
          message:
            "app.api.v1.core.newsletter.unsubscribe.post.success.description",
        };
      }
      if (showConfirmUnsubscribe) {
        return {
          type: "confirm",
          message:
            "app.api.v1.core.newsletter.subscription.unsubscribe.confirmQuestion",
        };
      }
      // Show unsubscribe text when email is already subscribed
      if (isSubscribed && isCurrentEmailValid) {
        return {
          type: "info",
          message: "app.api.v1.core.newsletter.enum.status.subscribed",
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

        // Server gets leadId from JWT payload (user.leadId)
        subscriptionMutation.mutate({
          requestData: {
            email: emailToUse,
            // Note: leadId removed - server gets it from JWT
          },
          urlPathParams: undefined,
        });
      }
    },
    [
      email,
      isCurrentEmailValid,
      isValidEmail,
      unsubscribeMutation,
      subscriptionMutation,
      setShowConfirmUnsubscribe,
    ],
  );

  const unsubscribe = useCallback(
    (emailParam?: string): void => {
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

        // Server gets leadId from JWT payload (user.leadId)
        const requestData = {
          email: emailToUse,
        };
        unsubscribeMutation.mutate({
          requestData,
          urlPathParams: undefined,
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
    email: email || "",
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
