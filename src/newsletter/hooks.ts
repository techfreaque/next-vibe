"use client";

/**
 * Newsletter API Hooks
 * Type-safe hooks for newsletter subscription management
 */

import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { InputChangeEvent } from "next-vibe/ui/components/input";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import {
  createCustomStateKey,
  queryClient,
  useCustomState,
} from "next-vibe/unified-ui/hooks/store";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";

import { useLayoutNewsletterStatus } from "./_components/newsletter-status-provider";
import { scopedTranslation } from "./i18n";
import type { StatusGetResponseOutput } from "./status/definition";
import statusEndpoints from "./status/definition";
import subscribeEndpoints from "./subscribe/definition";
import unsubscribeEndpoints from "./unsubscribe/definition";

const newsletterEmailSchema = z.email();

/****************************
 * TYPED STATE KEYS
 ****************************/

/**
 * Status queries use their own cache keys: the status endpoint's GET form
 * state is shared per endpoint, so the own-status query (no email) and
 * per-address checks would otherwise overwrite each other.
 */
// eslint-disable-next-line i18next/no-literal-string
const NEWSLETTER_STATUS_QUERY_PREFIX = "newsletter-status";
// eslint-disable-next-line i18next/no-literal-string
const OWN_NEWSLETTER_STATUS_QUERY_KEY = "newsletter-status-own";

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
export function useNewsletterStatus(
  user: JwtPayloadType,
  params: {
    email: string;
    enabled?: boolean;
  },
): EndpointReturn<typeof statusEndpoints> {
  const logger = useLogger();

  return useEndpoint(
    statusEndpoints,
    {
      read: {
        queryOptions: {
          enabled: params.enabled !== false,
          // Per-address cache, separate from the own-status query
          queryKey: `${NEWSLETTER_STATUS_QUERY_PREFIX}-${params.email}`,
        },
        initialState: { email: params.email },
      },
    },
    logger,
    user,
  );
}

/****************************
 * PROMO STATE (shared by every newsletter prompt)
 ****************************/

/**
 * Where the visitor stands, from their OWN subscription (account email, user,
 * linked leads, or the guest's lead):
 * - loading: unknown yet. Render nothing promo-shaped (or a same-size skeleton).
 * - confirmed: subscribed and confirmed. Hide every promo.
 * - pending: subscribed, confirm link not clicked. "Check your inbox" + resend.
 * - none: not subscribed. Show the form.
 */
export type NewsletterPromoState = "loading" | "confirmed" | "pending" | "none";

export interface NewsletterPromo {
  state: NewsletterPromoState;
  /** Address of the pending/confirmed subscription, or the account email */
  email: string | undefined;
  isGuest: boolean;
}

export function toNewsletterPromoState(
  status: StatusGetResponseOutput | undefined,
): NewsletterPromoState {
  if (!status) {
    return "loading";
  }
  if (!status.subscribed) {
    return "none";
  }
  return status.confirmed ? "confirmed" : "pending";
}

/**
 * The one source of truth for "should I show a newsletter prompt here?".
 * Pass `initialStatus` from a server loader (NewsletterStatusRepository
 * .getOwnStatusSafe) so SSR renders the right state with no flash.
 */
export function useNewsletterPromo(
  user: JwtPayloadType,
  initialStatus?: StatusGetResponseOutput,
): NewsletterPromo {
  const logger = useLogger();
  // Explicit prop first, then whatever the page layout loaded on the server
  const layoutStatus = useLayoutNewsletterStatus();
  const seedStatus = initialStatus ?? layoutStatus;
  const endpoint = useEndpoint(
    statusEndpoints,
    {
      read: {
        queryOptions: { queryKey: OWN_NEWSLETTER_STATUS_QUERY_KEY },
        initialState: {},
        initialData: seedStatus,
      },
    },
    logger,
    user,
  );
  const response = endpoint.read?.response;
  const status = response?.success ? response.data : seedStatus;
  // A failed lookup must not hide the form forever: treat as not subscribed
  const state =
    response && !response.success ? "none" : toNewsletterPromoState(status);
  return {
    state,
    email: status?.subscriptionEmail,
    isGuest: user.isPublic,
  };
}

/** Re-read the visitor's own status after a subscribe/unsubscribe/resend. */
export async function refetchOwnNewsletterStatus(
  logger: EndpointLogger,
): Promise<void> {
  logger.debug("Refetching own newsletter status");
  await queryClient.invalidateQueries({
    queryKey: [OWN_NEWSLETTER_STATUS_QUERY_KEY],
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
    message: TranslatedKeyType;
  } | null;
  handleEmailChange: (e: InputChangeEvent<"email">) => void;
  clearMessages: () => void;
}

/**
 * Hook for comprehensive newsletter management with manual email input support
 * Supports both logged-in users (auto-fill email) and non-logged-in users (manual input)
 */
export function useNewsletterManager(
  user: JwtPayloadType,
  userEmail: string | undefined,
): NewsletterManagerResult {
  const logger = useLogger();
  const { locale } = useTranslation();
  const { t } = useMemo(() => scopedTranslation.scopedT(locale), [locale]);

  // Use typed custom state for newsletter-related state
  const [manualEmail, setManualEmail] = useCustomState(manualEmailKey, "");
  const [showConfirmUnsubscribe, setShowConfirmUnsubscribe] = useCustomState(
    showConfirmUnsubscribeKey,
    false,
  );

  // Use user email if logged in (and private user), otherwise use manual input
  const email: string = userEmail || manualEmail;

  // Same validator as the status/subscribe request schemas. A looser regex
  // let half-typed addresses ("max@gmail.c") fire the status query, which then
  // failed request validation on every keystroke.
  const isValidEmail = useCallback(
    (emailToValidate: string): boolean =>
      newsletterEmailSchema.safeParse(emailToValidate).success,
    [],
  );

  const isCurrentEmailValid = email ? isValidEmail(email) : false;

  // Hooks for newsletter operations
  const subscriptionEndpoint = useEndpoint(
    subscribeEndpoints,
    undefined,
    logger,
    user,
  );
  const unsubscribeEndpoint = useEndpoint(
    unsubscribeEndpoints,
    undefined,
    logger,
    user,
  );

  // Handle email change - only allow changes when not logged in
  const handleEmailChange = useCallback(
    (e: InputChangeEvent<"email">): void => {
      if (user.isPublic) {
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
  const statusEndpoint = useNewsletterStatus(user, {
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

  // Keep every state-aware prompt (footer, profile, sidebar) in sync with
  // what this form just did.
  const subscribeSucceeded = subscriptionEndpoint.create?.isSuccess ?? false;
  const unsubscribeSucceeded = unsubscribeEndpoint.create?.isSuccess ?? false;
  useEffect(() => {
    if (subscribeSucceeded || unsubscribeSucceeded) {
      void refetchOwnNewsletterStatus(logger);
    }
  }, [subscribeSucceeded, unsubscribeSucceeded, logger]);

  // Single notification state
  const notification: NewsletterManagerResult["notification"] =
    useMemo((): NewsletterManagerResult["notification"] => {
      if (subscriptionEndpoint.create?.error) {
        return {
          type: "error",
          message: t("subscription.error.description"),
        };
      }
      if (unsubscribeEndpoint.create?.error) {
        return {
          type: "error",
          message: t("subscription.unsubscribe.error"),
        };
      }
      if (subscriptionEndpoint.create?.isSuccess ?? false) {
        return {
          type: "success",
          message: t("subscribe.post.success.description"),
        };
      }
      if (unsubscribeEndpoint.create?.isSuccess ?? false) {
        return {
          type: "success",
          message: t("unsubscribe.post.success.description"),
        };
      }
      if (showConfirmUnsubscribe) {
        return {
          type: "confirm",
          message: t("subscription.unsubscribe.confirmQuestion"),
        };
      }
      // Show unsubscribe text when email is already subscribed
      if (isSubscribed && isCurrentEmailValid) {
        return {
          type: "info",
          message: t("enum.status.subscribed"),
        };
      }
      return null;
    }, [
      t,
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
        subscriptionEndpoint.create.submitForm();
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
        unsubscribeEndpoint.create.submitForm();
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
      if (user.isPublic) {
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
    isLoggedIn: !user.isPublic,
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
