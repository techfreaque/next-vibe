import { useRouter } from "next/navigation";
import { useToast } from "next-vibe-ui//hooks/use-toast";
import { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import { authClientRepository } from "../../auth/repository-client";
import { useUser } from "../../private/me/hooks";
import signupEndpoints from "./definition";

type SignupFormReturn = EndpointReturn<typeof signupEndpoints> & {
  logger: ReturnType<typeof createEndpointLogger>;
};

/**
 * Hook for registration functionality with email checking
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

  const endpointResult = useEndpoint(
    signupEndpoints,
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
        consent: {
          acceptTerms: false,
          subscribeToNewsletter: false,
        },
        advanced: {
          leadId: undefined,
        },
      },
      queryOptions: {
        requestData: emailToCheck ? { email: emailToCheck } : undefined,
        enabled: !!emailToCheck && emailToCheck.includes("@") && emailToCheck.includes("."),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      persistForm: false, // Disable persistence to avoid conflicts with old data structure
    },
    logger,
  );

  // Handle success callback for additional logic (token management, redirects)
  if (endpointResult.create?.isSuccess) {
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
      return {
        ...endpointResult,
        logger,
        checkEmail: setEmailToCheck,
      };
    }

    // Show success message (alert is handled by useEndpoint)
    toast({
      title: t("app.api.v1.core.user.public.signup.success.title"),
      description: t(
        "app.api.v1.core.user.public.signup.success.description",
      ),
      variant: "default",
    });

    // Redirect
    router.push(`/${locale}/subscription`);
    // Force a refresh to update the UI with the new auth state
    refetch();
    router.refresh();
  }

  return {
    ...endpointResult,
    logger,
    checkEmail: setEmailToCheck,
  };
}
