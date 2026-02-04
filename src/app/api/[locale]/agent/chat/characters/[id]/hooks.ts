/**
 * Single Character Hooks
 * React hooks for single character operations (get, update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
  user: JwtPayloadType,
  logger: EndpointLogger,
): CharacterEndpointReturn {
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
    user,
  );
}

export type CharacterEndpointReturn = EndpointReturn<typeof definitions>;
