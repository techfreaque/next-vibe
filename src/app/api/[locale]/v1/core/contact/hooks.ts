/**
 * Contact API Hooks
 * Provides React hooks for interacting with the contact API using modern useEndpoint pattern
 */

"use client";

import { useEffect } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import { useLeadId } from "../leads/tracking/engagement/hooks";
import type { CompleteUserType } from "../user/definition";
import definitions from "./definition";
import { ContactSubject } from "./enum";

/**
 * Hook for contact form with modern useEndpoint pattern
 */
export function useContactEndpoint(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: params?.enabled !== false,
        refetchOnWindowFocus: false,
        staleTime: 0, // Don't cache contact form submissions
      },
      formOptions: {
        persistForm: false, // Don't persist contact forms
        persistenceKey: "contact-form",
      },
    },
    logger,
  );
}

/**
 * Hook for contact form with lead ID tracking
 */
export function useContactWithEngagement(
  logger: EndpointLogger,
  user?: CompleteUserType,
): EndpointReturn<typeof definitions> {
  // Get the base endpoint
  const formResult = useContactEndpoint(logger);

  // Use lead ID hook with callback to set lead ID in form
  useLeadId(formResult.create?.form.setValue);

  // Set default values based on user data
  useEffect(() => {
    if (user && formResult.create) {
      const form = formResult.create.form;

      // Set default values if they're not already set
      if (!form.getValues("name") && user.firstName && user.lastName) {
        form.setValue("name", `${user.firstName} ${user.lastName}`);
      }
      if (!form.getValues("email") && user.email) {
        form.setValue("email", user.email);
      }
      if (!form.getValues("company") && user.company) {
        form.setValue("company", user.company);
      }
      if (!form.getValues("subject")) {
        form.setValue("subject", ContactSubject.HELP_SUPPORT);
      }
    }
  }, [user, formResult.create]);

  return formResult;
}
