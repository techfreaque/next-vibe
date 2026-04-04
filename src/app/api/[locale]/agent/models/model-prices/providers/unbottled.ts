/**
 * Unbottled AI price fetcher
 *
 * Fetches model prices from the unbottled.ai cloud's ws-provider/models endpoint.
 * Prices returned already include unbottled's 30% markup over raw provider costs.
 * These are the prices the self-hosted instance will pay when routing through unbottled.
 *
 * Dynamically manages UNBOTTLED provider entries in model definition files:
 * - New model on remote → add UNBOTTLED provider entry
 * - Model removed from remote → remove UNBOTTLED provider entry
 * - Price changed → update price + timestamp comment
 * - Price unchanged → skip (no-op)
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { defaultLocale } from "@/i18n/core/config";

import { ChatModelId, chatModelDefinitions } from "../../../ai-stream/models";
import {
  ImageGenModelId,
  imageGenModelDefinitions,
} from "../../../image-generation/models";
import {
  MusicGenModelId,
  musicGenModelDefinitions,
} from "../../../music-generation/models";
import {
  SttModelId,
  sttModelDefinitions,
} from "../../../speech-to-text/models";
import {
  TtsModelId,
  ttsModelDefinitions,
} from "../../../text-to-speech/models";
import {
  VideoGenModelId,
  videoGenModelDefinitions,
} from "../../../video-generation/models";
import type { ModelDefinition } from "../../models";
import { ApiProvider } from "../../models";
import type {
  PriceUpdate,
  ProviderEntryOperation,
  ProviderPriceResult,
} from "./base";
import { PriceFetcher } from "./base";

interface UnbottledModelEntry {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  contextWindow: number | null;
  supportsTools: boolean;
  creditCost: number;
}

/** Category string from ws-provider/models → role used by price repository */
const CATEGORY_TO_ROLE: Record<string, string> = {
  chat: "chat",
  image: "image-gen",
  music: "music-gen",
  video: "video-gen",
  tts: "tts",
  stt: "stt",
};

/** Model ID enums by role, for resolving enum keys */
const MODEL_ID_ENUMS: Record<string, Record<string, string>> = {
  chat: ChatModelId,
  "image-gen": ImageGenModelId,
  "music-gen": MusicGenModelId,
  "video-gen": VideoGenModelId,
  tts: TtsModelId,
  stt: SttModelId,
};

/** All model definitions by role */
function getAllDefsByRole(): Record<string, Record<string, ModelDefinition>> {
  return {
    chat: { ...chatModelDefinitions },
    "image-gen": { ...imageGenModelDefinitions },
    "music-gen": { ...musicGenModelDefinitions },
    "video-gen": { ...videoGenModelDefinitions },
    tts: { ...ttsModelDefinitions },
    stt: { ...sttModelDefinitions },
  };
}

/**
 * Find the enum key name for a model ID value.
 * E.g. "gpt-54" → "GPT_5_4" by searching the enum object.
 */
function findEnumKey(
  modelIdValue: string,
  enumObj: Record<string, string>,
): string | null {
  for (const [key, value] of Object.entries(enumObj)) {
    if (value === modelIdValue) {
      return key;
    }
  }
  return null;
}

export class UnbottledPriceFetcher extends PriceFetcher {
  // eslint-disable-next-line i18next/no-literal-string
  readonly providerName = "unbottled";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: PriceUpdate[] = [];
    const providerEntryOps: ProviderEntryOperation[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    // Get remote session for API call
    const session = await this.getSession();
    if (!session) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        failures: [],
        error: "No active remote connection — skip Unbottled price fetch",
      };
    }

    // Fetch models — use in-process shortcut when pointing at ourselves,
    // HTTP call when pointing at a real remote instance.
    let remoteModels: UnbottledModelEntry[];
    try {
      const { env: appEnv } = await import("@/config/env");
      const isLocal = session.remoteUrl === appEnv.NEXT_PUBLIC_APP_URL;

      if (isLocal) {
        // In-process: call the repository directly (no HTTP, no auth needed)
        const { WsProviderModelsRepository } =
          await import("../../../ai-stream/ws-provider/models/repository");
        const listResult = await WsProviderModelsRepository.listModels();
        if (!listResult.success || !listResult.data) {
          return {
            provider: this.providerName,
            modelsFound: 0,
            modelsUpdated: 0,
            updates: [],
            failures: [],
            error: "Local ws-provider/models returned unsuccessful response",
          };
        }
        remoteModels = listResult.data.models;
      } else {
        // Remote: HTTP call to the unbottled.ai cloud instance
        const url = `${session.remoteUrl}/api/${defaultLocale}/agent/ai-stream/ws-provider/models`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${session.token}`,
            Cookie: `${LEAD_ID_COOKIE_NAME}=${session.leadId}`,
          },
        });

        if (!response.ok) {
          return {
            provider: this.providerName,
            modelsFound: 0,
            modelsUpdated: 0,
            updates: [],
            failures: [],
            error: `Failed to fetch unbottled models: ${String(response.status)}`,
          };
        }

        const json = (await response.json()) as {
          success: boolean;
          data?: { models: UnbottledModelEntry[] };
        };
        if (!json.success || !json.data) {
          return {
            provider: this.providerName,
            modelsFound: 0,
            modelsUpdated: 0,
            updates: [],
            failures: [],
            error: "Unbottled API returned unsuccessful response",
          };
        }

        remoteModels = json.data.models;
      }
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        failures: [],
        error: `Unbottled fetch error: ${String(err)}`,
      };
    }

    logger.info(
      `[Unbottled] Fetched ${String(remoteModels.length)} models from cloud`,
    );

    // Build remote model lookup: modelId → { creditCost, category }
    const remoteModelMap = new Map<
      string,
      { creditCost: number; category: string }
    >();
    for (const model of remoteModels) {
      remoteModelMap.set(model.id, {
        creditCost: model.creditCost,
        category: model.category,
      });
    }

    // Build a set of all local model IDs that have UNBOTTLED provider entries
    const allDefsByRole = getAllDefsByRole();
    const localUnbottledModels = new Map<
      string,
      { role: string; providerModel: string; def: ModelDefinition }
    >();

    for (const [role, defs] of Object.entries(allDefsByRole)) {
      for (const [modelId, def] of Object.entries(defs)) {
        for (const providerConfig of def.providers) {
          if (providerConfig.apiProvider === ApiProvider.UNBOTTLED) {
            localUnbottledModels.set(modelId, {
              role,
              providerModel: providerConfig.providerModel,
              def,
            });
          }
        }
      }
    }

    // 1. Process existing UNBOTTLED entries: update price or mark for removal
    for (const [modelId, local] of localUnbottledModels) {
      const remote = remoteModelMap.get(modelId);
      if (!remote) {
        // Remote no longer has this model → remove the UNBOTTLED entry
        const enumObj = MODEL_ID_ENUMS[local.role];
        const enumKey = enumObj ? findEnumKey(modelId, enumObj) : null;
        if (enumKey) {
          providerEntryOps.push({
            action: "remove",
            role: local.role,
            enumKey,
            modelId,
            provider: ApiProvider.UNBOTTLED,
            providerModel: local.providerModel,
            source: "unbottled.ai",
          });
        }
        continue;
      }

      // Remote has this model → emit price update
      const field = getPriceField(local.role);
      if (field) {
        updates.push({
          modelId,
          name: local.def.name,
          provider: ApiProvider.UNBOTTLED,
          field,
          value: remote.creditCost,
          source: "unbottled.ai",
          providerModel: local.providerModel,
        });
      }
    }

    // 2. Detect new models: remote has model, local has no UNBOTTLED entry
    for (const [remoteModelId, remoteData] of remoteModelMap) {
      if (localUnbottledModels.has(remoteModelId)) {
        continue; // Already handled above
      }

      // Check if we have this model at all (any provider)
      const role = CATEGORY_TO_ROLE[remoteData.category];
      if (!role) {
        continue;
      }

      const defs = allDefsByRole[role];
      if (!defs || !defs[remoteModelId]) {
        // Model doesn't exist locally at all — skip (we only add UNBOTTLED as
        // an additional provider to existing models)
        continue;
      }

      const enumObj = MODEL_ID_ENUMS[role];
      const enumKey = enumObj ? findEnumKey(remoteModelId, enumObj) : null;
      if (!enumKey) {
        continue;
      }

      providerEntryOps.push({
        action: "add",
        role,
        enumKey,
        modelId: remoteModelId,
        provider: ApiProvider.UNBOTTLED,
        providerModel: remoteModelId,
        creditCost: remoteData.creditCost,
        source: "unbottled.ai",
      });
    }

    logger.info(`[Unbottled] Provider entry operations`, {
      adds: providerEntryOps.filter((op) => op.action === "add").length,
      removes: providerEntryOps.filter((op) => op.action === "remove").length,
      priceUpdates: updates.length,
    });

    return {
      provider: this.providerName,
      modelsFound: remoteModels.length,
      modelsUpdated: updates.length + providerEntryOps.length,
      updates,
      providerEntryOps,
      failures,
    };
  }

  private async getSession(): Promise<{
    token: string;
    leadId: string;
    remoteUrl: string;
  } | null> {
    const { agentEnv, parseUnbottledCredentials } =
      await import("@/app/api/[locale]/agent/env");
    const parsed = parseUnbottledCredentials(
      agentEnv.UNBOTTLED_CLOUD_CREDENTIALS,
    );
    if (parsed) {
      return parsed;
    }

    // Local mode: fetch model list from ourselves via HTTP.
    // Localhost URLs pass through the fetch cache (not considered external).
    const { env } = await import("@/config/env");
    const { resolveLocalAdminSession } = await import("./local-session-helper");
    return resolveLocalAdminSession(env.NEXT_PUBLIC_APP_URL);
  }
}

/**
 * Determine the appropriate price field for a model definition based on role.
 * UNBOTTLED entries always use creditCost (flat credit pricing from unbottled.ai).
 */
function getPriceField(role: string): PriceUpdate["field"] | null {
  if (
    CATEGORY_TO_ROLE[role] ||
    Object.values(CATEGORY_TO_ROLE).includes(role)
  ) {
    return "creditCost";
  }
  return null;
}
