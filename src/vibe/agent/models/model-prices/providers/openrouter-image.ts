/**
 * OpenRouter image generation price fetcher.
 *
 * Uses the structured image API (requires auth):
 *   GET https://openrouter.ai/api/v1/images/models                 - model list
 *   GET https://openrouter.ai/api/v1/images/models/<id>/endpoints  - per-provider pricing
 *
 * Endpoint pricing rows: { billable, unit, cost_usd, variant? }.
 * Only `billable: "output_image"` rows set the per-image price:
 *   unit "image"     - USD per image
 *   unit "megapixel" - USD per MP (priced at 1 MP ≈ 1024×1024)
 *   unit "token"     - token-priced (gpt-image, gemini, mai-image, ...): not a
 *                      flat per-image price, reported as a failure
 *   unit "request"   - surcharges, ignored
 * Variants:
 *   none                       - base price
 *   "768" / "1k" / "2k" / "4k" - resolution tiers → supportedResolutions and
 *                                pricingByResolution ("768px", "1024px", ...);
 *                                the base row is the smallest uncovered resolution
 *   anything else              - (high_resolution, low_1k, style_references, ...)
 *                                ignored for tiers; used as base (cheapest) only
 *                                when there is no base row
 *
 * Token-based image models (gemini image-preview, gpt-5-image, etc.) defined with
 * inputTokenCost/outputTokenCost are priced by openrouter-token instead.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { agentEnv } from "../../../env";
import { imageGenModelDefinitions } from "../../../image-generation/models";
import { ApiProvider } from "../../models";
import type { ProviderPriceResult, SettingsUpdate } from "./base";
import { PriceFetcher } from "./base";

const imageModelsResponseSchema = z.object({
  data: z.array(z.object({ id: z.string() })),
});

const pricingRowSchema = z.object({
  billable: z.string(),
  unit: z.string(),
  cost_usd: z.number(),
  variant: z.string().optional(),
});

const imageEndpointSchema = z.object({
  provider_slug: z.string(),
  supported_parameters: z
    .object({
      resolution: z
        .object({ values: z.array(z.string()).optional() })
        .optional(),
    })
    .optional(),
  pricing: z.array(pricingRowSchema),
});

const imageEndpointsResponseSchema = z.object({
  id: z.string(),
  endpoints: z.array(imageEndpointSchema),
});

type ImageEndpoint = z.infer<typeof imageEndpointSchema>;

interface ParsedImageModel {
  usdPerImage: number;
  /** resolution label → USD price (e.g. { "1024px": 0.15, "2048px": 0.15, "4096px": 0.33 }) */
  resolutionTiers?: Record<string, number>;
}

type EndpointPriceResult =
  | { ok: true; parsed: ParsedImageModel }
  | { ok: false; reason: string };

type EndpointsFetchResult =
  | { ok: true; endpoints: ImageEndpoint[] }
  | { ok: false; reason: string; transient: boolean };

const BASE_URL = "https://openrouter.ai/api/v1/images/models";
const ENDPOINT_FETCH_CONCURRENCY = 4;

/**
 * Convert an OpenRouter resolution token ("1K", "1.5k", "4K", "768") to pixels
 * on the long edge. Returns null for anything that is not a pure resolution.
 */
function resolutionToPx(token: string): number | null {
  const k = /^(\d+(?:\.\d+)?)k$/i.exec(token.trim());
  if (k?.[1]) {
    return Math.round(parseFloat(k[1]) * 1024);
  }
  const px = /^(\d+)$/.exec(token.trim());
  if (px?.[1]) {
    return parseInt(px[1], 10);
  }
  return null;
}

function pxLabel(px: number): string {
  return `${px}px`;
}

/** Derive the per-image USD price and resolution tiers from one endpoint. */
function parseEndpointPrice(endpoint: ImageEndpoint): EndpointPriceResult {
  const outputRows = endpoint.pricing.filter(
    (row) => row.billable === "output_image",
  );
  if (outputRows.length === 0) {
    return { ok: false, reason: "no output_image pricing" };
  }
  if (outputRows.some((row) => row.unit === "token")) {
    return {
      ok: false,
      reason: "token-priced output (no flat per-image price)",
    };
  }

  const priced = outputRows.filter(
    (row) =>
      (row.unit === "image" || row.unit === "megapixel") && row.cost_usd > 0,
  );
  if (priced.length === 0) {
    return { ok: false, reason: "no per-image or per-megapixel price" };
  }

  const baseRow = priced.find((row) => row.variant === undefined);

  // Megapixel pricing: 1 MP default, no resolution tiers.
  if (priced.some((row) => row.unit === "megapixel")) {
    const mpRow =
      baseRow ??
      priced
        .filter((row) => row.unit === "megapixel")
        .toSorted((a, b) => a.cost_usd - b.cost_usd)[0];
    return mpRow
      ? { ok: true, parsed: { usdPerImage: mpRow.cost_usd } }
      : { ok: false, reason: "no megapixel price" };
  }

  // Pure resolution variants → tiers keyed by "<px>px".
  const tiersByPx = new Map<number, number>();
  for (const row of priced) {
    if (row.variant === undefined) {
      continue;
    }
    const px = resolutionToPx(row.variant);
    if (px !== null) {
      tiersByPx.set(px, row.cost_usd);
    }
  }

  if (tiersByPx.size > 0 && baseRow) {
    // The unlabelled base row prices the smallest supported resolution that
    // has no variant of its own (Riverflow: base = 1K, variants 2k/4k).
    const supportedPx = (
      endpoint.supported_parameters?.resolution?.values ?? []
    )
      .map(resolutionToPx)
      .filter((px): px is number => px !== null)
      .toSorted((a, b) => a - b);
    const basePx =
      supportedPx.find((px) => !tiersByPx.has(px)) ??
      (tiersByPx.has(1024) ? null : 1024);
    if (basePx !== null) {
      tiersByPx.set(basePx, baseRow.cost_usd);
    }
  }

  const sortedTiers = [...tiersByPx.entries()].toSorted(([a], [b]) => a - b);
  const resolutionTiers =
    sortedTiers.length > 1
      ? Object.fromEntries(
          sortedTiers.map(([px, usd]): [string, number] => [pxLabel(px), usd]),
        )
      : undefined;

  if (baseRow) {
    return {
      ok: true,
      parsed: { usdPerImage: baseRow.cost_usd, resolutionTiers },
    };
  }

  // No base row: 1K tier, else the cheapest variant (e.g. Grok low_1k).
  const oneK = tiersByPx.get(1024);
  const cheapest = priced.toSorted((a, b) => a.cost_usd - b.cost_usd)[0];
  const usdPerImage = oneK ?? cheapest?.cost_usd;
  return usdPerImage !== undefined
    ? { ok: true, parsed: { usdPerImage, resolutionTiers } }
    : { ok: false, reason: "no base price" };
}

/** Pick the cheapest per-image endpoint; report the first failure reason otherwise. */
function parseModelPrice(endpoints: ImageEndpoint[]): EndpointPriceResult {
  if (endpoints.length === 0) {
    return { ok: false, reason: "no endpoints" };
  }
  let best: ParsedImageModel | null = null;
  const reasons: string[] = [];
  for (const endpoint of endpoints) {
    const result = parseEndpointPrice(endpoint);
    if (!result.ok) {
      reasons.push(`${endpoint.provider_slug}: ${result.reason}`);
      continue;
    }
    if (!best || result.parsed.usdPerImage < best.usdPerImage) {
      best = result.parsed;
    }
  }
  return best
    ? { ok: true, parsed: best }
    : { ok: false, reason: reasons.join("; ") };
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const index = next;
      next++;
      const item = items[index];
      if (item !== undefined) {
        results[index] = await fn(item);
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

export class OpenRouterImagePriceFetcher extends PriceFetcher {
  readonly providerName = "openrouter-image";

  private async fetchEndpoints(
    providerModel: string,
    apiKey: string,
  ): Promise<EndpointsFetchResult> {
    const url = `${BASE_URL}/${providerModel}/endpoints`;
    let lastReason = "unknown error";
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // oxlint-disable-next-line restricted/no-raw-fetch -- external OR pricing API
        const res = await fetch(url, {
          headers: {
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${apiKey}`,
          },
        });
        if (res.status === 404) {
          return {
            ok: false,
            reason: `HTTP 404 from ${url}`,
            transient: false,
          };
        }
        if (!res.ok) {
          lastReason = `HTTP ${res.status} from ${url}`;
          continue;
        }
        const parsed = imageEndpointsResponseSchema.safeParse(await res.json());
        if (!parsed.success) {
          return {
            ok: false,
            reason: `Unexpected endpoints response shape: ${parsed.error.message}`,
            transient: false,
          };
        }
        return { ok: true, endpoints: parsed.data.endpoints };
      } catch (err) {
        lastReason = parseError(err).message;
      }
    }
    return { ok: false, reason: lastReason, transient: true };
  }

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const updates: ProviderPriceResult["updates"] = [];
    const settingsUpdates: SettingsUpdate[] = [];
    const failures: ProviderPriceResult["failures"] = [];

    const apiKey = agentEnv.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        settingsUpdates,
        failures,
        error: "OPENROUTER_API_KEY not set, skipping OR image price fetch",
        failedApiProviders: [ApiProvider.OPENROUTER],
      };
    }

    // 1. Model list: which ids OpenRouter still serves.
    const listedIds = new Set<string>();
    try {
      // oxlint-disable-next-line restricted/no-raw-fetch -- external OR pricing API
      const response = await fetch(BASE_URL, {
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!response.ok) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          settingsUpdates,
          failures,
          error: `OR /api/v1/images/models returned HTTP ${response.status}`,
          failedApiProviders: [ApiProvider.OPENROUTER],
        };
      }
      const parsed = imageModelsResponseSchema.safeParse(await response.json());
      if (!parsed.success) {
        return {
          provider: this.providerName,
          modelsFound: 0,
          modelsUpdated: 0,
          updates,
          settingsUpdates,
          failures,
          error: `Unexpected OR /api/v1/images/models response shape: ${parsed.error.message}`,
          failedApiProviders: [ApiProvider.OPENROUTER],
        };
      }
      for (const model of parsed.data.data) {
        listedIds.add(model.id);
      }
      logger.debug("OpenRouter image models listed", {
        count: listedIds.size,
      });
    } catch (err) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates,
        settingsUpdates,
        failures,
        error: parseError(err).message,
        failedApiProviders: [ApiProvider.OPENROUTER],
      };
    }

    // 2. Per-model endpoints, only for the per-image models we define.
    const wantedModels = new Set<string>();
    for (const def of Object.values(imageGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider === ApiProvider.OPENROUTER &&
          "creditCostPerImage" in providerConfig &&
          listedIds.has(providerConfig.providerModel)
        ) {
          wantedModels.add(providerConfig.providerModel);
        }
      }
    }

    const priceMap = new Map<string, ParsedImageModel>();
    const priceFailureReasons = new Map<string, string>();
    let transientFailure = false;
    const wantedList = [...wantedModels];
    const fetched = await mapWithConcurrency(
      wantedList,
      ENDPOINT_FETCH_CONCURRENCY,
      (providerModel) => this.fetchEndpoints(providerModel, apiKey),
    );
    wantedList.forEach((providerModel, index) => {
      const result = fetched[index];
      if (!result) {
        priceFailureReasons.set(providerModel, "endpoints fetch did not run");
        return;
      }
      if (!result.ok) {
        transientFailure ||= result.transient;
        priceFailureReasons.set(providerModel, result.reason);
        return;
      }
      const price = parseModelPrice(result.endpoints);
      if (price.ok) {
        priceMap.set(providerModel, price.parsed);
      } else {
        priceFailureReasons.set(providerModel, price.reason);
      }
    });
    logger.debug("OpenRouter image prices fetched", {
      requested: wantedList.length,
      priced: priceMap.size,
    });

    const source = "openrouter-api";

    for (const def of Object.values(imageGenModelDefinitions)) {
      for (const providerConfig of def.providers) {
        if (
          providerConfig.apiProvider !== ApiProvider.OPENROUTER ||
          !("creditCostPerImage" in providerConfig)
        ) {
          continue;
        }

        const parsed = priceMap.get(providerConfig.providerModel);
        if (!parsed) {
          const reason = listedIds.has(providerConfig.providerModel)
            ? (priceFailureReasons.get(providerConfig.providerModel) ??
              "no price")
            : "not found in /api/v1/images/models";
          failures.push({
            modelId: providerConfig.id,
            provider: ApiProvider.OPENROUTER,
            reason: `OpenRouter image API (${providerConfig.providerModel}): ${reason}`,
          });
          continue;
        }

        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: ApiProvider.OPENROUTER,
          field: "creditCostPerImage",
          value: this.usdToCredits(parsed.usdPerImage),
          source,
          providerModel: providerConfig.providerModel,
        });

        // Emit resolution tier pricing and supportedResolutions when available
        if (parsed.resolutionTiers) {
          const resLabels = Object.keys(parsed.resolutionTiers);

          // supportedResolutions: ["1024px", "2048px", "4096px"]
          const resStrings = resLabels.map((r) => `"${r}"`);
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "supportedResolutions",
            tsLiteral: `[${resStrings.join(", ")}]`,
            source,
          });

          // pricingByResolution: { "1024px": credits, "2048px": credits, ... }
          const creditsMap: Record<string, number> = {};
          for (const [label, usd] of Object.entries(parsed.resolutionTiers)) {
            creditsMap[label] = this.usdToCredits(usd);
          }
          const pricingLiteral = JSON.stringify(creditsMap).replaceAll(
            ",",
            ", ",
          );
          settingsUpdates.push({
            providerModel: providerConfig.providerModel,
            field: "pricingByResolution",
            tsLiteral: pricingLiteral,
            source,
          });
        }
      }
    }

    return {
      provider: this.providerName,
      modelsFound: priceMap.size,
      modelsUpdated: updates.length,
      updates,
      settingsUpdates,
      failures,
      // A transient endpoints failure means some models could not be checked
      // this run: keep the disable logic from treating them as delisted.
      ...(transientFailure
        ? { failedApiProviders: [ApiProvider.OPENROUTER] }
        : {}),
    };
  }
}
