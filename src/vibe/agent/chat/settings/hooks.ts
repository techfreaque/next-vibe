/**
 * Chat Settings Hook
 * Handles settings storage with localStorage for non-authenticated users and API for authenticated users
 */

"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useCallback, useMemo } from "react";

import type { ChatModelId } from "../../ai-stream/models";
import type { ViewModeValue } from "../enum";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import settingsDefinition from "./definition";

interface UseChatSettingsReturn {
  settings: ChatSettingsGetResponseOutput | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Resolves with the error when the save failed (cache already rolled back), else null. */
  updateSettings: (
    updates: Partial<ChatSettingsUpdateRequestOutput>,
  ) => Promise<ErrorResponseType | null>;
  // Convenience setters
  setActiveFavorite: (
    favoriteId: string,
    skillId: string,
    modelId: ChatModelId,
  ) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setViewMode: (mode: typeof ViewModeValue) => void;
}

/**
 * Hook for managing chat settings
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage with callbacks
 */
export function useChatSettings(
  user: JwtPayloadType,
  logger: EndpointLogger,
  /** SSR-prefetched settings - pre-populates React Query cache, skips initial fetch */
  initialData?: ChatSettingsGetResponseOutput | null,
): UseChatSettingsReturn {
  const { locale } = useTranslation();
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );
  const endpointOptions = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
        },
        initialData: initialData ?? undefined,
      },
    }),
    [initialData],
  );

  // Set up endpoint - automatically uses client routes for public users
  const endpoint = useEndpoint(
    settingsDefinition,
    endpointOptions,
    logger,
    user,
  );

  // Extract settings
  const settings = useMemo(() => {
    return endpoint.read?.data ?? null;
  }, [endpoint.read?.data]);

  // Update settings handler - goes through endpoint (API or localStorage)
  // Wrapped in useCallback to provide stable reference for dependent hooks
  const updateSettings = useCallback(
    async (
      updates: Partial<ChatSettingsUpdateRequestOutput>,
    ): Promise<ErrorResponseType | null> => {
      // Optimistic update: immediately update cache with submitted values
      apiClient.updateEndpointData(
        settingsDefinition.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }

          return {
            success: true,
            data: {
              ...oldData.data,
              ...updates,
            },
          };
        },
      );

      // Send ONLY the changed fields, straight to the endpoint. Submitting
      // the shared create form sent every field it held, so a stale value
      // (or a reset racing a second quick toggle) re-sent
      // `dreamerEnabled: true` with an unrelated change and the off state
      // never stuck. The server treats absent fields as "leave as is".
      const result = await apiClient.mutate(
        settingsDefinition.POST,
        logger,
        user,
        updates,
        undefined,
        locale,
      );
      const error = result.success ? null : result;
      if (error) {
        // Roll back the optimistic update: never leave a toggle "on" that
        // the server did not save.
        await apiClient.refetchEndpoint(settingsDefinition.GET, logger);
      }
      return error;
    },
    [logger, user, locale],
  );

  const setTTSAutoplay = useCallback(
    (autoplay: boolean) => {
      void updateSettings({ ttsAutoplay: autoplay });
    },
    [updateSettings],
  );

  const setViewMode = useCallback(
    (mode: typeof ViewModeValue) => {
      void updateSettings({ viewMode: mode });
    },
    [updateSettings],
  );

  const setActiveFavorite = useCallback(
    (favoriteId: string, skillId: string, modelId: ChatModelId) => {
      void updateSettings({
        activeFavoriteId: favoriteId,
        selectedSkill: skillId,
        selectedModel: modelId,
      });
    },
    [updateSettings],
  );

  return {
    settings,
    isLoading: endpoint.read?.isLoading ?? false,
    isAuthenticated,
    updateSettings,
    setActiveFavorite,
    setTTSAutoplay,
    setViewMode,
  };
}
