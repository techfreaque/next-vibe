/**
 * Chat Settings Hook
 * Handles settings storage with localStorage for non-authenticated users and API for authenticated users
 */

"use client";

import { useCallback, useMemo } from "react";

import type { ViewModeValue } from "@/app/api/[locale]/agent/chat/enum";
import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import settingsDefinition from "./definition";

interface UseChatSettingsReturn {
  settings: ChatSettingsGetResponseOutput | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateSettings: (
    updates: Partial<ChatSettingsUpdateRequestOutput>,
  ) => Promise<void>;
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
    ): Promise<void> => {
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

      // Set all provided fields in form before submitting
      const setIf = <K extends keyof ChatSettingsUpdateRequestOutput>(
        key: K,
        value: ChatSettingsUpdateRequestOutput[K] | undefined,
      ): void => {
        if (value !== undefined) {
          endpoint.create?.setValue(key, value);
        }
      };
      setIf("selectedModel", updates.selectedModel);
      setIf("selectedSkill", updates.selectedSkill);
      setIf("activeFavoriteId", updates.activeFavoriteId);
      setIf("ttsAutoplay", updates.ttsAutoplay);
      setIf("viewMode", updates.viewMode);
      setIf("searchProvider", updates.searchProvider);
      setIf("codingAgent", updates.codingAgent);
      setIf("dreamerEnabled", updates.dreamerEnabled);
      setIf("dreamerFavoriteId", updates.dreamerFavoriteId);
      setIf("dreamerSchedule", updates.dreamerSchedule);
      setIf("dreamerPrompt", updates.dreamerPrompt);
      setIf("autopilotEnabled", updates.autopilotEnabled);
      setIf("autopilotFavoriteId", updates.autopilotFavoriteId);
      setIf("autopilotSchedule", updates.autopilotSchedule);
      setIf("autopilotPrompt", updates.autopilotPrompt);
      setIf("mamaEnabled", updates.mamaEnabled);
      setIf("mamaSchedule", updates.mamaSchedule);
      setIf("mamaPrompt", updates.mamaPrompt);
      // Submit through endpoint (endpoint handles API vs localStorage based on config)
      await endpoint.create?.onSubmit();
    },
    [logger, endpoint],
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
