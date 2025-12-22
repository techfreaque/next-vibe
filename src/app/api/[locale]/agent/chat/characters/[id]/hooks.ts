/**
 * Single Character Hooks
 * React hooks for single character operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching a single character by ID
 *
 * Features:
 * - Fetches default or custom character
 * - Returns full character details
 */
export function useCharacter(
  characterId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: !!characterId,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      urlPathParams: { id: characterId },
    },
    logger,
  );
}

/**
 * Hook for updating a custom character
 *
 * Features:
 * - Updates custom character fields
 * - Only works for custom characters (UUIDs)
 * - Auto-refetches character list on success
 */
export function useUpdateCharacter(
  characterId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      formOptions: {
        persistForm: false,
      },
      urlPathParams: { id: characterId },
    },
    logger,
  );
}

export type CharacterEndpointReturn = EndpointReturn<typeof definitions>;
