/**
 * Single Character Hooks
 * React hooks for single character operations (get, update, delete)
 */

"use client";

import { useMemo } from "react";

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
  characterId: string | undefined,
  user: JwtPayloadType,
  logger: EndpointLogger,
): CharacterEndpointReturn {
  const options = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: !!characterId,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
        ...(characterId ? { urlPathParams: { id: characterId } } : {}),
      },
    }),
    [characterId],
  );
  return useEndpoint(definitions, options, logger, user);
}

export type CharacterEndpointReturn = EndpointReturn<typeof definitions>;
