/**
 * Hooks for password reset confirmation functionality
 */

import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import type {
  ErrorResponseType,
  MessageResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui/ui";
import { useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type {
  FormAlertState,
  SubmitFormFunction,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { useTranslation } from "@/i18n/core/client";

import type { 
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput 
} from "./definition";
import resetPasswordConfirmEndpoints from "./definition";

/**
 * Hook for confirming a password reset
 *
 * This hook provides a form and submission handler for confirming a password reset.
 * It handles form validation, submission, and error handling.
 *
 * Features:
 * - Form validation using Zod schema
 * - Password matching validation
 * - Toast notifications for success and error states
 * - Detailed error handling with specific error types
 * - Automatic redirection to login page on success
 *
 * @param token - The password reset token from the URL
 * @param tokenValidationResponse - Response from token validation
 * @param logger - Endpoint logger for tracking operations
 * @returns Enhanced form and submission handler for confirming a password reset
 */
export function useResetPasswordConfirm(
  token: string,
  tokenValidationResponse: ResponseType<string>,
  logger: EndpointLogger,
): {
  form: ApiFormReturn<
    (typeof resetPasswordConfirmEndpoints.POST)["TRequestOutput"],
    (typeof resetPasswordConfirmEndpoints.POST)["TResponseOutput"],
    (typeof resetPasswordConfirmEndpoints.POST)["TUrlVariablesOutput"]
  >["form"];
  submitForm: SubmitFormFunction<
    ResetPasswordConfirmPostRequestOutput,
    ResetPasswordConfirmPostResponseOutput,
    never
  >;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: ErrorResponseType | null;
  passwordValue: string;
  tokenError: string;
  tokenValid: boolean | null;
  alert: FormAlertState | null;
} {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const formResult = useApiForm(
    resetPasswordConfirmEndpoints.POST,
    logger,
    {
      defaultValues: {
        verification: {
          email: "",
          token,
        },
        newPassword: {
          password: "",
          confirmPassword: "",
        },
      },
    },
    {
      onSuccess: () => {
        setIsSuccess(true);

        toast({
          title: t("auth.resetPassword.success.title"),
          description: t("auth.resetPassword.success.password_reset"),
          variant: "default",
        });
      },
      onError: ({ error }) => {
        toast({
          title: t("auth.resetPassword.errors.title"),
          description: t(error.message, error.messageParams),
          variant: "destructive",
        });
      },
    },
  );

  // Generate alert state from error/success states
  const alert: FormAlertState | null = useMemo(() => {
    // Check for token error
    if (!tokenValidationResponse.success) {
      return {
        variant: "destructive",
        title: {
          message: "auth.resetPassword.errors.title",
        },
        message: {
          message: tokenValidationResponse.message,
          messageParams: tokenValidationResponse.messageParams,
        },
      };
    }

    // Check for form submission error
    if (formResult.submitError) {
      return {
        variant: "destructive",
        title: {
          message: "auth.resetPassword.errors.title",
        },
        message: {
          message: formResult.submitError.message,
          messageParams: formResult.submitError.messageParams,
        },
      };
    }

    // Check for success state
    if (isSuccess) {
      return {
        variant: "success",
        title: {
          message: "auth.resetPassword.success.title",
        },
        message: {
          message: "auth.resetPassword.success.password_reset",
        },
      };
    }

    return null;
  }, [formResult.submitError, isSuccess, tokenValidationResponse]);
  const passwordValue = formResult.form.watch("newPassword.password");

  return {
    form: formResult.form,
    submitForm: formResult.submitForm,
    isSubmitting: formResult.isSubmitting,
    isSuccess,
    submitError: formResult.submitError ?? null,
    passwordValue,
    tokenError: tokenValidationResponse.success
      ? ""
      : tokenValidationResponse.message || "auth.reset.errors.token_invalid",
    tokenValid: tokenValidationResponse.success,
    alert,
  };
}
