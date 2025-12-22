/**
 * Contact API Hooks
 * Provides React hooks for interacting with the contact API using modern useEndpoint pattern
 */

"use client";

import { useEffect } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { StandardUserType } from "../user/types";
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
 * Hook for contact form with user data pre-fill
 * Server gets leadId from JWT payload (user.leadId)
 */
export function useContactWithEngagement(
  logger: EndpointLogger,
  user: StandardUserType | undefined,
): EndpointReturn<typeof definitions> {
  // Get the base endpoint
  const formResult = useContactEndpoint(logger);

  // Set default values based on user data
  useEffect(() => {
    if (formResult.create) {
      const form = formResult.create.form;

      // Set default subject value for all users (required field)
      if (!form.getValues("subject")) {
        form.setValue("subject", ContactSubject.HELP_SUPPORT);
      }

      // Set user-specific values if logged in
      if (user) {
        // Use privateName (user's private name) for the name field
        if (!form.getValues("name") && user.privateName) {
          form.setValue("name", user.privateName);
        }
        if (!form.getValues("email") && user.email) {
          form.setValue("email", user.email);
        }
      }
    }
  }, [user, formResult.create]);

  return formResult;
}
