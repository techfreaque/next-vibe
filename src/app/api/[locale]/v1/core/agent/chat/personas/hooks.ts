/**
 * Personas Hooks
 * React hooks for persona list and create operations
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import { DEFAULT_PERSONAS } from "./config";
import definitions from "./definition";

/**
 * Hook for fetching personas list (default + custom)
 *
 * Features:
 * - Returns all default personas from config
 * - Returns user's custom personas from database
 * - Automatically merges both lists
 */
export function usePersonasList(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000, // 60 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for creating new custom personas
 *
 * Features:
 * - Form handling for persona creation
 * - System prompt customization
 * - Category and icon selection
 * - Auto-refetches persona list on success
 */
export function useCreatePersona(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: false,
      },
    },
    logger,
  );
}

/**
 * Hook for getting default personas only
 *
 * Returns the default persona configurations from config file
 * These personas are always available and don't require database queries
 *
 * @returns Array of default persona configurations
 */
export function useDefaultPersonas(): typeof DEFAULT_PERSONAS {
  return DEFAULT_PERSONAS;
}
export type PersonasListEndpointReturn = EndpointReturn<typeof definitions>;
