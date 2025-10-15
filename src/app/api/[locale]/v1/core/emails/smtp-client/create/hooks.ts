/**
 * SMTP Account Create Hooks
 * React hooks for creating SMTP accounts
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for creating SMTP accounts
 */
export function useSmtpAccountCreate(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions.POST> {
  return useEndpoint(
    definitions.POST,
    {
      persistForm: false,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useSmtpAccountCreateEndpoint = useSmtpAccountCreate;

export type SmtpAccountCreateEndpointReturn = EndpointReturn<
  typeof definitions.POST
>;
