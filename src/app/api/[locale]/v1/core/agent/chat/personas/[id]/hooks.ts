/**
 * Single Persona Hooks
 * React hooks for single persona operations (get, update, delete)
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching a single persona by ID
 *
 * Features:
 * - Fetches default or custom persona
 * - Returns full persona details
 */
export function usePersona(
  personaId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: !!personaId,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      urlParams: { id: personaId },
    },
    logger,
  );
}

/**
 * Hook for updating a custom persona
 *
 * Features:
 * - Updates custom persona fields
 * - Only works for custom personas (UUIDs)
 * - Auto-refetches persona list on success
 */
export function useUpdatePersona(
  personaId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: false,
      },
      urlParams: { id: personaId },
    },
    logger,
  );
}

export type PersonaEndpointReturn = EndpointReturn<typeof definitions>;
