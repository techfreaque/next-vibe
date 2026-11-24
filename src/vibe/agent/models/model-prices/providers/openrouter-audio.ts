import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { sttModelDefinitions } from "../../../speech-to-text/models";
import { ttsModelDefinitions } from "../../../text-to-speech/models";
import { ApiProvider } from "../../models";
import type { PriceFailure, PriceUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";

const endpointCatalogSchema = z.object({
  data: z.object({
    id: z.string(),
    architecture: z.object({ output_modalities: z.array(z.string()) }),
    endpoints: z.array(
      z.object({
        status: z.number(),
        service_tier: z.string().nullish(),
        pricing: z.looseObject({
          prompt: z.string(),
          completion: z.string(),
        }),
      }),
    ),
  }),
});

const FLAT_PRICE_KEYS = new Set(["prompt", "completion", "discount"]);
const SOURCE = "openrouter-audio-api";

interface AudioRoute {
  id: string;
  name: string;
  providerModel: string;
  modality: "speech" | "transcription";
}

type AudioQuote =
  | { usdPerUnit: number }
  | { reason: string; transient?: boolean };

async function fetchAudioQuote(
  model: string,
  modality: AudioRoute["modality"],
): Promise<AudioQuote> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external OpenRouter pricing API
    const response = await fetch(
      `https://openrouter.ai/api/v1/models/${model}/endpoints`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      return {
        reason: `endpoint catalog returned HTTP ${response.status}`,
        transient: response.status !== 404,
      };
    }
    const parsed = endpointCatalogSchema.safeParse(await response.json());
    if (!parsed.success) {
      return { reason: "unexpected endpoint catalog schema", transient: true };
    }
    const { data } = parsed.data;
    if (
      data.id !== model ||
      !data.architecture.output_modalities.includes(modality)
    ) {
      return { reason: `catalog entry does not match ${model} (${modality})` };
    }
    const endpoints = data.endpoints.filter(
      (endpoint) =>
        endpoint.status === 0 &&
        (!endpoint.service_tier || endpoint.service_tier === "default"),
    );
    if (!endpoints.length) {
      return { reason: "no active standard audio endpoint" };
    }
    // These output modalities expose per-character and per-second prompt
    // rates for flat-priced models. Use the highest reachable rate so a
    // routed fallback is covered when the response has no usage cost.
    let usdPerUnit = 0;
    for (const { pricing } of endpoints) {
      const rate = Number(pricing.prompt);
      if (
        !Number.isFinite(rate) ||
        rate <= 0 ||
        !pricing.completion.trim() ||
        Number(pricing.completion) !== 0 ||
        Object.keys(pricing).some((key) => !FLAT_PRICE_KEYS.has(key))
      ) {
        return { reason: "endpoint has no supported flat audio price" };
      }
      usdPerUnit = Math.max(usdPerUnit, rate);
    }
    return { usdPerUnit };
  } catch (error) {
    return { reason: parseError(error).message, transient: true };
  }
}

export class OpenRouterAudioPriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-audio";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const routes: AudioRoute[] = [];
    for (const def of Object.values(ttsModelDefinitions)) {
      for (const route of def.providers) {
        if (route.apiProvider === ApiProvider.OPENROUTER) {
          routes.push({
            id: route.id,
            name: def.name,
            providerModel: route.providerModel,
            modality: "speech",
          });
        }
      }
    }
    for (const def of Object.values(sttModelDefinitions)) {
      for (const route of def.providers) {
        if (route.apiProvider === ApiProvider.OPENROUTER) {
          routes.push({
            id: route.id,
            name: def.name,
            providerModel: route.providerModel,
            modality: "transcription",
          });
        }
      }
    }

    const pendingQuotes = new Map<string, Promise<AudioQuote>>();
    const updates: PriceUpdate[] = [];
    const failures: PriceFailure[] = [];
    const errors: string[] = [];
    await Promise.all(
      routes.map(async (route) => {
        const model = route.providerModel.split(":")[0];
        const pending =
          pendingQuotes.get(model) ?? fetchAudioQuote(model, route.modality);
        pendingQuotes.set(model, pending);
        const quote = await pending;
        if ("reason" in quote) {
          const reason = `OpenRouter ${model}: ${quote.reason}`;
          failures.push({
            modelId: route.id,
            provider: ApiProvider.OPENROUTER,
            reason,
          });
          if (quote.transient) {
            errors.push(reason);
          }
          return;
        }
        updates.push({
          modelId: route.id,
          name: route.name,
          provider: ApiProvider.OPENROUTER,
          field:
            route.modality === "speech"
              ? "creditCostPerCharacter"
              : "creditCostPerSecond",
          value: this.usdToCreditsPrecise(quote.usdPerUnit),
          source: SOURCE,
          providerModel: route.providerModel,
        });
      }),
    );
    logger.debug("OpenRouter audio endpoint prices checked", {
      models: pendingQuotes.size,
      updates: updates.length,
    });
    return {
      provider: this.providerName,
      modelsFound: pendingQuotes.size,
      modelsUpdated: updates.length,
      updates,
      failures,
      ...(errors.length
        ? {
            error: errors.join("; "),
            failedApiProviders: [ApiProvider.OPENROUTER],
          }
        : {}),
    };
  }
}
