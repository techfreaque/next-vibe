import { parseError } from "next-vibe/shared/utils";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useCallback, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type {
  UseEndpointMutationOptions,
  UseEndpointOptions,
  EndpointReturn,
} from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import { useUser } from "../../private/me/hooks";
import signupEndpoints from "./definition";
import { type ApiInferMutationOptions } from "../../../system/unified-interface/react/hooks/types";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import definitions from "@/app/api/[locale]/credits/definition";

type SignupFormReturn = EndpointReturn<typeof signupEndpoints> & {
  logger: ReturnType<typeof createEndpointLogger>;
};

/**
 * Hook for registration functionality with email checking
 * Uses operation-specific options and success/error callbacks
 * @returns Registration form, email checking, and submission handling with enhanced error typing
 */
export function useRegister(): SignupFormReturn & {
  checkEmail: (email: string | null) => void;
} {
  const { toast } = useToast();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { refetch } = useUser(
    createEndpointLogger(
      (envClient.NODE_ENV as string) === "development",
      Date.now(),
      locale,
    ),
  );

  // Initialize logger for client-side operations
  const logger = createEndpointLogger(
    (envClient.NODE_ENV as string) === "development",
    Date.now(),
    locale,
  );

  // Email checking state
  const [emailToCheck, setEmailToCheck] = useState<string | null>(null);

  // Success callback for signup
  const handleSignupSuccess: ApiInferMutationOptions<
    typeof signupEndpoints.POST
  >["onSuccess"] = useCallback(
    async (
      data: Parameters<
        NonNullable<
          ApiInferMutationOptions<typeof signupEndpoints.POST>["onSuccess"]
        >
      >[0],
    ) => {
      // Clear lead tracking data on successful signup
      logger.info("app.api.user.public.signup.success.processing");

      // Clear referral code from localStorage after successful signup
      localStorage.removeItem("referralCode");

      // Server has already set httpOnly cookie - no client-side auth status needed

      // Invalidate credits queries to trigger refetch with new auth state
      await apiClient.refetchEndpoint(definitions.GET, logger);

      // Show success message (alert is handled by useEndpoint)
      toast({
        title: t("app.api.user.public.signup.success.title"),
        description: t("app.api.user.public.signup.success.description"),
        variant: "default",
      });

      // Redirect
      router.push(`/${locale}/subscription`);
      // Force a refresh to update the UI with the new auth state
      refetch();
      router.refresh();
    },
    [logger, toast, t, router, locale, refetch],
  );

  // Error callback for signup
  const handleSignupError: ApiInferMutationOptions<
    typeof signupEndpoints.POST
  >["onError"] = useCallback(
    async (
      data: Parameters<
        NonNullable<
          ApiInferMutationOptions<typeof signupEndpoints.POST>["onError"]
        >
      >[0],
    ) => {
      logger.error("app.api.user.public.signup.error", parseError(data.error));
    },
    [logger],
  );

  const endpointResult = useEndpoint(
    signupEndpoints,
    {
      // Read options for email availability checking
      read: {
        queryOptions: {
          enabled:
            !!emailToCheck &&
            emailToCheck.includes("@") &&
            emailToCheck.includes("."),
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
        initialState: emailToCheck ? { email: emailToCheck } : undefined,
      },
      // Create options for signup
      create: {
        formOptions: {
          persistForm: false, // Disable persistence to avoid conflicts with old data structure
          defaultValues: {
            personalInfo: {
              privateName: "",
              publicName: "",
              email: "",
            },
            security: {
              password: "",
              confirmPassword: "",
            },
            consent: {
              acceptTerms: false,
              subscribeToNewsletter: false,
            },
            advanced: {
              leadId: undefined,
            },
          },
        },
        mutationOptions: {
          onSuccess: handleSignupSuccess,
          onError: handleSignupError,
        },
      },
    },
    logger,
  );

  return {
    ...endpointResult,
    logger,
    checkEmail: setEmailToCheck,
  };
}
