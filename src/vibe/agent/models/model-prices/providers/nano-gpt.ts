/**
 * NanoGPT price fetcher. Two public, keyless catalogs:
 *
 * - Chat models, per-1M-token USD pricing:
 *   GET https://nano-gpt.com/api/v1/models?detailed=true
 * - Audio models (TTS + STT), per-unit USD pricing:
 *   GET https://nano-gpt.com/api/v1/audio-models
 *   TTS: pricing.per_thousand_chars, voices in supported_parameters.voices.
 *        Our providerModel is "<model>:<voice>" (e.g. "Kokoro-82m:af_bella").
 *   STT: pricing.per_minute or pricing.per_second.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import type { Modality } from "../../enum";
import { ApiProvider } from "../../models";
import type { PriceFailure, PriceUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import {
  collectTokenPriceUpdates,
  type TokenPriceEntry,
} from "./token-price-collector";

const MODELS_API_URL = "https://nano-gpt.com/api/v1/models?detailed=true";
const AUDIO_MODELS_API_URL = "https://nano-gpt.com/api/v1/audio-models";

/** Catalog envelope: items are validated one by one so a single odd entry can't sink the run. */
const catalogItemSchema = z.looseObject({ id: z.string() });
type CatalogItem = z.infer<typeof catalogItemSchema>;
const catalogResponseSchema = z.object({ data: z.array(catalogItemSchema) });

const chatModelSchema = z.object({
  id: z.string(),
  context_length: z.number().nullish(),
  pricing: z
    .object({
      /** USD per 1M input tokens */
      prompt: z.number().nullish(),
      /** USD per 1M output tokens */
      completion: z.number().nullish(),
      /** USD per 1K cached input tokens */
      cacheReadInputPer1kTokens: z.number().nullish(),
      /** USD per 1K cache-write input tokens */
      cacheWriteInputPer1kTokens: z.number().nullish(),
      unit: z.string().nullish(),
    })
    .nullish(),
  architecture: z
    .object({ input_modalities: z.array(z.string()).nullish() })
    .nullish(),
});
type NanoGptChatModel = z.infer<typeof chatModelSchema>;

const audioModelSchema = z.object({
  id: z.string(),
  pricing: z
    .looseObject({
      currency: z.string().nullish(),
      per_thousand_chars: z.number().nullish(),
      per_minute: z.number().nullish(),
      per_second: z.number().nullish(),
    })
    .nullish(),
  supported_parameters: z
    .object({ voices: z.array(z.string()).nullish() })
    .nullish(),
});
type NanoGptAudioModel = z.infer<typeof audioModelSchema>;

/**
 * Pricing keys we can bill 1:1. Anything else (per_generation, minimum,
 * pricing_formula, multipliers, billing intervals) means the flat per-unit
 * rate alone would under-charge, so the model is reported as unverified.
 */
const TTS_PRICING_KEYS = new Set(["currency", "per_thousand_chars"]);
const STT_PRICING_KEYS = new Set(["currency", "per_minute", "per_second"]);

type CatalogFetch =
  | { ok: true; items: Map<string, CatalogItem> }
  | { ok: false; error: string };

async function fetchCatalog(url: string): Promise<CatalogFetch> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return { ok: false, error: `${url} responded with ${response.status}` };
    }
    const parsed = catalogResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      return {
        ok: false,
        error: `${url} returned an unexpected shape: ${parsed.error.message}`,
      };
    }
    return {
      ok: true,
      items: new Map(parsed.data.data.map((item) => [item.id, item])),
    };
  } catch (err) {
    return { ok: false, error: `${url}: ${parseError(err).message}` };
  }
}

function perThousandToPerMillion(
  value: number | null | undefined,
): number | undefined {
  return value === undefined || value === null ? undefined : value * 1000;
}

function toTokenEntry(model: NanoGptChatModel): TokenPriceEntry | undefined {
  const pricing = model.pricing;
  if (
    !pricing ||
    pricing.unit !== "per_million_tokens" ||
    pricing.prompt === undefined ||
    pricing.prompt === null ||
    pricing.completion === undefined ||
    pricing.completion === null
  ) {
    return undefined;
  }
  const inputs: Modality[] = model.architecture?.input_modalities?.includes(
    "image",
  )
    ? ["text", "image"]
    : ["text"];
  return {
    input: pricing.prompt,
    output: pricing.completion,
    cacheRead: perThousandToPerMillion(pricing.cacheReadInputPer1kTokens),
    cacheWrite: perThousandToPerMillion(pricing.cacheWriteInputPer1kTokens),
    contextWindow: model.context_length ?? undefined,
    inputs,
    outputs: ["text"],
  };
}

/** "google/gemini-3.8-flash-lite-tts:Zephyr" → { model, voice: "Zephyr" } */
function splitTtsProviderModel(providerModel: string): {
  model: string;
  voice: string | undefined;
} {
  const idx = providerModel.lastIndexOf(":");
  return idx === -1
    ? { model: providerModel, voice: undefined }
    : {
        model: providerModel.slice(0, idx),
        voice: providerModel.slice(idx + 1),
      };
}

/** Reason the pricing can't be billed 1:1, or undefined when it can. */
function unsupportedPricing(
  model: NanoGptAudioModel,
  allowedKeys: Set<string>,
): string | undefined {
  const pricing = model.pricing;
  if (!pricing) {
    return "no pricing";
  }
  if (pricing.currency && pricing.currency !== "USD") {
    return `currency ${pricing.currency}`;
  }
  const extra = Object.keys(pricing).filter((key) => !allowedKeys.has(key));
  return extra.length > 0
    ? `unsupported billing terms: ${extra.join(", ")}`
    : undefined;
}

function sttUsdPerSecond(model: NanoGptAudioModel): number | undefined {
  const perSecond = model.pricing?.per_second;
  if (perSecond !== undefined && perSecond !== null) {
    return perSecond;
  }
  const perMinute = model.pricing?.per_minute;
  return perMinute !== undefined && perMinute !== null
    ? perMinute / 60
    : undefined;
}

export class NanoGptPriceFetcher extends PriceFetcher {
  readonly providerName = "nano-gpt";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const [chatCatalog, audioCatalog] = await Promise.all([
      fetchCatalog(MODELS_API_URL),
      fetchCatalog(AUDIO_MODELS_API_URL),
    ]);

    const errors: string[] = [];
    const updates: PriceUpdate[] = [];
    const failures: PriceFailure[] = [];
    let modelsFound = 0;

    let modalityUpdates: ProviderPriceResult["modalityUpdates"] = [];
    if (chatCatalog.ok) {
      modelsFound += chatCatalog.items.size;
      logger.debug("NanoGPT models API fetched", {
        count: chatCatalog.items.size,
      });
      const chat = collectTokenPriceUpdates({
        apiProvider: ApiProvider.NANO_GPT,
        source: "nano-gpt-api",
        label: "NanoGPT",
        lookup: (providerModel) => {
          const raw = chatCatalog.items.get(providerModel);
          const parsed = raw ? chatModelSchema.safeParse(raw) : undefined;
          return parsed?.success ? toTokenEntry(parsed.data) : undefined;
        },
      });
      updates.push(...chat.updates);
      failures.push(...chat.failures);
      modalityUpdates = chat.modalityUpdates;
    } else {
      errors.push(chatCatalog.error);
    }

    if (audioCatalog.ok) {
      modelsFound += audioCatalog.items.size;
      logger.debug("NanoGPT audio-models API fetched", {
        count: audioCatalog.items.size,
      });
      this.collectAudioUpdates(audioCatalog.items, updates, failures);
    } else {
      errors.push(audioCatalog.error);
    }

    return {
      provider: this.providerName,
      modelsFound,
      modelsUpdated: updates.filter(
        (u) =>
          u.field === "inputTokenCost" ||
          u.field === "creditCostPerCharacter" ||
          u.field === "creditCostPerSecond",
      ).length,
      updates,
      modalityUpdates,
      failures,
      ...(errors.length > 0
        ? {
            error: errors.join("; "),
            // Could not check: keep prior verified state instead of disabling.
            failedApiProviders: [ApiProvider.NANO_GPT],
          }
        : {}),
    };
  }

  private collectAudioUpdates(
    catalog: Map<string, CatalogItem>,
    updates: PriceUpdate[],
    failures: PriceFailure[],
  ): void {
    const lookup = (
      id: string,
    ): { model: NanoGptAudioModel } | { reason: string } => {
      const raw = catalog.get(id);
      if (!raw) {
        return { reason: `"${id}" not listed in ${AUDIO_MODELS_API_URL}` };
      }
      const parsed = audioModelSchema.safeParse(raw);
      return parsed.success
        ? { model: parsed.data }
        : {
            reason: `"${id}" has an unexpected shape: ${parsed.error.message}`,
          };
    };

    for (const def of Object.values(ttsModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.NANO_GPT ||
          !("creditCostPerCharacter" in providerConfig)
        ) {
          continue;
        }
        const { model: modelId, voice } = splitTtsProviderModel(
          providerConfig.providerModel,
        );
        const fail = (reason: string): void => {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.NANO_GPT,
            reason: `NanoGPT TTS ${providerConfig.providerModel}: ${reason}`,
          });
        };
        const found = lookup(modelId);
        if ("reason" in found) {
          fail(found.reason);
          continue;
        }
        const { model } = found;
        if (voice !== undefined) {
          const voices = model.supported_parameters?.voices;
          if (!voices?.includes(voice)) {
            fail(`voice "${voice}" no longer offered`);
            continue;
          }
        }
        const unsupported = unsupportedPricing(model, TTS_PRICING_KEYS);
        const perThousandChars = model.pricing?.per_thousand_chars;
        if (unsupported || !perThousandChars || perThousandChars <= 0) {
          fail(unsupported ?? "no per_thousand_chars price");
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.NANO_GPT,
          field: "creditCostPerCharacter",
          value: this.usdToCreditsPrecise(perThousandChars / 1000),
          source: AUDIO_MODELS_API_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }

    for (const def of Object.values(sttModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.NANO_GPT ||
          !("creditCostPerSecond" in providerConfig)
        ) {
          continue;
        }
        const fail = (reason: string): void => {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.NANO_GPT,
            reason: `NanoGPT STT ${providerConfig.providerModel}: ${reason}`,
          });
        };
        const found = lookup(providerConfig.providerModel);
        if ("reason" in found) {
          fail(found.reason);
          continue;
        }
        const { model } = found;
        const unsupported = unsupportedPricing(model, STT_PRICING_KEYS);
        const usdPerSecond = sttUsdPerSecond(model);
        if (unsupported || usdPerSecond === undefined || usdPerSecond <= 0) {
          fail(unsupported ?? "no per_minute/per_second price");
          continue;
        }
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.NANO_GPT,
          field: "creditCostPerSecond",
          value: this.usdToCreditsPrecise(usdPerSecond),
          source: AUDIO_MODELS_API_URL,
          providerModel: providerConfig.providerModel,
        });
      }
    }
  }
}
