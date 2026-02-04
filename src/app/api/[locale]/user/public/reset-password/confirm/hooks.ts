/**
 * Hooks for password reset confirmation functionality
 */

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { FormAlertState } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import type {
  ApiFormReturn,
  SubmitFormFunction,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/types";
import { useApiForm } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation-form";
import { useTranslation } from "@/i18n/core/client";

import type { ResetPasswordValidateGetResponseOutput } from "../validate/definition";
import type {
  ResetPasswordConfirmPostRequestOutput,
  ResetPasswordConfirmPostResponseOutput,
} from "./definition";
import resetPasswordConfirmEndpoints from "./definition";
import type { JwtPayloadType } from "../../../auth/types";

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
  tokenValidationResponse: ResponseType<ResetPasswordValidateGetResponseOutput>,
  logger: EndpointLogger,
  user: JwtPayloadType,
): {
  form: ApiFormReturn<
    (typeof resetPasswordConfirmEndpoints.POST)["types"]["RequestOutput"],
    (typeof resetPasswordConfirmEndpoints.POST)["types"]["ResponseOutput"],
    (typeof resetPasswordConfirmEndpoints.POST)["types"]["UrlVariablesOutput"]
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
    user,
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
      persistForm: false, // Disable persistence to avoid conflicts with old data structure
    },
    {
      onSuccess: () => {
        setIsSuccess(true);

        toast({
          title: t("app.api.user.public.resetPassword.confirm.success.title"),
          description: t(
            "app.api.user.public.resetPassword.confirm.success.password_reset",
          ),
          variant: "default",
        });
      },
      onError: ({ error }) => {
        toast({
          title: t("app.api.user.public.resetPassword.confirm.errors.title"),
          description: t(error.message, error.messageParams),
          variant: "destructive",
        });
      },
    },
  );

  // Generate alert state from error/success states
  const alert = useMemo((): FormAlertState | null => {
    // Check for token error
    if (!tokenValidationResponse.success) {
      return {
        variant: "destructive",
        title: {
          message: "app.api.user.public.resetPassword.confirm.errors.title",
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
          message: "app.api.user.public.resetPassword.confirm.errors.title",
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
          message: "app.api.user.public.resetPassword.confirm.success.title",
        },
        message: {
          message:
            "app.api.user.public.resetPassword.confirm.success.password_reset",
        },
      };
    }

    return null;
  }, [formResult.submitError, isSuccess, tokenValidationResponse]);
  const passwordValue = formResult.form.watch("newPassword.password");

  // Extract token error to avoid complex union types
  const tokenIsValid = tokenValidationResponse.success;
  const tokenError = tokenIsValid
    ? ""
    : (tokenValidationResponse.message as string) ||
      "app.api.user.auth.reset.errors.token_invalid";

  return {
    form: formResult.form,
    submitForm: formResult.submitForm,
    isSubmitting: formResult.isSubmitting,
    isSuccess,
    submitError: formResult.submitError ?? null,
    passwordValue,
    tokenError,
    tokenValid: tokenIsValid,
    alert,
  };
}
