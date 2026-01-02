/**
 * Characters Hooks
 * React hooks for character list and create operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { DEFAULT_CHARACTERS } from "./config";
import definitions from "./definition";

/**
 * Hook for fetching characters list (default + custom)
 *
 * Features:
 * - Returns all default characters from config
 * - Returns user's custom characters from database
 * - Automatically merges both lists
 */
export function useCharactersList(logger: EndpointLogger): EndpointReturn<typeof definitions> {
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
 * Hook for creating new custom characters
 *
 * Features:
 * - Form handling for character creation
 * - System prompt customization
 * - Category and icon selection
 * - Auto-refetches character list on success
 */
export function useCreateCharacter(logger: EndpointLogger): EndpointReturn<typeof definitions> {
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
 * Hook for getting default characters only
 *
 * Returns the default character configurations from config file
 * These characters are always available and don't require database queries
 *
 * @returns Array of default character configurations
 */
export function useDefaultCharacters(): typeof DEFAULT_CHARACTERS {
  return DEFAULT_CHARACTERS;
}
export type CharactersListEndpointReturn = EndpointReturn<typeof definitions>;
