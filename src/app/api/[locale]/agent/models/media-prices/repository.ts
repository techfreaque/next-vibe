/**
 * Media Model Prices Repository
 * Fetches real-time pricing for image/audio models from provider APIs
 * and updates creditCostPerImage / creditCostPerClip in models.ts.
 *
 * Stored value = (rawUsd / CREDIT_VALUE_USD) * (1 + STANDARD_MARKUP_PERCENTAGE)
 * Same convention as calculateCreditCost() for token models.
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { CREDIT_VALUE_USD } from "@/app/api/[locale]/products/constants";
import type { ModelId } from "../models";
import { ApiProvider, modelDefinitions } from "../models";
import type { MediaPricesGetResponseOutput } from "./definition";
import type { MediaPricesT } from "./i18n";

function usdToCredits(usd: number): number {
  const raw = usd / CREDIT_VALUE_USD;
  // Round to 4 significant decimal places to avoid float noise (e.g. 7.000000000000001)
  const rounded = Math.round(raw * 10000) / 10000;
  return rounded % 1 === 0 ? Math.round(rounded) : rounded;
}

interface MediaModelPrice {
  modelId: ModelId;
  name: string;
  provider: string;
  costUsd: number;
  creditCost: number;
  /** "image" | "clip" */
  costField: "creditCostPerImage" | "creditCostPerClip";
  source: string;
}

// ---------------------------------------------------------------------------
// Replicate pricing — authenticated API
// GET https://api.replicate.com/v1/models/{owner}/{name}
// Returns: { latest_version: { ..., run_count, ... }, run_url, ... }
// Pricing is in the "billing" field or via predictions API.
// We fall back to the public page HTML scrape if the API doesn't return pricing.
// ---------------------------------------------------------------------------

interface ReplicatePricingEntry {
  metric: string;
  price: string;
}

interface ReplicateModelResponse {
  latest_version?: {
    id?: string;
  };
  billing?: {
    prices?: ReplicatePricingEntry[];
    p50_price?: string;
  };
  default_example?: {
    metrics?: {
      predict_time?: number;
    };
  };
}

async function fetchReplicatePrice(
  owner: string,
  model: string,
  logger: EndpointLogger,
): Promise<{ usd: number; source: string } | null> {
  const apiToken = agentEnv.REPLICATE_API_TOKEN;

  // Try authenticated API first
  if (apiToken) {
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/models/${owner}/${model}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = (await response.json()) as ReplicateModelResponse;

        // Check billing.prices for per-image pricing
        if (data.billing?.prices?.length) {
          for (const entry of data.billing.prices) {
            const priceMatch = entry.price.match(/\$(\d+\.?\d*)/);
            if (priceMatch) {
              const usd = parseFloat(priceMatch[1]);
              if (!isNaN(usd) && usd > 0) {
                logger.debug("Replicate API price found", {
                  owner,
                  model,
                  metric: entry.metric,
                  usd,
                });
                return { usd, source: "replicate-api" };
              }
            }
          }
        }

        // Check billing.p50_price
        if (data.billing?.p50_price) {
          const priceMatch = data.billing.p50_price.match(/\$(\d+\.?\d*)/);
          if (priceMatch) {
            const usd = parseFloat(priceMatch[1]);
            if (!isNaN(usd) && usd > 0) {
              logger.debug("Replicate API p50 price found", {
                owner,
                model,
                usd,
              });
              return { usd, source: "replicate-api-p50" };
            }
          }
        }
      } else {
        logger.debug("Replicate API request failed", {
          owner,
          model,
          status: response.status,
        });
      }
    } catch (err) {
      logger.debug("Replicate API fetch error", {
        owner,
        model,
        error: parseError(err).message,
      });
    }
  }

  // Fall back to public page HTML scraping
  try {
    const response = await fetch(`https://replicate.com/${owner}/${model}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; unbottled-ai/1.0)" },
    });
    if (!response.ok) {
      logger.warn("Replicate page fetch failed", {
        owner,
        model,
        status: response.status,
      });
      return null;
    }
    const html = await response.text();

    // Replicate embeds pricing in JSON blocks: "prices":[{"price":"$0.04",...}]
    const perImageMatch = html.match(/"prices":\s*\[([^\]]+)\]/);
    if (perImageMatch) {
      const priceMatch = perImageMatch[1].match(
        /"price":\s*"\\?\$(\d+\.?\d*)"/,
      );
      if (priceMatch) {
        const usd = parseFloat(priceMatch[1]);
        if (!isNaN(usd) && usd > 0) {
          return { usd, source: "replicate-html-per-image" };
        }
      }
    }

    // Fallback: p50price (median cost per run)
    const p50Match = html.match(/"p50price":\s*"\\?\$(\d+\.?\d*)"/);
    if (p50Match) {
      const usd = parseFloat(p50Match[1]);
      if (!isNaN(usd) && usd > 0) {
        return { usd, source: "replicate-html-p50" };
      }
    }

    logger.debug("No pricing found on Replicate page", { owner, model });
    return null;
  } catch (err) {
    logger.warn("Error fetching Replicate pricing", {
      owner,
      model,
      error: parseError(err).message,
    });
    return null;
  }
}

// ---------------------------------------------------------------------------
// OpenRouter image generation pricing
// /api/frontend/models includes pricing_json with provider-native cost fields.
// We derive per-image USD cost using provider-specific logic:
//   bfl:informational_output_megapixels   — USD per MP (first MP = 1 image)
//   sourceful:cents_per_image_output      — cents per image (÷ 100)
//   seedream:cents_per_image_output       — cents per image (÷ 100)
//   gemini:image_output_tokens            — USD per token × 1000 tokens/image
//   openai_responses:image_output_tokens  — USD per token × 1000 tokens/image
// ---------------------------------------------------------------------------

interface OpenRouterFrontendModel {
  slug: string;
  endpoint?: {
    pricing_json?: Record<string, number | string>;
  };
}

function derivePerImageUsd(
  pricingJson: Record<string, number | string>,
): number | null {
  const n = (k: string): number | null => {
    const v = pricingJson[k];
    if (v === undefined) {
      return null;
    }
    const f = typeof v === "string" ? parseFloat(v) : v;
    return isNaN(f) ? null : f;
  };

  // BFL FLUX: per-megapixel USD (first MP = typical 1024×1024 image)
  const bflMp = n("bfl:informational_output_megapixels");
  if (bflMp !== null && bflMp > 0) {
    return bflMp;
  }

  // Sourceful Riverflow: cents per standard image
  const sourcefulCents = n("sourceful:cents_per_image_output");
  if (sourcefulCents !== null && sourcefulCents > 0) {
    return sourcefulCents / 100;
  }

  // ByteDance Seedream: cents per image
  const seedreamCents = n("seedream:cents_per_image_output");
  if (seedreamCents !== null && seedreamCents > 0) {
    return seedreamCents / 100;
  }

  // Google Gemini: USD per image output token × 1000 tokens/image
  const geminiTok = n("gemini:image_output_tokens");
  if (geminiTok !== null && geminiTok > 0) {
    return geminiTok * 1000;
  }

  // OpenAI image models: USD per image output token × 1000 tokens/image
  const openaiTok = n("openai_responses:image_output_tokens");
  if (openaiTok !== null && openaiTok > 0) {
    return openaiTok * 1000;
  }

  return null;
}

async function fetchOpenRouterImagePrices(
  logger: EndpointLogger,
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  try {
    const response = await fetch("https://openrouter.ai/api/frontend/models", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      logger.warn("OpenRouter frontend models API failed", {
        status: response.status,
      });
      return prices;
    }
    const data = (await response.json()) as {
      data: OpenRouterFrontendModel[];
    };
    for (const model of data.data) {
      const pj = model.endpoint?.pricing_json;
      if (!pj) {
        continue;
      }
      const usd = derivePerImageUsd(pj);
      if (usd !== null && usd > 0) {
        prices.set(model.slug, usd);
      }
    }
    logger.debug("OpenRouter image prices fetched", { count: prices.size });
  } catch (err) {
    logger.warn("Error fetching OpenRouter image prices", {
      error: parseError(err).message,
    });
  }
  return prices;
}

// ---------------------------------------------------------------------------
// OpenAI Images — no machine-readable pricing API
// Prices from https://openai.com/api/pricing (USD per image)
// Standard quality 1024×1024. Updated manually when OpenAI changes pricing.
// ---------------------------------------------------------------------------
const OPENAI_IMAGE_STATIC_PRICES: Record<string, number> = {
  "dall-e-3": 0.04, // standard quality 1024×1024
  "gpt-image-1": 0.02, // medium quality 1024×1024
};

// ---------------------------------------------------------------------------
// Fal.ai — no machine-readable pricing API
// Prices from https://fal.ai/pricing
// ---------------------------------------------------------------------------
const FAL_AI_STATIC_PRICES: Record<string, number> = {
  "fal-ai/udio": 0.05, // ~$0.05 per 30s clip
};

// ---------------------------------------------------------------------------
// Main repository
// ---------------------------------------------------------------------------
export class MediaPricesRepository {
  static async fetchAndUpdate(
    logger: EndpointLogger,
    t: MediaPricesT,
  ): Promise<ResponseType<MediaPricesGetResponseOutput>> {
    try {
      const prices: MediaModelPrice[] = [];

      // Fetch OpenRouter image prices once (API call, shared across all OR models)
      const openRouterImagePrices = await fetchOpenRouterImagePrices(logger);

      for (const def of Object.values(modelDefinitions)) {
        for (const provider of def.providers) {
          // Only process image and audio generation models
          const isImageModel = "creditCostPerImage" in provider;
          const isAudioModel = "creditCostPerClip" in provider;
          if (!isImageModel && !isAudioModel) {
            continue;
          }

          const costField = isImageModel
            ? "creditCostPerImage"
            : "creditCostPerClip";
          let usd: number | null = null;
          let source = "static";

          if (provider.apiProvider === ApiProvider.REPLICATE) {
            const parts = provider.providerModel.split("/");
            if (parts.length === 2) {
              const result = await fetchReplicatePrice(
                parts[0],
                parts[1],
                logger,
              );
              if (result) {
                usd = result.usd;
                source = result.source;
              }
            }
          } else if (provider.apiProvider === ApiProvider.OPENAI_IMAGES) {
            usd = OPENAI_IMAGE_STATIC_PRICES[provider.providerModel] ?? null;
            source = "openai-static";
          } else if (provider.apiProvider === ApiProvider.FAL_AI) {
            usd = FAL_AI_STATIC_PRICES[provider.providerModel] ?? null;
            source = "fal-ai-static";
          } else if (
            provider.apiProvider === ApiProvider.OPENROUTER &&
            isImageModel
          ) {
            const livePrice = openRouterImagePrices.get(provider.providerModel);
            if (livePrice !== undefined) {
              usd = livePrice;
              source = "openrouter-api";
            }
          }

          if (usd === null) {
            logger.debug("No price found for media model", {
              modelId: provider.id,
              provider: provider.apiProvider,
              providerModel: provider.providerModel,
            });
            continue;
          }

          const creditCost = usdToCredits(usd);
          prices.push({
            modelId: provider.id,
            name: def.name,
            provider: provider.apiProvider,
            costUsd: usd,
            creditCost,
            costField,
            source,
          });
        }
      }

      // Update models.ts
      const modelsPath = join(
        process.cwd(),
        "src/app/api/[locale]/agent/models/models.ts",
      );
      let content = readFileSync(modelsPath, "utf-8");

      let updatedCount = 0;
      for (const price of prices) {
        const providerDef = Object.values(modelDefinitions)
          .flatMap((d) => d.providers)
          .find((p) => p.id === price.modelId);

        if (!providerDef) {
          continue;
        }

        const escapedProviderModel = providerDef.providerModel.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

        const costRegex = new RegExp(
          `(providerModel:\\s*"${escapedProviderModel}"[\\s\\S]*?${price.costField}:\\s*)[\\d.]+`,
        );

        if (costRegex.test(content)) {
          const before = content;
          content = content.replace(costRegex, `$1${price.creditCost}`);
          if (content !== before) {
            updatedCount++;
            logger.info("Updated media model price", {
              modelId: price.modelId,
              costField: price.costField,
              creditCost: price.creditCost,
              costUsd: price.costUsd,
              source: price.source,
            });
          }
        } else {
          logger.debug("Could not find price pattern in models.ts", {
            providerModel: providerDef.providerModel,
            costField: price.costField,
          });
        }
      }

      writeFileSync(modelsPath, content, "utf-8");

      logger.info("Media model pricing update completed", {
        totalModels: prices.length,
        updatedCount,
      });

      return success({
        summary: {
          totalModels: prices.length,
          modelsUpdated: updatedCount,
          fileUpdated: updatedCount > 0,
        },
        models: prices.map((p) => ({
          id: p.modelId,
          name: p.name,
          provider: p.provider,
          costUsd: p.costUsd,
          creditCost: p.creditCost,
          source: p.source,
        })),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update media model prices", parsedError);
      return fail({
        message: t("get.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
