/**
 * Finance cost providers, derived from model routes and billable tool services.
 *
 * Every API provider any model routes to is a cost provider: a provider added
 * to a model definition shows up in the finance dashboard without touching
 * this module. Finance uses the provider stamped on the ledger, falling back
 * to the model's cheapest route for older rows. Rows without a resolvable
 * provider land in UNATTRIBUTED.
 *
 * Client+server safe. No server imports.
 */

import { TOOL_COST_PROVIDERS } from "@/credits/tool-cost-providers";
import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";
import {
  audioVisionModelOptions,
  imageVisionModelOptions,
  videoVisionModelOptions,
} from "@/vibe/agent/ai-stream/vision-models";
import { allModelDefinitions } from "@/vibe/agent/models/all-models";
import {
  ApiProvider,
  apiProviderDisplayNames,
  getProviderPrice,
} from "@/vibe/agent/models/models";

import { FINANCE_CONFIG } from "./config";

/** Cost bucket for usage rows with no resolvable provider. */
export const UNATTRIBUTED_PROVIDER = "unattributed";

/**
 * Routes that never cost this instance money at a third party: UNBOTTLED is
 * the cloud itself (a self-hosted instance pays it in credits, prod never
 * routes to it). Kept out of the cost list; a model routed only there still
 * resolves to it so its rows are not lost.
 */
const SELF_ROUTES: ReadonlySet<string> = new Set([ApiProvider.UNBOTTLED]);

function buildModelProviderIndex(): ReadonlyMap<string, string> {
  const routes = new Map<string, { provider: string; price: number }>();
  const consider = (id: string, provider: string, price: number): void => {
    const current = routes.get(id);
    const selfNow = current ? SELF_ROUTES.has(current.provider) : true;
    const selfNew = SELF_ROUTES.has(provider);
    if (
      !current ||
      (selfNow && !selfNew) ||
      (selfNow === selfNew && price < current.price)
    ) {
      routes.set(id, { provider, price });
    }
  };
  for (const definition of allModelDefinitions) {
    for (const route of definition.providers) {
      consider(route.id, route.apiProvider, getProviderPrice(route));
    }
  }
  for (const option of [
    ...imageVisionModelOptions,
    ...videoVisionModelOptions,
    ...audioVisionModelOptions,
  ]) {
    consider(option.id, option.apiProvider, Number.POSITIVE_INFINITY);
  }
  const index = new Map<string, string>();
  for (const [id, route] of routes) {
    index.set(id, route.provider);
  }
  return index;
}

const MODEL_PROVIDER_INDEX = buildModelProviderIndex();

const toolServices = Object.values(TOOL_COST_PROVIDERS);

/** Model API providers and billable tool providers, excluding self routes. */
export const COST_PROVIDERS: readonly string[] = [
  ...new Set([
    ...allModelDefinitions.flatMap((d) =>
      d.providers.map((p) => p.apiProvider),
    ),
    ...toolServices.map((service) => service.apiProvider),
  ]),
]
  .filter((p) => !SELF_ROUTES.has(p))
  .toSorted();

/** Cost series keys including the unattributed bucket. */
export const COST_PROVIDER_KEYS: readonly string[] = [
  ...COST_PROVIDERS,
  UNATTRIBUTED_PROVIDER,
];

/** Provider a usage row's model id routes to, or UNATTRIBUTED_PROVIDER. */
export function resolveModelProvider(modelId: string | null): string {
  if (!modelId) {
    return UNATTRIBUTED_PROVIDER;
  }
  return MODEL_PROVIDER_INDEX.get(modelId) ?? UNATTRIBUTED_PROVIDER;
}

/** Model IDs to use when an older usage row has no provider stamp. */
export function legacyModelIdsForProviders(
  providers: readonly ApiProvider[],
): string[] {
  const matches: ReadonlySet<string> = new Set(providers);
  return [...MODEL_PROVIDER_INDEX]
    .filter(([, provider]) => matches.has(provider))
    .map(([modelId]) => modelId);
}

/** Display name of a cost provider key. */
export function costProviderLabel(key: string): string {
  const service = toolServices.find(({ apiProvider }) => apiProvider === key);
  if (service) {
    return service.label;
  }
  const match = Object.values(ApiProvider).find((p) => p === key);
  // eslint-disable-next-line i18next/no-literal-string -- operator-facing label
  return match ? apiProviderDisplayNames[match] : "Unattributed";
}

/**
 * Provider cost of credits charged at the listed price: every listed price is
 * the provider's raw price x (1 + markup), so the raw cost is the charge
 * without the markup. Used only for rows that recorded no real upstream cost.
 */
export function listedCreditsToProviderCostUsd(credits: number): number {
  if (!(credits > 0)) {
    return 0;
  }
  return (
    (credits / (1 + STANDARD_MARKUP_PERCENTAGE)) * FINANCE_CONFIG.creditValueUsd
  );
}

/**
 * Flat-rate plans: these providers cost a fixed fee whatever the usage, so
 * their per-call ledger cost is 0 and the fee is booked per day instead.
 */
export const FLAT_RATE_PROVIDERS: Readonly<Record<string, number>> = {
  [ApiProvider.GAB_AI]: FINANCE_CONFIG.fixedMonthlyCostUsd.gab,
};

/** Series node key for a provider key: "nano-gpt" -> "nano_gpt". */
export function costProviderNodeSuffix(key: string): string {
  return key.replaceAll(/[^a-z0-9]+/gi, "_").toLowerCase();
}
