/**
 * Model selection from links (`/threads/<folder>/new?model=<id>`).
 *
 * Applies a linked model exactly like "use this model without saving a
 * favorite" does in the selector flow: activeFavoriteId → null,
 * selectedModel → the model. Works for guests (localStorage) and signed-in
 * users (API) through the settings endpoint.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import {
  ChatModelId,
  getBestChatModel,
  resolveChatModelSuccessor,
} from "../../ai-stream/models";
import type { AgentEnvAvailability } from "../../env-availability";
import { ModelSelectionType } from "../../skills/enum";
import settingsDefinition, {
  type ChatSettingsGetResponseOutput,
} from "./definition";

/**
 * Resolve a raw link value to a model this user can actually use.
 * Legacy ids resolve to their successor. Unknown or unservable ids → null
 * (callers keep the current selection).
 */
export function resolveLinkedChatModel(
  raw: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelId | null {
  const requested = Object.values(ChatModelId).find((id) => id === raw);
  if (requested === undefined) {
    return null;
  }
  const best = getBestChatModel(
    { selectionType: ModelSelectionType.MANUAL, manualModelId: requested },
    user,
    availability,
  );
  if (best === null) {
    return null;
  }
  // MANUAL falls back to a filter pick when the model can't be served -
  // only accept the requested model itself or its successor.
  const successor = resolveChatModelSuccessor(requested);
  return best.id === requested || best.id === successor ? best.id : null;
}

/**
 * Make `modelId` the chat model. `fallbackSettings` seeds the settings cache
 * when the chat has not loaded it yet (SSR settings), so the composer shows
 * the linked model on first paint instead of flashing the old one.
 */
export async function applyLinkedChatModel(params: {
  modelId: ChatModelId;
  fallbackSettings: ChatSettingsGetResponseOutput | null;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<void> {
  const { modelId, fallbackSettings, user, logger, locale } = params;

  const seedCache = (): void => {
    apiClient.updateEndpointData(settingsDefinition.GET, logger, (oldData) => {
      const base = oldData?.success ? oldData.data : fallbackSettings;
      if (base === null) {
        return oldData;
      }
      return success({
        ...base,
        activeFavoriteId: null,
        selectedModel: modelId,
      });
    });
  };

  seedCache();
  const response = await apiClient.mutate(
    settingsDefinition.POST,
    logger,
    user,
    { activeFavoriteId: null, selectedModel: modelId },
    undefined,
    locale,
  );
  if (!response.success) {
    logger.error("Failed to apply linked chat model", {
      modelId,
      message: response.message,
    });
    await apiClient.refetchEndpoint(settingsDefinition.GET, logger);
    return;
  }
  // A settings fetch that raced the write may have restored the old model
  seedCache();
}
