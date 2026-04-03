/**
 * FreedomGPT price fetcher.
 *
 * Fetches pricing from the public JSON API at
 * https://chat.freedomgpt.com/api/models
 *
 * Current pricing (as of 2026-04):
 *   Model: liberty (FreedomGPT Liberty)
 *   Pricing: 5 credits/message (1 credit = $0.01 → $0.05/message)
 *   Modality: text → text
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { chatModelDefinitions, ChatModelId } from "../../../ai-stream/models";
import { ApiProvider } from "../../models";
import type { ModalityUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const MODELS_API_URL = "https://chat.freedomgpt.com/api/models";

/** 1 FreedomGPT credit = $0.01 (confirmed by user) */
const FREEDOMGPT_CREDIT_USD = 0.01;

interface FreedomGptApiModel {
  id: string;
  model: string;
  name: string;
  firstMessageCost: number;
  enabled: boolean;
  architecture?: {
    modality?: string;
  };
}

export class FreedomGptPriceFetcher extends PriceFetcher {
  readonly providerName = "freedomgpt";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const failures: ProviderPriceResult["failures"] = [];
    const modalityUpdates: ModalityUpdate[] = [];

    let apiModels: FreedomGptApiModel[];

    try {
      const response = await fetch(MODELS_API_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: `API responded with ${response.status}`,
        };
      }

      apiModels = (await response.json()) as FreedomGptApiModel[];
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: parseError(err).message,
      };
    }

    // Index API models by id (unique), not model field (has duplicates)
    const byId = new Map<string, FreedomGptApiModel>();
    for (const m of apiModels) {
      if (m.id) {
        byId.set(m.id, m);
      }
    }

    logger.debug("FreedomGPT: fetched models from API", {
      count: apiModels.length,
      ids: [...byId.keys()].slice(0, 10),
    });

    // Match our model definitions to API data
    for (const def of Object.values(chatModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.FREEDOMGPT) {
          continue;
        }
        if (!("creditCost" in providerConfig)) {
          continue;
        }

        const apiModel = byId.get(providerConfig.providerModel);
        if (!apiModel) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.FREEDOMGPT,
            reason: `Model "${providerConfig.providerModel}" not found in FreedomGPT API`,
          });
          continue;
        }

        // Convert FreedomGPT credits to USD, then to our credits
        const usdPerInference =
          apiModel.firstMessageCost * FREEDOMGPT_CREDIT_USD;
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.FREEDOMGPT,
          field: "creditCost",
          value: this.usdToCredits(usdPerInference),
          source: MODELS_API_URL,
          providerModel: providerConfig.providerModel,
        });

        // Emit modality from API architecture field
        const enumEntry = Object.entries(ChatModelId).find(
          // oxlint-disable-next-line no-unused-vars
          ([_, value]) => value === providerConfig.id,
        );
        if (enumEntry) {
          const modality = apiModel.architecture?.modality;
          const inputs = parseModality(modality, "input");
          const outputs = parseModality(modality, "output");

          modalityUpdates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.FREEDOMGPT,
            enumKey: enumEntry[0],
            inputs,
            outputs,
            source: MODELS_API_URL,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: byId.size,
      modelsUpdated: updates.length,
      updates,
      modalityUpdates,
      failures,
    };
  }
}

/**
 * Parse modality string like "text->text" or "text+image->text"
 * into input/output arrays.
 */
function parseModality(
  modality: string | undefined,
  side: "input" | "output",
): ("text" | "image" | "audio" | "video")[] {
  if (!modality) {
    return ["text"];
  }

  const parts = modality.split("->");
  const raw = side === "input" ? parts[0] : parts[1];
  if (!raw) {
    return ["text"];
  }

  const items = raw
    .trim()
    .split("+")
    .map((s) => s.trim().toLowerCase());

  const result: ("text" | "image" | "audio" | "video")[] = [];
  for (const item of items) {
    if (
      item === "text" ||
      item === "image" ||
      item === "audio" ||
      item === "video"
    ) {
      result.push(item);
    }
  }

  return result.length > 0 ? result : ["text"];
}
