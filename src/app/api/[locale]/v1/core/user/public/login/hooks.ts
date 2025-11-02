/**
 * Login API Hooks
 *
 * Hooks for interacting with the Login API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { useToast } from "next-vibe-ui//hooks/use-toast";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { type EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn, FormAlertState } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
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

type LoginFormReturn = EndpointReturn<typeof loginEndpoints> & {
  emailForOptions: string | null;
  handleEmailChange: (email: string | undefined) => void;
  handleEmailFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: { onChange: (e: ChangeEvent<HTMLInputElement>) => void },
  ) => void;
  errorMessage: TranslationKey | null;
  isAccountLocked: boolean;
  loginOptions: LoginOptions;
};

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
): LoginFormReturn {
  const { toast } = useToast();
  const router = useRouter();
  useUser(logger); // Keep user state in sync
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

  const endpointResult = useEndpoint(
    loginEndpoints,
    {
      defaultValues: {
        credentials: {
          email: "",
          password: "",
        },
        options: {
          rememberMe: false,
        },
      },
      persistForm: false,
    },
    logger,
  );

  // Handle success callback for additional logic (token management, redirects)
  if (endpointResult.create?.isSuccess) {
    try {
      logger.debug("app.api.v1.core.user.public.login.onSuccess.start", {
        data: endpointResult.create.response,
      });

      // Set the auth status to indicate successful login
      // No need to clear first since the server has already set the httpOnly cookie
      const tokenResult = authClientRepository.setAuthStatus(logger);
      if (!tokenResult.success) {
        logger.error("app.api.v1.core.user.public.login.token.save.failed");
        toast({
          title: t("app.api.v1.core.user.public.login.errors.title"),
          description: t(
            "app.api.v1.core.user.public.login.errors.token_save_failed",
          ),
          variant: "destructive",
        });
        return { ...endpointResult, emailForOptions, handleEmailChange, handleEmailFieldChange, errorMessage, isAccountLocked, loginOptions };
      }
      logger.debug("app.api.v1.core.user.public.login.token.save.success");

      // Show success message (alert is handled by useEndpoint)
      toast({
        title: t("app.api.v1.core.user.public.login.success.title"),
        description: t(
          "app.api.v1.core.user.public.login.success.description",
        ),
        variant: "default",
      });

      // Get redirect info from URL
      const redirectParam = new URL(window.location.href).searchParams.get(
        "redirectTo",
      );
      const redirectTo: Route = (redirectParam ||
        `/${locale}/`) satisfies Route;

      // Set auth status to enable user query on the next page
      const authStatusResult = authClientRepository.setAuthStatus(logger);
      if (!authStatusResult.success) {
        logger.error("user.auth.status.set.failed", {
          message: authStatusResult.message,
          errorCode: authStatusResult.errorType.errorCode,
        });
      }

      // Navigate immediately - the new page will handle user data fetching
      logger.debug("app.api.v1.core.user.public.login.redirect", {
        redirectTo,
      });
      router.push(redirectTo);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.public.login.process.failed",
        parseError(error),
      );
      toast({
        title: t("app.api.v1.core.user.public.login.errors.title"),
        description: t(
          "app.api.v1.core.user.public.login.errors.auth_error",
        ),
        variant: "destructive",
      });
    }
  }

  // Handle error callback for setting error message
  if (endpointResult.error) {
    setErrorMessage(endpointResult.error.message);
    // Toast is handled by useEndpoint alert
  }

  // Generate alert state from error/success states and account locked state
  const alert = useMemo((): FormAlertState | null => {
    // Check for account locked state (takes priority)
    if (isAccountLocked) {
      return {
        variant: "destructive" as const,
        title: {
          message: "app.api.v1.core.user.public.login.errors.accountLocked",
        },
        message: {
          message:
            "app.api.v1.core.user.public.login.errors.accountLockedDescription",
        },
      };
    }

    // Use the alert from useEndpoint, but override with account locked if needed
    return endpointResult.alert;
  }, [endpointResult.alert, isAccountLocked]);

  return {
    ...endpointResult,
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
