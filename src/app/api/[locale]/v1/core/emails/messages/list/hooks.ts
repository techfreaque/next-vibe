/**
 * Email Messages List Hooks
 * React hooks for listing email messages
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for listing email messages
 */
export function useEmailMessagesList(
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

export type EmailMessagesListEndpointReturn = EndpointReturn<
  typeof definitions
>;
