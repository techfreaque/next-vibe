/**
 * Login API Hooks
 *
 * Hooks for interacting with the Login API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useToast } from "next-vibe-ui/ui";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { useLeadId } from "@/app/api/[locale]/v1/core/leads/tracking/engagement/hooks";
import { type EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { FormAlertState } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import { useTranslation } from "@/i18n/core/client";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import { authClientRepository } from "../../auth/repository-client";
import { useUser } from "../../private/me/hooks";
import loginEndpoints from "./definition";
import { useLoginOptions } from "./options/hooks";
import type { LoginOptions } from "./repository";

// Get the exact types from the endpoint
type LoginEndpoint = typeof loginEndpoints.POST;
type LoginRequest = LoginEndpoint["TRequestOutput"];
type LoginResponse = LoginEndpoint["TResponseOutput"];
type LoginUrlVars = LoginEndpoint["TUrlVariablesOutput"];

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
): ApiFormReturn<LoginRequest, LoginResponse, LoginUrlVars> & {
  emailForOptions: string | null;
  handleEmailChange: (email: string | undefined) => void;
  handleEmailFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: { onChange: (e: ChangeEvent<HTMLInputElement>) => void },
  ) => void;
  errorMessage: TranslationKey | null;
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
  const dynamicLoginOptions =
    (loginOptionsResult?.read?.response?.success &&
      loginOptionsResult?.read?.response?.data?.response) ||
    null;

  // Combine initial options with dynamic ones using useMemo to prevent unnecessary recalculations
  const loginOptions = useMemo(() => {
    const options: LoginOptions = {
      ...initialLoginOptions,
    };
    if (dynamicLoginOptions) {
      Object.assign(options, dynamicLoginOptions);
    }
    return options;
  }, [dynamicLoginOptions, initialLoginOptions]);

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
        leadId: undefined,
      },
      persistForm: false,
    },
    {
      onSuccess: async (data) => {
        try {
          logger.debug("auth.login.onSuccess.start", { data });

          // Set the auth status to indicate successful login
          // No need to clear first since the server has already set the httpOnly cookie
          const tokenResult = authClientRepository.setAuthStatus(logger);
          if (!tokenResult.success) {
            logger.error("auth.login.token.save.failed", tokenResult);
            toast({
              title: t("auth.login.errors.title"),
              description: t("auth.login.errors.token_save_failed"),
              variant: "destructive",
            });
            return;
          }
          logger.debug("auth.login.token.save.success");

          // Show success message immediately
          toast({
            title: t("auth.login.success.title"),
            description: t("auth.login.success.description"),
            variant: "default",
          });

          // Get redirect info from URL
          const redirectParam = new URL(window.location.href).searchParams.get(
            "redirectTo",
          );
          const redirectTo: Route = (redirectParam ||
            `/${locale}/`) satisfies Route;

          logger.debug("auth.login.refetch.start");
          // Refetch user data after successful login
          await refetch();
          logger.debug("auth.login.refetch.success");

          // Navigate immediately - the new page will handle user data fetching
          // Remove router.refresh() to prevent re-render loop
          logger.debug("auth.login.redirect", { redirectTo });
          router.push(redirectTo);
        } catch (error) {
          logger.error("auth.login.process.failed", error);
          toast({
            title: t("auth.login.errors.title"),
            description: t("authErrors.login.form.error.unknown.description"),
            variant: "destructive",
          });
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

  // Extract response values to avoid complex union types in useMemo
  const responseSuccess = formResult.response?.success;
  const hasError = responseSuccess === false;

  // Use type narrowing to extract error details
  let responseMessage: TranslationKey | null = null;
  let responseMessageParams: TParams | undefined;
  if (hasError && formResult.response) {
    responseMessage = formResult.response.message as TranslationKey;
    responseMessageParams = formResult.response.messageParams;
  }

  // Generate alert state from error/success states
  // Use JSON.stringify for complex objects to avoid union type complexity issues
  const responseMessageParamsKey = responseMessageParams
    ? JSON.stringify(responseMessageParams)
    : null;

  const alert = useMemo((): FormAlertState | null => {
    // Check for account locked state
    if (isAccountLocked) {
      return {
        variant: "destructive" as const,
        title: {
          message: "auth.login.errors.accountLocked" as TranslationKey,
        },
        message: {
          message:
            "auth.login.errors.accountLockedDescription" as TranslationKey,
        },
      };
    }

    // Check for form submission error (prioritize this over errorMessage)
    if (responseSuccess === false && responseMessage) {
      return {
        variant: "destructive" as const,
        title: {
          message: "auth.login.errors.title" as TranslationKey,
        },
        message: {
          message: responseMessage,
          messageParams: responseMessageParams,
        },
      };
    }

    // Check for error message
    if (errorMessage) {
      return {
        variant: "destructive" as const,
        title: {
          message: "auth.login.errors.title" as TranslationKey,
        },
        message: {
          message: errorMessage,
        },
      };
    }

    return null;
  }, [
    isAccountLocked,
    errorMessage,
    responseMessage,
    responseMessageParamsKey,
    responseSuccess,
  ]);

  return {
    form: formResult.form,
    response: formResult.response,
    isSubmitSuccessful: formResult.isSubmitSuccessful,
    submitError: formResult.submitError,
    isSubmitting: formResult.isSubmitting,
    submitForm: formResult.submitForm,
    clearSavedForm: formResult.clearSavedForm,
    setErrorType: formResult.setErrorType,
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
