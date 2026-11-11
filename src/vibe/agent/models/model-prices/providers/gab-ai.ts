/**
 * Gab AI price + modality fetcher.
 *
 * Gab AI is an OpenAI-compatible, flat-rate ("Gab Plus") provider. Its public
 * model list is at:
 *   GET https://gab.ai/v1/models   (Authorization: Bearer <GAB_AI_API_KEY>)
 *
 * The listing exposes `capabilities` (input/output modalities) and a
 * `context_window`, but `credit_cost` is null for chat models because billing
 * is subscription-based, not per-call. There is therefore no per-call price to
 * fetch - Gab AI chat models carry a manually-maintained `creditCost` and opt
 * in via `enabledWithoutPrice: true`.
 *
 * This fetcher's job is to VERIFY that each Gab model we list still exists
 * upstream and to keep its modality in sync from `capabilities`. On a transient
 * outage it reports GAB_AI in `failedApiProviders` so the disable logic does
 * not drop every Gab model.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatModelDefinitions, ChatModelId } from "../../../ai-stream/models";
import { agentEnv } from "../../../env";
import type { Modality } from "../../enum";
import { ApiProvider } from "../../models";
import type { ModalityUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const MODELS_API_URL = "https://gab.ai/v1/models";

/** Canonical ordering for modalities: text first, then image, video, audio */
const MODALITY_ORDER: Record<Modality, number> = {
  text: 0,
  image: 1,
  video: 2,
  audio: 3,
};

function sortModalities(modalities: Modality[]): Modality[] {
  return [...modalities].toSorted(
    (a, b) => MODALITY_ORDER[a] - MODALITY_ORDER[b],
  );
}

/** OpenAI-compatible capability flags Gab AI returns per model. */
interface GabCapabilities {
  text?: boolean;
  images?: boolean;
  video?: boolean;
  audio?: boolean;
  image_input?: boolean;
  file_input?: boolean;
  audio_input?: boolean;
  video_input?: boolean;
}

interface GabApiModel {
  id: string;
  capabilities?: GabCapabilities;
  context_window?: number | null;
  /** null for flat-rate chat models; never a usable per-call price today */
  credit_cost?: number | null;
}

interface GabModelsResponse {
  data: GabApiModel[];
}

/** Derive input modalities from Gab capability flags. Always includes text. */
function inputModalities(cap: GabCapabilities | undefined): Modality[] {
  const inputs: Modality[] = ["text"];
  if (cap?.image_input) {
    inputs.push("image");
  }
  if (cap?.video_input) {
    inputs.push("video");
  }
  if (cap?.audio_input) {
    inputs.push("audio");
  }
  return sortModalities([...new Set(inputs)]);
}

/** Derive output modalities. Gab chat models emit text; media flags add more. */
function outputModalities(cap: GabCapabilities | undefined): Modality[] {
  const outputs: Modality[] = ["text"];
  if (cap?.images) {
    outputs.push("image");
  }
  if (cap?.video) {
    outputs.push("video");
  }
  if (cap?.audio) {
    outputs.push("audio");
  }
  return sortModalities([...new Set(outputs)]);
}

export class GabAiPriceFetcher extends PriceFetcher {
  readonly providerName = "gab-ai";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const modalityUpdates: ModalityUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const apiKey = agentEnv.GAB_AI_API_KEY;
    if (!apiKey) {
      // No key configured - cannot verify. Treat as a transient gap so Gab
      // models keep their manually-maintained state rather than being dropped.
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        modalityUpdates,
        failures,
        error: "GAB_AI_API_KEY not configured",
        failedApiProviders: [ApiProvider.GAB_AI],
      };
    }

    let apiModels: GabApiModel[];
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch
      const response = await fetch(MODELS_API_URL, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates: [],
          modalityUpdates,
          failures,
          error: `API responded with ${response.status}`,
          failedApiProviders: [ApiProvider.GAB_AI],
        };
      }
      const data = (await response.json()) as GabModelsResponse;
      apiModels = data.data;
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        modalityUpdates,
        failures,
        error: parseError(err).message,
        failedApiProviders: [ApiProvider.GAB_AI],
      };
    }

    const byId = new Map<string, GabApiModel>();
    for (const m of apiModels) {
      if (m.id) {
        byId.set(m.id, m);
      }
    }

    logger.debug("Gab AI: fetched models from API", { count: byId.size });

    for (const def of Object.values(chatModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.GAB_AI) {
          continue;
        }

        const apiModel = byId.get(providerConfig.providerModel);
        if (!apiModel) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.GAB_AI,
            reason: `Model "${providerConfig.providerModel}" not found in Gab AI API`,
          });
          continue;
        }

        const enumEntry = Object.entries(ChatModelId).find(
          // oxlint-disable-next-line no-unused-vars
          ([_, value]) => value === providerConfig.id,
        );
        if (!enumEntry) {
          continue;
        }

        modalityUpdates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.GAB_AI,
          enumKey: enumEntry[0],
          inputs: inputModalities(apiModel.capabilities),
          outputs: outputModalities(apiModel.capabilities),
          source: MODELS_API_URL,
        });
      }
    }

    return {
      provider: this.providerName,
      modelsFound: byId.size,
      modelsUpdated: modalityUpdates.length,
      updates: [],
      modalityUpdates,
      failures,
    };
  }
}
