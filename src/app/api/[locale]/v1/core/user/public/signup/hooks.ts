import { useRouter } from "next/navigation";
import { useToast } from "next-vibe-ui/ui";
import { useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type {
  FormAlertState,
  InferApiQueryReturn,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import type { ApiFormReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/types";
import {
  useApiForm,
  useApiQuery,
} from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import { authClientRepository } from "../../auth/repository-client";
import { useUser } from "../../private/me/hooks";
import signupEndpoints from "./definition";
import { SignupType } from "./enum";

type SignupFormReturn = ApiFormReturn<
  typeof signupEndpoints.POST.TRequestOutput,
  typeof signupEndpoints.POST.TResponseOutput,
  typeof signupEndpoints.POST.TUrlVariablesOutput
> & {
  alert: FormAlertState | null;
  logger: ReturnType<typeof createEndpointLogger>;
};

/**
 * Hook for registration functionality
 * @returns Registration form and submission handling with enhanced error typing
 */
export function useRegister(): SignupFormReturn {
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

  const formResult = useApiForm(
    signupEndpoints.POST,
    logger,
    {
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
        preferences: {
          signupType: SignupType.PRICING,
        },
        consent: {
          acceptTerms: false,
          subscribeToNewsletter: false,
        },
        advanced: {
          leadId: undefined,
        },
      },
      persistForm: false, // Disable persistence to avoid conflicts with old data structure
    },
    {
      onSuccess: async () => {
        // Clear lead tracking data on successful signup
        logger.info("app.api.v1.core.user.public.signup.success.processing");

        const setTokenResponse = authClientRepository.setAuthStatus(logger);
        if (!setTokenResponse.success) {
          toast({
            title: t("app.api.v1.core.user.public.signup.errors.title"),
            description: t(
              "app.api.v1.core.user.public.login.errors.token_save_failed",
            ),
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t("app.api.v1.core.user.public.signup.success.title"),
          description: t(
            "app.api.v1.core.user.public.signup.success.description",
          ),
          variant: "default",
        });

        // Redirect
        if (
          formResult.form.getValues("preferences.signupType") ===
          SignupType.MEETING
        ) {
          router.push(`/${locale}/?step=consultation`);
        } else {
          router.push(`/${locale}/?step=pricing`);
        }

        // Force a refresh to update the UI with the new auth state
        await refetch();
        router.refresh();
      },
      onError: ({ error }) => {
        toast({
          title: t("app.api.v1.core.user.public.signup.errors.title"),
          description: t(error.message, error.messageParams),
          variant: "destructive",
        });
      },
    },
  );

  // Generate alert state from error/success states
  const alert: FormAlertState | null = useMemo(() => {
    // Check for success state first
    if (formResult.response?.success) {
      return {
        variant: "success",
        title: {
          message: "app.api.v1.core.user.public.signup.success.title",
        },
        message: {
          message: "app.api.v1.core.user.public.signup.success.description",
        },
      };
    }

    // Check for form submission error
    if (formResult.response?.success === false) {
      return {
        variant: "destructive",
        title: {
          message: "app.api.v1.core.user.public.signup.errors.title",
        },
        message: {
          message: formResult.response.message,
          messageParams: formResult.response.messageParams,
        },
      };
    }

    return null;
  }, [formResult.response]);

  return {
    ...formResult,
    alert,
    logger,
  };
}

/**
 * Hook to check if an email is already registered
 * @param email - Email to check
 * @returns Query result with exists flag
 */
export function useEmailCheck(
  email?: string,
): InferApiQueryReturn<typeof signupEndpoints.GET> {
  const { toast } = useToast();
  const { t, locale } = useTranslation();

  // Initialize logger for client-side operations
  const logger = createEndpointLogger(
    (envClient.NODE_ENV as string) === "development",
    Date.now(),
    locale,
  );

  return useApiQuery({
    endpoint: signupEndpoints.GET,
    requestData: { email: email || "" },
    logger,
    options: {
      // Don't refetch unnecessarily
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!email && email.includes("@") && email.includes("."),
      onError: ({ error }) => {
        toast({
          title: t("app.api.v1.core.user.public.signup.errors.title"),
          description: t(error.message),
          variant: "destructive",
        });
      },
    },
  });
}
