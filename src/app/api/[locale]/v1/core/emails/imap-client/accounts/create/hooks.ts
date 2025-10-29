/**
 * IMAP Account Create Hooks
 * React hooks for creating IMAP accounts
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for creating IMAP accounts
 */
export function useImapAccountCreate(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useImapAccountCreateEndpoint = useImapAccountCreate;

export type ImapAccountCreateEndpointReturn = EndpointReturn<
  typeof definitions
>;
