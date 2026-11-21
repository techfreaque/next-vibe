/**
 * OpenRouter token-based LLM price fetcher.
 * Fetches per-million-token pricing and context windows from:
 * GET https://openrouter.ai/api/v1/models
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { chatModelDefinitions, ChatModelId } from "../../../ai-stream/models";
import {
  imageGenModelDefinitions,
  ImageGenModelId,
} from "../../../image-generation/models";
import type { Modality } from "../../enum";
import { ApiProvider } from "../../models";
import type { ModalityUpdate, ProviderPriceResult } from "./base";
import { PriceFetcher, roundUpPrice } from "./base";

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

/** Map OpenRouter modality strings to our Modality type. Returns undefined for unknown values. */
function mapOpenRouterModality(orModality: string): Modality | undefined {
  switch (orModality) {
    case "text":
      return "text";
    case "image":
      return "image";
    case "audio":
      return "audio";
    case "video":
      return "video";
    default:
      return undefined;
  }
}

const priceString = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
  );

const pricingSchema = z.object({
  prompt: priceString,
  completion: priceString,
  input_cache_read: priceString.optional(),
  input_cache_write: priceString.optional(),
  image_output: priceString.optional(),
});

const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  context_length: z.number(),
  pricing: pricingSchema,
  architecture: z
    .object({
      input_modalities: z.array(z.string()).optional(),
      output_modalities: z.array(z.string()).optional(),
    })
    .optional(),
});
type OpenRouterModel = z.infer<typeof modelSchema>;

const endpointsSchema = z.object({
  data: z.object({
    endpoints: z.array(
      z.object({
        status: z.number(),
        service_tier: z.string().nullish(),
        pricing: pricingSchema,
      }),
    ),
  }),
});

/** The bulk listing can quote a different host from the lowest-input route.
 * Verify increases against live, standard-tier endpoints and keep every rate
 * from the same endpoint. An unavailable quote cannot overwrite the catalog.
 */
async function fetchLowestInputPricing(
  id: string,
): Promise<OpenRouterModel["pricing"] | undefined> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external OpenRouter pricing API
    const response = await fetch(
      `https://openrouter.ai/api/v1/models/${id}/endpoints`,
      {
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) {
      return undefined;
    }
    const parsed = endpointsSchema.safeParse(await response.json());
    if (!parsed.success) {
      return undefined;
    }
    return parsed.data.data.endpoints
      .filter(
        (endpoint) =>
          endpoint.status === 0 &&
          (!endpoint.service_tier || endpoint.service_tier === "default"),
      )
      .toSorted(
        (a, b) =>
          Number(a.pricing.prompt) - Number(b.pricing.prompt) ||
          Number(a.pricing.completion) - Number(b.pricing.completion),
      )[0]?.pricing;
  } catch {
    return undefined;
  }
}

export class OpenRouterTokenPriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-token";
  private static readonly API_URL = "https://openrouter.ai/api/v1/models";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const modalityUpdates: ModalityUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    let rawModels: OpenRouterModel[] = [];
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch
      const response = await fetch(OpenRouterTokenPriceFetcher.API_URL, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          failures,
          error: `API responded with ${response.status}`,
          failedApiProviders: [ApiProvider.OPENROUTER],
        };
      }
      // Variable-priced aliases can carry negative sentinel prices.
      const data = z
        .object({ data: z.array(z.json()) })
        .parse(await response.json());
      rawModels = data.data.flatMap((item) => {
        const parsed = modelSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      });
      logger.debug("OpenRouter token API fetched", { count: rawModels.length });
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        failures,
        error: parseError(err).message,
        failedApiProviders: [ApiProvider.OPENROUTER],
      };
    }

    const modelMap = new Map(rawModels.map((m) => [m.id, m]));

    const endpointPrices = new Map<
      string,
      OpenRouterModel["pricing"] | undefined
    >();
    for (const def of [
      ...Object.values(chatModelDefinitions),
      ...Object.values(imageGenModelDefinitions),
    ]) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.OPENROUTER) {
          continue;
        }
        if (!("inputTokenCost" in providerConfig)) {
          continue;
        } // image models handled separately

        const raw = modelMap.get(providerConfig.providerModel);
        if (!raw) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `Not found in OpenRouter API (${providerConfig.providerModel})`,
          });
          continue;
        }

        let pricing = raw.pricing;
        if (
          providerConfig.inputTokenCost !== undefined &&
          Number(pricing.prompt) * 1_000_000 >
            providerConfig.inputTokenCost + 0.00001
        ) {
          if (!endpointPrices.has(raw.id)) {
            endpointPrices.set(raw.id, await fetchLowestInputPricing(raw.id));
          }
          const verified = endpointPrices.get(raw.id);
          if (!verified) {
            failures.push({
              modelId: providerConfig.id,
              provider: ApiProvider.OPENROUTER,
              reason: `Could not verify live endpoint pricing for ${raw.id}`,
            });
            continue;
          }
          pricing = verified;
        }

        // USD per million tokens, preserving sub-cent cache tariffs.
        const inputTokenCost = roundUpPrice(
          parseFloat(pricing.prompt) * 1_000_000,
          5,
        );
        const outputTokenCost = roundUpPrice(
          parseFloat(pricing.completion) * 1_000_000,
          5,
        );
        const cacheReadTokenCost = pricing.input_cache_read
          ? roundUpPrice(parseFloat(pricing.input_cache_read) * 1_000_000, 5)
          : undefined;
        const cacheWriteTokenCost = pricing.input_cache_write
          ? roundUpPrice(parseFloat(pricing.input_cache_write) * 1_000_000, 5)
          : undefined;
        const imageOutputTokenCost = pricing.image_output
          ? roundUpPrice(parseFloat(pricing.image_output) * 1_000_000, 5)
          : undefined;

        // Find enum key for contextWindow update (check both chat and image gen enums)
        const enumEntry =
          Object.entries(ChatModelId).find(
            // oxlint-disable-next-line no-unused-vars
            ([_, value]) => value === providerConfig.id,
          ) ??
          Object.entries(ImageGenModelId).find(
            // oxlint-disable-next-line no-unused-vars
            ([_, value]) => value === providerConfig.id,
          );
        const enumKey = enumEntry?.[0];

        if (enumKey) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "contextWindow",
            value: raw.context_length,
            source: "openrouter-api",
            enumKey,
          });
        }

        updates.push(
          {
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "inputTokenCost",
            value: inputTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          },
          {
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "outputTokenCost",
            value: outputTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          },
        );

        if (cacheReadTokenCost !== undefined) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "cacheReadTokenCost",
            value: cacheReadTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          });
        }
        if (cacheWriteTokenCost !== undefined) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "cacheWriteTokenCost",
            value: cacheWriteTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          });
        }
        // Image tokens bill far above the text completion rate: without this
        // the token fallback priced a generated image 4-20x too low.
        if (imageOutputTokenCost !== undefined && imageOutputTokenCost > 0) {
          updates.push({
            modelId: providerConfig.id,
            name: def.name,
            provider: ApiProvider.OPENROUTER,
            field: "imageOutputTokenCost",
            value: imageOutputTokenCost,
            source: "openrouter-api",
            providerModel: providerConfig.providerModel,
          });
        }

        // Emit modality updates from architecture data
        if (enumKey && raw.architecture) {
          const apiInputs = raw.architecture.input_modalities;
          const apiOutputs = raw.architecture.output_modalities;
          if (apiInputs?.length && apiOutputs?.length) {
            const inputs = apiInputs
              .map(mapOpenRouterModality)
              .filter((m): m is Modality => m !== undefined);
            const outputs = apiOutputs
              .map(mapOpenRouterModality)
              .filter((m): m is Modality => m !== undefined);
            if (inputs.length > 0 && outputs.length > 0) {
              modalityUpdates.push({
                modelId: providerConfig.id,
                name: def.name,
                provider: ApiProvider.OPENROUTER,
                enumKey,
                inputs: sortModalities(inputs),
                outputs: sortModalities(outputs),
                source: "openrouter-api",
              });
            }
          }
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: rawModels.length,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      modalityUpdates,
      failures,
    };
  }
}
