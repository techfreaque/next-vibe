/**
 * OpenRouter video generation price fetcher.
 *
 * Uses the structured /api/v1/videos/models endpoint (requires auth) which returns:
 *   - supported_resolutions, supported_aspect_ratios, supported_durations, supported_sizes
 *   - pricing_skus with real per-second USD pricing
 *
 * pricing_skus formats:
 *   duration_seconds → flat $/s (also creditCostPerSecond base)
 *   duration_seconds_720p / duration_seconds_1080p → per-resolution $/s
 *   duration_seconds_with_audio / _without_audio → with/without audio variants
 *   cents_per_video_output_second_480p/720p → in cents (÷100 = $/s)
 *   video_tokens → per-token pricing (emit pricingByResolution=null, rely on usage.cost at runtime)
 *   text_to_video_duration_seconds_720p etc → use 720p T2V as base
 *
 * Picks the most representative $/s for creditCostPerSecond and emits pricingByResolution
 * where multiple resolutions exist with different prices.
 */

import "server-only";

import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../../env";
import { videoGenModelDefinitions } from "../../../video-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult, SettingsUpdate } from "./base";
import { PriceFetcher } from "./base";

interface ORVideoModel {
  id: string;
  supported_resolutions: string[] | null;
  supported_aspect_ratios: string[] | null;
  supported_durations: number[] | null;
  supported_frame_images: string[] | null;
  supported_sizes: string[] | null;
  generate_audio: boolean | null;
  pricing_skus: Record<string, string> | null;
  allowed_passthrough_parameters: string[] | null;
}

interface ORVideoModelsResponse {
  data: ORVideoModel[];
}

/**
 * Extract a representative $/s price and per-resolution pricing map from pricing_skus.
 * Returns { baseUsdPerSecond, byResolution } where byResolution may be empty.
 */
function parsePricingSkus(skus: Record<string, string>): {
  baseUsdPerSecond: number | null;
  byResolution: Record<string, number>;
} {
  const byResolution: Record<string, number> = {};

  // Flat duration_seconds → direct $/s
  if (skus.duration_seconds) {
    const v = parseFloat(skus.duration_seconds);
    if (v > 0) {
      return { baseUsdPerSecond: v, byResolution };
    }
  }

  // duration_seconds_with_audio preferred over _without_audio (audio included)
  if (skus.duration_seconds_with_audio) {
    const v = parseFloat(skus.duration_seconds_with_audio);
    if (v > 0) {
      // Collect per-resolution variants
      for (const [k, val] of Object.entries(skus)) {
        const m = /duration_seconds_with_audio_(\w+)/.exec(k);
        if (m?.[1]) {
          byResolution[m[1]] = parseFloat(val);
        }
      }
      return { baseUsdPerSecond: v, byResolution };
    }
  }

  // duration_seconds_without_audio fallback
  if (skus.duration_seconds_without_audio) {
    const v = parseFloat(skus.duration_seconds_without_audio);
    if (v > 0) {
      for (const [k, val] of Object.entries(skus)) {
        const m = /duration_seconds_without_audio_(\w+)/.exec(k);
        if (m?.[1]) {
          byResolution[m[1]] = parseFloat(val);
        }
      }
      return { baseUsdPerSecond: v, byResolution };
    }
  }

  // duration_seconds_<resolution> — collect all, pick 720p or lowest as base
  const resSku: Record<string, number> = {};
  for (const [k, val] of Object.entries(skus)) {
    const m = /^duration_seconds_(\w+)$/.exec(k);
    if (m?.[1] && m[1] !== "with" && m[1] !== "without") {
      resSku[m[1]] = parseFloat(val);
    }
  }
  if (Object.keys(resSku).length > 0) {
    Object.assign(byResolution, resSku);
    const base =
      resSku["720p"] ??
      Object.values(resSku).toSorted((a, b) => a - b)[0] ??
      null;
    return { baseUsdPerSecond: base ?? null, byResolution };
  }

  // text_to_video_duration_seconds_<resolution> — use 720p T2V
  const t2vSku: Record<string, number> = {};
  for (const [k, val] of Object.entries(skus)) {
    const m = /text_to_video_duration_seconds_(\w+)/.exec(k);
    if (m?.[1]) {
      t2vSku[m[1]] = parseFloat(val);
    }
  }
  if (Object.keys(t2vSku).length > 0) {
    Object.assign(byResolution, t2vSku);
    const base =
      t2vSku["720p"] ??
      Object.values(t2vSku).toSorted((a, b) => a - b)[0] ??
      null;
    return { baseUsdPerSecond: base ?? null, byResolution };
  }

  // cents_per_video_output_second_<resolution> → ÷100 for $/s
  const centsSku: Record<string, number> = {};
  for (const [k, val] of Object.entries(skus)) {
    const m = /cents_per_video_output_second_(\w+)/.exec(k);
    if (m?.[1]) {
      centsSku[m[1]] = parseFloat(val) / 100;
    }
  }
  if (Object.keys(centsSku).length > 0) {
    Object.assign(byResolution, centsSku);
    const base =
      centsSku["720p"] ??
      Object.values(centsSku).toSorted((a, b) => a - b)[0] ??
      null;
    return { baseUsdPerSecond: base ?? null, byResolution };
  }

  // video_tokens pricing — can't convert to $/s without token counts; return null
  // The openrouter provider uses usage.cost at runtime for these models.
  return { baseUsdPerSecond: null, byResolution };
}

export class OpenRouterVideoPriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-video";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const settingsUpdates: SettingsUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    if (!agentEnv.OPENROUTER_API_KEY) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        settingsUpdates,
        failures,
        error: "OPENROUTER_API_KEY not set — skipping OR video price fetch",
      };
    }

    let apiModels: ORVideoModel[];
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external OR pricing API
      const res = await fetch("https://openrouter.ai/api/v1/videos/models", {
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENROUTER_API_KEY}`,
        },
      });
      if (!res.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          settingsUpdates,
          failures,
          error: `OR /api/v1/videos/models returned HTTP ${res.status}`,
        };
      }
      const data = (await res.json()) as ORVideoModelsResponse;
      apiModels = data.data ?? [];
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        settingsUpdates,
        failures,
        error: `Failed to fetch OR video models: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    // Build lookup map: providerModel → API data
    const apiMap = new Map<string, ORVideoModel>(
      apiModels.map((m) => [m.id, m]),
    );

    let modelsFound = 0;
    const source = "https://openrouter.ai/api/v1/videos/models";

    for (const def of Object.values(videoGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (providerConfig.apiProvider !== ApiProvider.OPENROUTER) {
          continue;
        }
        if (!("creditCostPerSecond" in providerConfig)) {
          continue;
        }

        const apiModel = apiMap.get(providerConfig.providerModel);
        if (!apiModel) {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `providerModel "${providerConfig.providerModel}" not found in OR /api/v1/videos/models`,
          });
          continue;
        }

        modelsFound++;

        // --- Price ---
        if (apiModel.pricing_skus) {
          const { baseUsdPerSecond, byResolution } = parsePricingSkus(
            apiModel.pricing_skus,
          );

          if (baseUsdPerSecond !== null && baseUsdPerSecond > 0) {
            updates.push({
              modelId: providerConfig.id,
              name: def.name,
              provider: ApiProvider.OPENROUTER,
              field: "creditCostPerSecond",
              value: this.usdToCredits(baseUsdPerSecond),
              source,
              providerModel: providerConfig.providerModel,
            });
          } else {
            // video_tokens pricing — not convertible to $/s; creditCostPerSecond stays 0
            // Runtime cost comes from usage.cost in the polling response
            logger.debug(
              `[OR video] ${providerConfig.providerModel}: video_tokens pricing, no $/s — runtime usage.cost used`,
            );
          }

          if (Object.keys(byResolution).length > 1) {
            const creditsByRes: Record<string, number> = {};
            for (const [res, usd] of Object.entries(byResolution)) {
              creditsByRes[res] = this.usdToCredits(usd);
            }
            settingsUpdates.push({
              providerModel: providerConfig.providerModel,
              field: "pricingByResolution",
              tsLiteral: JSON.stringify(creditsByRes),
              source,
            });
          }
        } else {
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `No pricing_skus for "${providerConfig.providerModel}"`,
          });
        }

        // --- Capabilities ---
        if (apiModel.supported_aspect_ratios?.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedAspectRatios",
            tsLiteral: JSON.stringify(apiModel.supported_aspect_ratios),
            source,
          });
        }
        if (apiModel.supported_resolutions?.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedResolutions",
            tsLiteral: JSON.stringify(apiModel.supported_resolutions),
            source,
          });
        }
        if (apiModel.supported_durations?.length) {
          const sorted = [...apiModel.supported_durations].toSorted(
            (a, b) => a - b,
          );
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedDurations",
            tsLiteral: JSON.stringify(sorted.map(String)),
            source,
          });
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "minDurationSeconds",
            tsLiteral: String(sorted[0]),
            source,
          });
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "maxDurationSeconds",
            tsLiteral: String(sorted[sorted.length - 1]),
            source,
          });
        }
        if (apiModel.supported_frame_images?.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedFrameImages",
            tsLiteral: JSON.stringify(apiModel.supported_frame_images),
            source,
          });
        }
        if (apiModel.generate_audio !== null) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "generateAudio",
            tsLiteral: String(apiModel.generate_audio),
            source,
          });
        }
        if (apiModel.supported_sizes?.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedSizes",
            tsLiteral: JSON.stringify(apiModel.supported_sizes),
            source,
          });
        }
        if (apiModel.allowed_passthrough_parameters?.length) {
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "allowedPassthroughParameters",
            tsLiteral: JSON.stringify(apiModel.allowed_passthrough_parameters),
            source,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound,
      modelsUpdated: updates.length,
      updates,
      settingsUpdates,
      failures,
    };
  }
}
