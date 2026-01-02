/**
 * SMTP Account Create Hooks
 * React hooks for creating SMTP accounts
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for creating SMTP accounts
 */
export function useSmtpAccountCreate(logger: EndpointLogger): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useSmtpAccountCreateEndpoint = useSmtpAccountCreate;

export type SmtpAccountCreateEndpointReturn = EndpointReturn<typeof definitions>;
