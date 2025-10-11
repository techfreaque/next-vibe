/**
 * Login API Hooks
 *
 * Hooks for interacting with the Login API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import type { Route } from "next";
import { useRouter } from "next/navigation";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui/ui";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LeadTrackingClientRepository } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
import { useLeadId } from "@/app/api/[locale]/v1/core/leads/tracking/engagement/hooks";
import { type EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type {
  FormAlertState,
  InferApiFormReturn,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

import { authClientRepository } from "../../auth/repository-client";
import { useUser } from "../../private/me/hooks";
import loginEndpoints from "./definition";
import { useLoginOptions } from "./options/hooks";
import type { LoginOptions } from "./repository";

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for user login
 *
 * Features:
 * - Form validation using Zod schema
 * - Toast notifications for success and error states
 * - Automatic token storage
 * - Redirect handling based on URL parameters
 * - Dynamic login options based on email
 * - Token management and cleanup
 *
 * @returns Form and mutation for user login with enhanced error handling
 */
export function useLogin(
  initialLoginOptions: LoginOptions = {
    allowPasswordAuth: true,
    allowSocialAuth: false,
  },
  logger: EndpointLogger,
): InferApiFormReturn<typeof loginEndpoints.POST> & {
  emailForOptions: string | null;
  handleEmailChange: (email: string | undefined) => void;
  handleEmailFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: { onChange: (e: ChangeEvent<HTMLInputElement>) => void },
  ) => void;
  errorMessage: string | null;
  isAccountLocked: boolean;
  loginOptions: LoginOptions;
  alert: FormAlertState | null;
} {
  const { toast } = useToast();
  const router = useRouter();
  const { refetch } = useUser(logger);
  const { t, locale } = useTranslation();

  // Minimal state - only keep what can't be stored in the form
  const [emailForOptions, setEmailForOptions] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<TranslationKey | null>(null);

  // Get dynamic login options based on email
  const loginOptionsResult = useLoginOptions(logger);
  // Since loginOptionsResult may not have data initially, provide fallback
  const dynamicLoginOptions = loginOptionsResult?.read?.data || null;

  // Combine initial options with dynamic ones using useMemo to prevent unnecessary recalculations
  const loginOptions = useMemo(
    () => ({
      ...initialLoginOptions,
      ...((dynamicLoginOptions || {}) as Partial<LoginOptions>),
    }),
    [dynamicLoginOptions, initialLoginOptions],
  );

  // Check if account is locked - derived from loginOptions
  const isAccountLocked = useMemo(
    () => loginOptions?.maxAttempts === 0,
    [loginOptions],
  );

  // Handle email change to check for specific login options
  const handleEmailChange = useCallback((email: string | undefined): void => {
    // Basic email validation - more efficient than full regex for this use case
    if (
      email &&
      email.length > 5 &&
      email.includes("@") &&
      email.includes(".")
    ) {
      const atIndex = email.indexOf("@");
      const dotIndex = email.lastIndexOf(".");
      // Ensure @ comes before last dot and both have content around them
      if (
        atIndex > 0 &&
        dotIndex > atIndex + 1 &&
        dotIndex < email.length - 1
      ) {
        setEmailForOptions(email);
      }
    }
  }, []);

  // Handle email field change with both form update and options check
  const handleEmailFieldChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      field: { onChange: (e: ChangeEvent<HTMLInputElement>) => void },
    ): void => {
      // Update the form field
      field.onChange(e);
      // Handle email change for options
      handleEmailChange(e.target.value);
    },
    [handleEmailChange],
  );

  const formResult = useApiForm(
    loginEndpoints.POST,
    logger,
    {
      defaultValues: {
        credentials: {
          email: "",
          password: "",
        },
        options: {
          rememberMe: false,
        },
        leadId: LeadTrackingClientRepository.LOADING_LEAD_ID,
      },
    },
    {
      onSuccess: async ({ responseData }) => {
        if (!responseData.exists) {
          toast({
            title: t("auth.login.errors.title"),
            description: t("auth.login.errors.invalid_credentials"),
            variant: "destructive",
          });
          setErrorMessage("auth.login.errors.invalid_credentials");
          // Logger will be initialized below for actual error logging
          return;
        }

        try {
          // Set the auth status to indicate successful login
          // No need to clear first since the server has already set the httpOnly cookie
          const tokenResult = authClientRepository.setAuthStatus(logger);
          if (!tokenResult.success) {
            logger.error("auth.login.token.save.failed", tokenResult);
            return createErrorResponse(
              "auth.login.errors.token_save_failed",
              ErrorResponseTypes.INTERNAL_ERROR,
            );
          }
          logger.debug("auth.login.token.save.success");

          // Show success message immediately
          toast({
            title: t("auth.login.success.title"),
            description: t("auth.login.success.description"),
            variant: "default",
          });

          // Get redirect info from URL
          const redirectTo = new URL(window.location.href).searchParams.get(
            "redirectTo",
          ) as Route;

          // Refetch user data after successful login
          await refetch();

          // Navigate immediately - the new page will handle user data fetching
          // Remove router.refresh() to prevent re-render loop
          router.push(redirectTo || `/${locale}/app/onboarding`);
        } catch (error) {
          toast({
            title: t("auth.login.errors.title"),
            description: t("authErrors.login.form.error.unknown.description"),
            variant: "destructive",
          });
          logger.error("auth.login.process.failed", error);
        }
      },
      onError: (data) => {
        setErrorMessage(data.error.message);
        toast({
          title: t("auth.login.errors.title"),
          description: t(data.error.message),
          variant: "destructive",
        });
      },
    },
  );

  // Use lead ID hook with callback to set lead ID in form
  useLeadId((leadId) => {
    formResult.form.setValue("leadId", leadId);
  });

  // Hook up the email watcher to the form
  useEffect(() => {
    if (!formResult.form) {
      return;
    }

    formResult.form.watch(
      (value: unknown, { name }: { name?: string }) => {
        // Only process email changes to avoid unnecessary processing
        if (
          name === "credentials.email" &&
          value &&
          typeof value === "object" &&
          "credentials" in value &&
          value.credentials &&
          typeof value.credentials === "object" &&
          "email" in value.credentials &&
          typeof value.credentials.email === "string"
        ) {
          handleEmailChange(value.credentials.email);
        }
      },
    );
  }, [formResult.form, handleEmailChange]);

  // Generate alert state from error/success states
  const alert: FormAlertState | null = useMemo(() => {
    // Check for account locked state
    if (isAccountLocked) {
      return {
        variant: "destructive",
        title: {
          message: "auth.login.errors.accountLocked",
        },
        message: {
          message: "auth.login.errors.accountLockedDescription",
        },
      };
    }

    // Check for form submission error (prioritize this over errorMessage)
    if (formResult.response?.success === false) {
      return {
        variant: "destructive",
        title: {
          message: "auth.login.errors.title",
        },
        message: {
          message: formResult.response.message,
          messageParams: formResult.response.messageParams,
        },
      };
    }

    // Check for error message
    if (errorMessage) {
      return {
        variant: "destructive",
        title: {
          message: "auth.login.errors.title",
        },
        message: {
          message: errorMessage,
        },
      };
    }

    return null;
  }, [isAccountLocked, errorMessage, formResult]);

  return {
    ...formResult,
    emailForOptions,
    handleEmailChange,
    handleEmailFieldChange,
    errorMessage,
    isAccountLocked,
    loginOptions,
    alert,
  };
}

export default useLogin;
