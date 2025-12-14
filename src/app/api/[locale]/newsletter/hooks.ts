"use client";

/**
 * Newsletter API Hooks
 * Type-safe hooks for newsletter subscription management
 */

import { useCallback, useMemo } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import {
  createCustomStateKey,
  useCustomState,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { InputChangeEvent } from "@/packages/next-vibe-ui/web/ui/input";

import type { MeGetResponseOutput } from "../user/private/me/definition";
import statusEndpoints from "./status/definition";
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
        requestData: { email: params.email },
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
  handleEmailChange: (e: InputChangeEvent<"email">) => void;
  clearMessages: () => void;
}

/**
 * Hook for comprehensive newsletter management with manual email input support
 * Supports both logged-in users (auto-fill email) and non-logged-in users (manual input)
 */
export function useNewsletterManager(
  user: MeGetResponseOutput | undefined,
): NewsletterManagerResult {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Use typed custom state for newsletter-related state
  const [manualEmail, setManualEmail] = useCustomState(manualEmailKey, "");
  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useCustomState(
    showConfirmUnsubscribeKey,
    false,
  );

  // Use user email if logged in (and private user), otherwise use manual input
  const email: string = user && !user.isPublic ? user.email : manualEmail;

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
    (e: InputChangeEvent<"email">): void => {
      if (!user) {
        setManualEmail(e.target.value);
      }
    },
    [user, setManualEmail],
  );

  // Check if any operation is in progress
  const isAnyOperationInProgress = useMemo(() => {
    return (
      (subscriptionEndpoint.create?.isSubmitting ?? false) ||
      (unsubscribeEndpoint.create?.isSubmitting ?? false)
    );
  }, [
    subscriptionEndpoint.create?.isSubmitting,
    unsubscribeEndpoint.create?.isSubmitting,
  ]);

  // Check status when we have a valid email
  const statusEndpoint = useNewsletterStatus({
    email: email || "",
    enabled:
      isCurrentEmailValid &&
      !(subscriptionEndpoint.create?.isSubmitting ?? false) &&
      !(unsubscribeEndpoint.create?.isSubmitting ?? false),
  });

  const isSubscribed =
    statusEndpoint.read?.response?.success &&
    statusEndpoint.read.response.data.subscribed
      ? statusEndpoint.read.response.data.subscribed
      : false;

  // Override subscription status based on recent mutations for immediate UI feedback
  const effectiveIsSubscribed =
    (unsubscribeEndpoint.create?.isSuccess ?? false)
      ? false
      : (subscriptionEndpoint.create?.isSuccess ?? false)
        ? true
        : isSubscribed;

  // Single notification state
  const notification: NewsletterManagerResult["notification"] =
    useMemo((): NewsletterManagerResult["notification"] => {
      if (subscriptionEndpoint.create?.error) {
        return {
          type: "error",
          message: "app.api.newsletter.subscription.error.description",
        };
      }
      if (unsubscribeEndpoint.create?.error) {
        return {
          type: "error",
          message: "app.api.newsletter.subscription.unsubscribe.error",
        };
      }
      if (subscriptionEndpoint.create?.isSuccess ?? false) {
        return {
          type: "success",
          message: "app.api.newsletter.subscribe.post.success.description",
        };
      }
      if (unsubscribeEndpoint.create?.isSuccess ?? false) {
        return {
          type: "success",
          message: "app.api.newsletter.unsubscribe.post.success.description",
        };
      }
      if (showConfirmUnsubscribe) {
        return {
          type: "confirm",
          message:
            "app.api.newsletter.subscription.unsubscribe.confirmQuestion",
        };
      }
      // Show unsubscribe text when email is already subscribed
      if (isSubscribed && isCurrentEmailValid) {
        return {
          type: "info",
          message: "app.api.newsletter.enum.status.subscribed",
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

        // Set form value and submit
        subscriptionEndpoint.create.form.reset({
          email: emailToUse,
        });
        subscriptionEndpoint.create.submitForm(undefined);
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

        // Set form value and submit
        unsubscribeEndpoint.create.form.reset({
          email: emailToUse,
        });
        unsubscribeEndpoint.create.submitForm(undefined);
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
      if (!user) {
        setManualEmail(newEmail);
        setShowConfirmUnsubscribe(false);

        // Clear success/error messages when user starts typing
        if (
          subscriptionEndpoint.create?.isSuccess ||
          subscriptionEndpoint.create?.error
        ) {
          subscriptionEndpoint.create?.reset();
        }
        if (
          unsubscribeEndpoint.create?.isSuccess ||
          unsubscribeEndpoint.create?.error
        ) {
          unsubscribeEndpoint.create?.reset();
        }
      }
    },
    [
      subscriptionEndpoint.create,
      unsubscribeEndpoint.create,
      setManualEmail,
      setShowConfirmUnsubscribe,
      user,
    ],
  );

  return {
    email: email || "",
    setEmail,
    isLoggedIn: !!user,
    isSubscribed: effectiveIsSubscribed,
    isSubmitting: subscriptionEndpoint.create?.isSubmitting ?? false,
    isUnsubscribing: unsubscribeEndpoint.create?.isSubmitting ?? false,
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
