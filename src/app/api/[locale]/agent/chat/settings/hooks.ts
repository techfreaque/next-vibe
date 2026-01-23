/**
 * Chat Settings Hook
 * Handles settings storage with localStorage for non-authenticated users and API for authenticated users
 */

"use client";

import { useCallback, useMemo } from "react";

import type { ViewModeValue } from "@/app/api/[locale]/agent/chat/enum";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import settingsDefinition from "./definition";
import { ChatSettingsRepositoryClient } from "./repository-client";

interface UseChatSettingsOptions {
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
}

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
    characterId: string,
    modelId: ModelId,
    voice: typeof TtsVoiceValue,
  ) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setViewMode: (mode: typeof ViewModeValue) => void;
  setEnabledTools: (
    tools: Array<{ id: string; requiresConfirmation: boolean }>,
  ) => void;
}

/**
 * Hook for managing chat settings
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage with callbacks
 */
export function useChatSettings({
  user,
  logger,
}: UseChatSettingsOptions): UseChatSettingsReturn {
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  // Set up endpoint with conditional storage based on authentication
  const endpoint = useEndpoint(
    settingsDefinition,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
        },
      },
      storage: !isAuthenticated
        ? {
            mode: "localStorage" as const,
            callbacks: ChatSettingsRepositoryClient.localStorageCallbacks,
          }
        : undefined,
    },
    logger,
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
        undefined,
      );

      // Set form values before submitting
      if (updates.selectedModel !== undefined) {
        endpoint.create?.setValue("selectedModel", updates.selectedModel);
      }
      if (updates.selectedCharacter !== undefined) {
        endpoint.create?.setValue(
          "selectedCharacter",
          updates.selectedCharacter,
        );
      }
      if (updates.activeFavoriteId !== undefined) {
        endpoint.create?.setValue("activeFavoriteId", updates.activeFavoriteId);
      }
      if (updates.ttsAutoplay !== undefined) {
        endpoint.create?.setValue("ttsAutoplay", updates.ttsAutoplay);
      }
      if (updates.ttsVoice !== undefined) {
        endpoint.create?.setValue("ttsVoice", updates.ttsVoice);
      }
      if (updates.viewMode !== undefined) {
        endpoint.create?.setValue("viewMode", updates.viewMode);
      }
      if (updates.enabledTools !== undefined) {
        endpoint.create?.setValue("enabledTools", updates.enabledTools);
      }
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

  const setEnabledTools = useCallback(
    (tools: Array<{ id: string; requiresConfirmation: boolean }>) => {
      void updateSettings({ enabledTools: tools });
    },
    [updateSettings],
  );

  const setActiveFavorite = useCallback(
    (
      favoriteId: string,
      characterId: string,
      modelId: ModelId,
      voice: typeof TtsVoiceValue,
    ) => {
      void updateSettings({
        activeFavoriteId: favoriteId,
        selectedCharacter: characterId,
        selectedModel: modelId,
        ttsVoice: voice,
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
    setEnabledTools,
  };
}
