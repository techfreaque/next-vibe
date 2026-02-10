/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useCallback } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import favoritesDefinition, {
  type FavoriteCreateRequestOutput,
} from "./definition";

export interface UseFavoriteCreateReturn {
  isLoading: boolean;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

/**
 * Hook for creating favorites
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage via callbacks
 */
export function useFavoriteCreate(
  user: JwtPayloadType,
  logger: EndpointLogger,
): UseFavoriteCreateReturn {
  const endpoint = useEndpoint(favoritesDefinition, undefined, logger, user);

  // Create operation
  const addFavorite = useCallback(
    async (data: FavoriteCreateRequestOutput): Promise<string | null> => {
      endpoint.create.form.reset(data);
      return new Promise<string | null>((resolve, reject) => {
        endpoint.create.submitForm({
          onSuccess: ({ responseData }) => {
            resolve(responseData.id);
          },
          onError: ({ error }) => reject(error),
        });
      });
    },
    [endpoint.create],
  );

  return {
    isLoading: endpoint.create.isSubmitting,
    addFavorite,
  };
}
