/**
 * Password Reset Request API Hooks
 *
 * Hooks for interacting with the Password Reset Request API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { FormAlertState } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-api-mutation-form";
import { useTranslation } from "@/i18n/core/client";

import resetPasswordRequestEndpoint from "./definition";

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for requesting a password reset
 *
 * This hook provides a form and submission handler for requesting a password reset.
 * It handles form validation, submission, and error handling.
 *
 * Features:
 * - Form validation using Zod schema
 * - Toast notifications for success and error states
 * - Detailed error handling with specific error types
 * - Loading state tracking
 * - Redirect handling after success
 *
 * @param logger - Endpoint logger for tracking operations
 * @returns Enhanced form and submission handler for requesting a password reset
 */
export function useResetPasswordRequest(logger: EndpointLogger): ApiFormReturn<
  (typeof resetPasswordRequestEndpoint.POST)["TRequestOutput"],
  (typeof resetPasswordRequestEndpoint.POST)["TResponseOutput"],
  (typeof resetPasswordRequestEndpoint.POST)["TUrlVariablesOutput"]
> & {
  isSuccess: boolean;
  alert: FormAlertState | null;
} {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const formResult = useApiForm(
    resetPasswordRequestEndpoint.POST,
    logger,
    {
      defaultValues: {
        emailInput: {
          email: "",
        },
      },
      persistForm: false, // Disable persistence to avoid conflicts with old data structure
    },
    {
      onSuccess: () => {
        setIsSuccess(true);

        toast({
          title: t(
            "app.api.v1.core.user.public.resetPassword.request.success.title",
          ),
          description: t(
            "app.api.v1.core.user.public.resetPassword.request.response.success.message",
          ),
          variant: "default",
        });
      },
      onError: ({ error }) => {
        toast({
          title: t(
            "app.api.v1.core.user.public.resetPassword.request.errors.title",
          ),
          description: t(error.message),
          variant: "destructive",
        });
      },
    },
  );

  // Generate alert state for success
  const alert: FormAlertState | null = useMemo(() => {
    if (isSuccess) {
      return {
        variant: "success",
        title: {
          message:
            "app.api.v1.core.user.public.resetPassword.request.success.title",
        },
        message: {
          message:
            "app.api.v1.core.user.public.resetPassword.request.success.description",
        },
      };
    }

    // Check for form submission error
    if (formResult.response && !formResult.response.success) {
      return {
        variant: "destructive",
        title: {
          message:
            "app.api.v1.core.user.public.resetPassword.request.errors.title",
        },
        message: {
          message: formResult.response.message,
          messageParams: formResult.response.messageParams,
        },
      };
    }

    return null;
  }, [isSuccess, formResult.response]);

  return {
    ...formResult,
    isSuccess,
    alert,
  };
}
