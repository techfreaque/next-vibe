import { useRouter } from "next/navigation";
import { useToast } from "next-vibe-ui/ui";
import { useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type {
  FormAlertState,
  InferApiFormReturn,
  InferApiQueryReturn,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation-form";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";
import { useTranslation } from "@/i18n/core/client";
import { envClient } from "@/config/env-client";
import { LeadTrackingClientRepository } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
import { useLeadId } from "@/app/api/[locale]/v1/core/leads/tracking/engagement/hooks";

import { authClientRepository } from "../../auth/repository-client";
import { PreferredContactMethod } from "../../enum";
import { useUser } from "../../private/me/hooks";
import signupEndpoints from "./definition";
import { SignupType } from "./enum";

/**
 * Hook for registration functionality
 * @returns Registration form and submission handling with enhanced error typing
 */
export function useRegister(): InferApiFormReturn<
  typeof signupEndpoints.POST
> & {
  alert: FormAlertState | null;
} {
  const { toast } = useToast();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { refetch } = useUser(createEndpointLogger(
    envClient.NODE_ENV === "development",
    Date.now(),
    locale,
  ));
  
  // Initialize logger for client-side operations
  const logger = createEndpointLogger(
    envClient.NODE_ENV === "development",
    Date.now(),
    locale,
  );

  const formResult = useApiForm(
    signupEndpoints.POST,
    logger,
    {
      defaultValues: {
        personalInfo: {
          firstName: "",
          lastName: "",
          email: "",
        },
        security: {
          password: "",
          confirmPassword: "",
        },
        businessInfo: {
          company: "",
          phone: "",
        },
        preferences: {
          preferredContactMethod: PreferredContactMethod.EMAIL,
          signupType: SignupType.PRICING,
        },
        consent: {
          acceptTerms: false,
          subscribeToNewsletter: false,
        },
        advanced: {
          imageUrl: "",
          leadId: LeadTrackingClientRepository.LOADING_LEAD_ID,
        },
      },
    },
    {
      onSuccess: async () => {
        // Clear lead tracking data on successful signup
        logger.info("auth.signup.success.processing");

        const setTokenResponse = authClientRepository.setAuthStatus(logger);
        if (!setTokenResponse.success) {
          toast({
            title: t("auth.signup.errors.title"),
            description: t("authClient.errors.token_save_failed"),
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t("auth.signup.success.title"),
          description: t("auth.signup.success.description"),
          variant: "default",
        });

        // Redirect
        if (
          formResult.form.getValues("preferences.signupType") ===
          SignupType.MEETING
        ) {
          router.push(`/${locale}/app/onboarding?step=consultation`);
        } else {
          router.push(`/${locale}/app/onboarding?step=pricing`);
        }

        // Force a refresh to update the UI with the new auth state
        await refetch();
        router.refresh();
      },
      onError: ({ error }) => {
        toast({
          title: t("auth.signup.errors.title"),
          description: t(error.message, error.messageParams),
          variant: "destructive",
        });
      },
    },
  );

  // Use lead ID hook with callback to set lead ID in form
  useLeadId((leadId) => {
    formResult.form.setValue("advanced.leadId", leadId);
  });

  // Generate alert state from error/success states
  const alert: FormAlertState | null = useMemo(() => {
    // Check for success state first
    if (formResult.response?.success) {
      return {
        variant: "success",
        title: {
          message: "auth.signup.success.title",
        },
        message: {
          message: "auth.signup.success.description",
        },
      };
    }

    // Check for form submission error
    if (formResult.response?.success === false) {
      return {
        variant: "destructive",
        title: {
          message: "auth.signup.errors.title",
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
    envClient.NODE_ENV === "development",
    Date.now(),
    locale,
  );

  return useApiQuery({
    endpoint: signupEndpoints.GET,
    logger,
    options: {
      // Don't refetch unnecessarily
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!email && email.includes("@") && email.includes("."),
      onError: ({ error }: { error: { message: string } }) => {
        toast({
          title: t("auth.signup.errors.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });
}
