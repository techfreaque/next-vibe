"use client";

/**
 * Newsletter API Hooks
 * Type-safe hooks for newsletter subscription management
 */

import { type ChangeEvent, useCallback, useMemo } from "react";

import {
  createCustomStateKey,
  useCustomState,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/store";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useUser } from "@/app/api/[locale]/v1/core/user/private/me/hooks";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

import statusEndpoints, {
  type StatusGetResponseOutput,
} from "./status/definition";
import subscribeEndpoints from "./subscribe/definition";
import unsubscribeEndpoints from "./unsubscribe/definition";

/****************************
 * TYPED STATE KEYS
 ****************************/

// eslint-disable-next-line i18next/no-literal-string
const manualEmailKey = createCustomStateKey<string>("newsletter_manual_email");
const showConfirmUnsubscribeKey = createCustomStateKey<boolean>(
  // eslint-disable-next-line i18next/no-literal-string
  "newsletter_show_confirm_unsubscribe",
);

/****************************
 * BASIC HOOKS
 ****************************/

/**
 * Hook for newsletter status
 */
export function useNewsletterStatus(params: {
  email: string;
  enabled?: boolean;
}): EndpointReturn<typeof statusEndpoints> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useEndpoint(
    statusEndpoints,
    {
      queryOptions: {
        enabled: params.enabled !== false,
      },
      formOptions: {
        defaultValues: { email: params.email },
      },
    },
    logger,
  );
}

/**
 * Hook for newsletter subscription
 */
export function useNewsletterSubscription(): EndpointReturn<
  typeof subscribeEndpoints
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useEndpoint(
    subscribeEndpoints,
    {
      formOptions: {
        defaultValues: {
          email: "",
          name: "",
          preferences: [],
        },
      },
    },
    logger,
  );
}

/**
 * Hook for newsletter unsubscription
 */
export function useNewsletterUnsubscription(): EndpointReturn<
  typeof unsubscribeEndpoints
> {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  return useEndpoint(
    unsubscribeEndpoints,
    {
      formOptions: {
        defaultValues: {
          email: "",
        },
      },
    },
    logger,
  );
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

  // Hooks for newsletter operations
  const subscriptionEndpoint = useEndpoint(subscribeEndpoints, {}, logger);
  const unsubscribeEndpoint = useEndpoint(unsubscribeEndpoints, {}, logger);

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
    return (
      (subscriptionEndpoint.create?.isPending ?? false) ||
      (unsubscribeEndpoint.create?.isPending ?? false)
    );
  }, [subscriptionEndpoint.create?.isPending, unsubscribeEndpoint.create?.isPending]);

  // Check status when we have a valid email
  const statusEndpoint = useNewsletterStatus({
    email: email || "",
    enabled:
      isCurrentEmailValid &&
      !(subscriptionEndpoint.create?.isPending ?? false) &&
      !(unsubscribeEndpoint.create?.isPending ?? false),
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

  const isSubscribed = isNewsletterStatusResponse(statusEndpoint.read?.data)
    ? statusEndpoint.read.data.subscribed
    : false;

  // Override subscription status based on recent mutations for immediate UI feedback
  const effectiveIsSubscribed =
    unsubscribeEndpoint.create?.isSuccess ?? false
      ? false
      : subscriptionEndpoint.create?.isSuccess ?? false
        ? true
        : isSubscribed;

  // Single notification state
  const notification: NewsletterManagerResult["notification"] =
    useMemo((): NewsletterManagerResult["notification"] => {
      if (subscriptionEndpoint.create?.error) {
        return {
          type: "error",
          message: "app.api.v1.core.newsletter.subscription.error.description",
        };
      }
      if (unsubscribeEndpoint.create?.error) {
        return {
          type: "error",
          message: "app.api.v1.core.newsletter.subscription.unsubscribe.error",
        };
      }
      if (subscriptionEndpoint.create?.isSuccess ?? false) {
        return {
          type: "success",
          message:
            "app.api.v1.core.newsletter.subscribe.post.success.description",
        };
      }
      if (unsubscribeEndpoint.create?.isSuccess ?? false) {
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
      subscriptionEndpoint.create?.error,
      subscriptionEndpoint.create?.isSuccess,
      unsubscribeEndpoint.create?.error,
      unsubscribeEndpoint.create?.isSuccess,
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

      if (emailToUse && isEmailValid && subscriptionEndpoint.create) {
        // Reset unsubscribe endpoint
        unsubscribeEndpoint.create?.reset();
        setShowConfirmUnsubscribe(false);

        subscriptionEndpoint.create.mutate({
          email: emailToUse,
        });
      }
    },
    [
      email,
      isCurrentEmailValid,
      isValidEmail,
      unsubscribeEndpoint.create,
      subscriptionEndpoint.create,
      setShowConfirmUnsubscribe,
    ],
  );

  const unsubscribe = useCallback(
    (emailParam?: string): void => {
      const emailToUse = emailParam || email;
      const isEmailValid = emailParam
        ? isValidEmail(emailParam)
        : isCurrentEmailValid;

      if (emailToUse && isEmailValid && unsubscribeEndpoint.create) {
        if (!showConfirmUnsubscribe) {
          // Clear any existing messages before showing confirmation
          subscriptionEndpoint.create?.reset();
          unsubscribeEndpoint.create?.reset();
          setShowConfirmUnsubscribe(true);
          return;
        }

        // Reset subscription endpoint
        subscriptionEndpoint.create?.reset();

        unsubscribeEndpoint.create.mutate({
          email: emailToUse,
        });
        setShowConfirmUnsubscribe(false);
      }
    },
    [
      email,
      isCurrentEmailValid,
      isValidEmail,
      showConfirmUnsubscribe,
      subscriptionEndpoint.create,
      unsubscribeEndpoint.create,
      setShowConfirmUnsubscribe,
    ],
  );

  const setEmail = useCallback(
    (newEmail: string): void => {
      if (!isLoggedIn) {
        setManualEmail(newEmail);
        setShowConfirmUnsubscribe(false);

        // Clear success/error messages when user starts typing
        if (
          subscriptionEndpoint.create?.isSuccess ||
          subscriptionEndpoint.create?.isError
        ) {
          subscriptionEndpoint.create?.reset();
        }
        if (
          unsubscribeEndpoint.create?.isSuccess ||
          unsubscribeEndpoint.create?.isError
        ) {
          unsubscribeEndpoint.create?.reset();
        }
      }
    },
    [
      isLoggedIn,
      subscriptionEndpoint.create,
      unsubscribeEndpoint.create,
      setManualEmail,
      setShowConfirmUnsubscribe,
    ],
  );

  return {
    email: email || "",
    setEmail,
    isLoggedIn,
    isSubscribed: effectiveIsSubscribed,
    isSubmitting: subscriptionEndpoint.create?.isPending ?? false,
    isUnsubscribing: unsubscribeEndpoint.create?.isPending ?? false,
    isAnyOperationInProgress,
    subscribe,
    unsubscribe,
    showConfirmUnsubscribe,
    notification,
    handleEmailChange,
    clearMessages: useCallback((): void => {
      subscriptionEndpoint.create?.reset();
      unsubscribeEndpoint.create?.reset();
      setShowConfirmUnsubscribe(false);
    }, [
      subscriptionEndpoint.create,
      unsubscribeEndpoint.create,
      setShowConfirmUnsubscribe,
    ]),
  };
}
