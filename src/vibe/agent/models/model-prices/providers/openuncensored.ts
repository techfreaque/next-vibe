/**
 * OpenUncensored price fetcher. Public, keyless:
 *
 * - GET https://api.openuncensored.com/v1/models/<id>
 *   One model with every host OpenUncensored routes it to: status
 *   (online / degraded / offline), supports_tools and per-1M-token USD
 *   pricing (input, output, cache read).
 *
 * The model-level `pricing` on /v1/models is the minimum over ALL hosts,
 * offline ones included (checked 2026-11-26: GLM 5.3 Flash listed at an
 * offline host's $0.12 while the cheapest online one charged $0.20). The
 * provider sends `X-OU-Strategy: cheapest`, so a call lands on the cheapest
 * host that can serve it. This fetcher stores that host's price: the
 * cheapest ONLINE host that supports tool calls (every chat turn sends
 * tools). No such host = a failure, never a price, so routing keeps the
 * last verified price and the price report flags the route.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { chatModelDefinitions } from "../../../ai-stream/models";
import type { Modality } from "../../enum";
import {
  ApiProvider,
  PRICE_REFERENCE_INPUT_TOKENS,
  PRICE_REFERENCE_OUTPUT_TOKENS,
} from "../../models";
import type { PriceFailure, ProviderPriceResult } from "./base";
import { PriceFetcher } from "./base";
import {
  collectTokenPriceUpdates,
  type TokenPriceEntry,
} from "./token-price-collector";

const MODEL_API_URL = "https://api.openuncensored.com/v1/models";

const hostSchema = z.object({
  name: z.string(),
  status: z.string(),
  supports_tools: z.boolean().nullish(),
  pricing: z
    .object({
      input_per_mtok: z.number().nonnegative().nullish(),
      output_per_mtok: z.number().nonnegative().nullish(),
      cache_read_per_mtok: z.number().nonnegative().nullish(),
      known: z.boolean().nullish(),
    })
    .nullish(),
});
type OpenUncensoredHost = z.infer<typeof hostSchema>;

const modelSchema = z.object({
  id: z.string(),
  available: z.boolean().nullish(),
  context_length: z.number().nullish(),
  tags: z.array(z.string()).nullish(),
  // One odd host entry must not sink the model: it is dropped instead.
  providers: z.array(hostSchema.nullable().catch(null)).nullish(),
});

interface PricedHost {
  name: string;
  input: number;
  output: number;
  cacheRead: number | undefined;
}

function referencePrice(host: PricedHost): number {
  return (
    host.input * PRICE_REFERENCE_INPUT_TOKENS +
    host.output * PRICE_REFERENCE_OUTPUT_TOKENS
  );
}

/** Hosts a tool-calling chat turn can land on, with a billable price. */
function servingHosts(hosts: readonly OpenUncensoredHost[]): PricedHost[] {
  const priced: PricedHost[] = [];
  for (const host of hosts) {
    const pricing = host.pricing;
    if (
      host.status !== "online" ||
      host.supports_tools === false ||
      pricing?.known === false ||
      typeof pricing?.input_per_mtok !== "number" ||
      typeof pricing.output_per_mtok !== "number"
    ) {
      continue;
    }
    priced.push({
      name: host.name,
      input: pricing.input_per_mtok,
      output: pricing.output_per_mtok,
      cacheRead: pricing.cache_read_per_mtok ?? undefined,
    });
  }
  return priced;
}

/**
 * The price a call pays under the "cheapest" strategy: the cheapest serving
 * host. Undefined when no host can serve a tool-calling turn right now.
 */
export function cheapestServingHost(
  hosts: readonly OpenUncensoredHost[],
): PricedHost | undefined {
  return servingHosts(hosts).toSorted(
    (a, b) => referencePrice(a) - referencePrice(b),
  )[0];
}

type ModelLookup =
  | { ok: true; entry: TokenPriceEntry; host: string }
  | { ok: false; reason: string };

async function fetchModel(providerModel: string): Promise<ModelLookup> {
  const url = `${MODEL_API_URL}/${encodeURIComponent(providerModel)}`;
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return { ok: false, reason: `${url} responded with ${response.status}` };
    }
    const parsed = modelSchema.safeParse(await response.json());
    if (!parsed.success) {
      return { ok: false, reason: `${url} returned an unexpected shape` };
    }
    const model = parsed.data;
    if (model.available === false) {
      return { ok: false, reason: `${providerModel} is unavailable` };
    }
    const hosts = (model.providers ?? []).filter(
      (host): host is OpenUncensoredHost => host !== null,
    );
    const cheapest = cheapestServingHost(hosts);
    if (!cheapest) {
      return {
        ok: false,
        reason: `${providerModel}: no online host with tool calls and a known price`,
      };
    }
    const inputs: Modality[] = model.tags?.includes("vision")
      ? ["text", "image"]
      : ["text"];
    return {
      ok: true,
      host: cheapest.name,
      entry: {
        input: cheapest.input,
        output: cheapest.output,
        cacheRead: cheapest.cacheRead,
        contextWindow: model.context_length ?? undefined,
        inputs,
        outputs: ["text"],
      },
    };
  } catch (err) {
    return { ok: false, reason: `${url}: ${parseError(err).message}` };
  }
}

export class OpenUncensoredPriceFetcher extends PriceFetcher {
  readonly providerName = "openuncensored";

  async fetch(logger: EndpointLogger): Promise<ProviderPriceResult> {
    const providerModels = new Set<string>();
    for (const def of Object.values(chatModelDefinitions)) {
      for (const route of def.providers) {
        if (route.apiProvider === ApiProvider.OPENUNCENSORED) {
          providerModels.add(route.providerModel);
        }
      }
    }

    const lookups = new Map<string, ModelLookup>();
    await Promise.all(
      [...providerModels].map(async (providerModel) => {
        lookups.set(providerModel, await fetchModel(providerModel));
      }),
    );
    const failed = [...lookups.values()].filter((lookup) => !lookup.ok);
    if (providerModels.size > 0 && failed.length === providerModels.size) {
      return {
        provider: this.providerName,
        modelsFound: 0,
        modelsUpdated: 0,
        updates: [],
        failures: [],
        error: failed[0]?.ok === false ? failed[0].reason : "no models",
      };
    }
    logger.debug("OpenUncensored model prices fetched", {
      models: providerModels.size,
      hosts: Object.fromEntries(
        [...lookups].map(([id, lookup]) => [id, lookup.ok ? lookup.host : ""]),
      ),
    });

    const { updates, modalityUpdates, settingsUpdates, failures } =
      collectTokenPriceUpdates({
        apiProvider: ApiProvider.OPENUNCENSORED,
        source: "openuncensored-api",
        label: "OpenUncensored",
        lookup: (providerModel) => {
          const lookup = lookups.get(providerModel);
          return lookup?.ok ? lookup.entry : undefined;
        },
      });

    // Say WHY a route got no price (offline hosts, unavailable model)
    // instead of the collector's generic "not found".
    const reasons: PriceFailure[] = failures.map((failure) => {
      const route = [...lookups].find(([id]) =>
        failure.reason.includes(`(${id})`),
      );
      const lookup = route?.[1];
      return lookup && !lookup.ok
        ? { ...failure, reason: `OpenUncensored: ${lookup.reason}` }
        : failure;
    });

    return {
      provider: this.providerName,
      modelsFound: providerModels.size,
      modelsUpdated: updates.filter((u) => u.field === "inputTokenCost").length,
      updates,
      modalityUpdates,
      settingsUpdates,
      failures: reasons,
    };
  }
}
