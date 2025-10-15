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
import type { StandardUserType } from "../user/definition";
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
  user: StandardUserType | undefined,
): EndpointReturn<typeof definitions> {
  // Get the base endpoint
  const formResult = useContactEndpoint(logger);

  // Use lead ID hook with callback to set lead ID in form
  useLeadId((leadId: string) => {
    if (formResult.create?.form) {
      formResult.create.form.setValue("leadId", leadId);
    }
  });

  // Set default values based on user data
  useEffect(() => {
    if (user && formResult.create) {
      const form = formResult.create.form;

      // Set default values if they're not already set
      // Use privateName (user's private name) for the name field
      if (!form.getValues("name") && user.privateName) {
        form.setValue("name", user.privateName);
      }
      if (!form.getValues("email") && user.email) {
        form.setValue("email", user.email);
      }
      // Note: company field is optional in contact form and not part of user type
      // If needed, this should be sourced from business data or lead information
      if (!form.getValues("subject")) {
        form.setValue("subject", ContactSubject.HELP_SUPPORT);
      }
    }
  }, [user, formResult.create]);

  return formResult;
}
