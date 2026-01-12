/**
 * Characters Hooks
 * React hooks for character operations and model selection
 */

"use client";

import { useMemo } from "react";

import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CharacterGetResponseOutput } from "./[id]/definition";
import definitions from "./definition";
import { CharactersRepositoryClient } from "./repository-client";

/**
 * Hook to fetch all characters (default + custom)
 * - All users use API (endpoint is public)
 * - Public users: read-only access to defaults
 * - Authenticated users: can create/edit custom characters
 */
export function useCharacters(
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint<typeof definitions>> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
    logger,
  );
}

/**
 * Hook to get compatible models for a character
 */
export function useCompatibleModels(
  models: ModelOption[],
  character: CharacterGetResponseOutput | null,
): ModelOption[] {
  return useMemo(() => {
    if (!character) {
      return models;
    }
    return CharactersRepositoryClient.getCompatibleModels(models, character);
  }, [models, character]);
}

/**
 * Hook to get recommended models for a character
 */
export function useRecommendedModels(
  models: ModelOption[],
  character: CharacterGetResponseOutput | null,
  limit = 5,
): ModelOption[] {
  return useMemo(() => {
    if (!character) {
      return [];
    }
    return CharactersRepositoryClient.getRecommendedModels(
      models,
      character,
      limit,
    );
  }, [models, character, limit]);
}
