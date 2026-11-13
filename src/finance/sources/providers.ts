/**
 * Finance provider adapters (upstream spend / balance, READ-ONLY).
 *
 * Endpoints (found by probing our own accounts):
 *  - OpenRouter  GET  /api/v1/credits                 documented  total_credits, total_usage
 *  - NanoGPT     POST /api/check-balance              documented  usd_balance
 *  - Venice      GET  /api/v1/api_keys/rate_limits    documented  data.balances.USD
 *  - Gab         GET  /v1/credits                     undocumented total_available (own credit unit)
 *                Flat-rate "Gab Plus" plan: credits are a monthly allotment, the
 *                real cost is the plan fee (FINANCE_CONFIG.fixedMonthlyCostUsd),
 *                added to each tracked day by the rollup.
 *  - uncensored.ai   no API: credits live in a Supabase table read with the
 *                    dashboard session (re-probed 2026-11-12: /api/* is the SPA
 *                    fallback, api.uncensored.ai does not resolve)
 *  - FreedomGPT  no API: /credits /balance /usage /user all 404
 * The two API-less providers are priced from OUR usage log instead: billed calls
 * in credit_transactions x the per-call raw price from the model definitions,
 * reported as a cumulative usage counter so the same snapshot / delta / anomaly
 * machinery as OpenRouter applies.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { z } from "zod";

import {
  ChatModelId,
  chatModelDefinitions,
} from "@/vibe/agent/ai-stream/models-definitions";
import { ApiProvider } from "@/vibe/agent/models/models";

import { FINANCE_CONFIG } from "../config";
import { FinanceSource, type FinanceSourceValue } from "../enum";
import type { FinanceHttp } from "./http";
import type { ProviderResult } from "./types";

/** Our own usage log, for providers that expose no spend / balance API. */
export interface UsageLedgerPort {
  /** Distinct billed calls (all time) on these model ids. */
  billedCalls(modelIds: readonly ChatModelId[]): Promise<number>;
}

export interface ProviderAdapter {
  source: typeof FinanceSourceValue;
  label: string;
  /** null = no balance endpoint exists */
  endpoint: string | null;
  /** Why there is no endpoint (recorded as the skip reason). */
  noEndpointReason: string | null;
  fetchBalance(
    http: FinanceHttp,
    apiKey: string,
    ledger: UsageLedgerPort,
  ): Promise<ProviderResult>;
}

const bearer = (apiKey: string): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
});

const numeric = z.union([z.number(), z.string()]).transform((v) => Number(v));

function httpFailure(status: number): ProviderResult {
  return { status: "failed", reason: `HTTP ${status}` };
}

function unexpectedShape(label: string): ProviderResult {
  return { status: "failed", reason: `${label}: unexpected response shape` };
}

const openRouterSchema = z.object({
  data: z.object({ total_credits: numeric, total_usage: numeric }),
});

const openRouter: ProviderAdapter = {
  source: FinanceSource.OPENROUTER,
  label: "OpenRouter",
  endpoint: "https://openrouter.ai/api/v1/credits",
  noEndpointReason: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://openrouter.ai/api/v1/credits",
      method: "GET",
      headers: bearer(apiKey),
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = openRouterSchema.safeParse(res.json);
    if (!parsed.success) {
      return unexpectedShape("OpenRouter");
    }
    const { total_credits, total_usage } = parsed.data.data;
    const balance = total_credits - total_usage;
    return {
      status: "ok",
      balanceUsd: balance,
      balanceNative: balance,
      unit: "usd",
      cumulativeUsageUsd: total_usage,
    };
  },
};

const nanoSchema = z.object({ usd_balance: numeric });

const nanoGpt: ProviderAdapter = {
  source: FinanceSource.NANO_GPT,
  label: "NanoGPT",
  endpoint: "https://nano-gpt.com/api/check-balance",
  noEndpointReason: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://nano-gpt.com/api/check-balance",
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: {},
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = nanoSchema.safeParse(res.json);
    if (!parsed.success || Number.isNaN(parsed.data.usd_balance)) {
      return unexpectedShape("NanoGPT");
    }
    return {
      status: "ok",
      balanceUsd: parsed.data.usd_balance,
      balanceNative: parsed.data.usd_balance,
      unit: "usd",
      cumulativeUsageUsd: null,
    };
  },
};

const veniceSchema = z.object({
  data: z.object({ balances: z.object({ USD: numeric }) }),
});

const venice: ProviderAdapter = {
  source: FinanceSource.VENICE,
  label: "Venice",
  endpoint: "https://api.venice.ai/api/v1/api_keys/rate_limits",
  noEndpointReason: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://api.venice.ai/api/v1/api_keys/rate_limits",
      method: "GET",
      headers: bearer(apiKey),
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = veniceSchema.safeParse(res.json);
    if (!parsed.success || Number.isNaN(parsed.data.data.balances.USD)) {
      return unexpectedShape("Venice");
    }
    const usd = parsed.data.data.balances.USD;
    return {
      status: "ok",
      balanceUsd: usd,
      balanceNative: usd,
      unit: "usd",
      cumulativeUsageUsd: null,
    };
  },
};

const gabSchema = z.object({
  total_available: numeric,
  monthly_allotment: z
    .object({ used: numeric, total: numeric.optional() })
    .optional(),
  purchased: z.object({ available: numeric }).optional(),
});

const gab: ProviderAdapter = {
  source: FinanceSource.GAB,
  label: "Gab AI",
  endpoint: "https://gab.ai/v1/credits",
  noEndpointReason: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://gab.ai/v1/credits",
      method: "GET",
      headers: bearer(apiKey),
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = gabSchema.safeParse(res.json);
    if (!parsed.success || Number.isNaN(parsed.data.total_available)) {
      return unexpectedShape("Gab");
    }
    // Gab bills in its own credit unit; USD only when a unit price is configured.
    // The plan fee itself is a fixed cost the rollup adds per day.
    const unitUsd = FINANCE_CONFIG.nativeUnitUsd.gab;
    const used = parsed.data.monthly_allotment?.used;
    const total = parsed.data.monthly_allotment?.total;
    const allotment =
      used !== undefined && total !== undefined ? { used, total } : null;
    return {
      status: "ok",
      balanceUsd:
        unitUsd === null ? null : parsed.data.total_available * unitUsd,
      balanceNative: parsed.data.total_available,
      unit: "gab-credits",
      cumulativeUsageUsd:
        unitUsd === null || used === undefined ? null : used * unitUsd,
      note: `flat-rate plan: $${FINANCE_CONFIG.fixedMonthlyCostUsd.gab.toFixed(2)}/month counted as fixed daily cost${
        allotment
          ? `; ${allotment.used.toFixed(1)} of ${allotment.total.toFixed(0)} monthly credits used`
          : ""
      }${parsed.data.purchased && parsed.data.purchased.available > 0 ? `; ${parsed.data.purchased.available} purchased credits (unpriced)` : ""}`,
    };
  },
};

/** Model ids served by a provider and its raw per-call price (USD). */
export interface UsagePricing {
  modelIds: ChatModelId[];
  /** null when the provider's models are not priced per call, or disagree */
  unitPriceUsd: number | null;
}

/**
 * Per-call price of a provider from the model definitions: the creditCost of
 * each model's entry for that apiProvider (raw upstream cost, before markup).
 * One call count can only be priced when every model on the provider agrees.
 */
export function usagePricing(apiProvider: ApiProvider): UsagePricing {
  const modelIds: ChatModelId[] = [];
  const prices = new Set<number>();
  for (const modelId of Object.values(ChatModelId)) {
    for (const p of chatModelDefinitions[modelId].providers) {
      if (p.apiProvider !== apiProvider) {
        continue;
      }
      modelIds.push(modelId);
      prices.add(typeof p.creditCost === "number" ? p.creditCost : Number.NaN);
    }
  }
  const [only] = [...prices];
  return {
    modelIds,
    unitPriceUsd:
      prices.size === 1 && only !== undefined && Number.isFinite(only)
        ? only * FINANCE_CONFIG.creditValueUsd
        : null,
  };
}

function usageLedgerAdapter(input: {
  source: typeof FinanceSourceValue;
  label: string;
  apiProvider: ApiProvider;
  noApiReason: string;
}): ProviderAdapter {
  return {
    source: input.source,
    label: input.label,
    endpoint: "usage-ledger:credit_transactions",
    noEndpointReason: null,
    // oxlint-disable-next-line no-unused-vars
    async fetchBalance(_http, _apiKey, ledger) {
      const pricing = usagePricing(input.apiProvider);
      if (pricing.modelIds.length === 0 || pricing.unitPriceUsd === null) {
        return {
          status: "skipped",
          reason: `${input.noApiReason}; no single per-call price in the model definitions to estimate from`,
        };
      }
      const calls = await ledger.billedCalls(pricing.modelIds);
      return {
        status: "ok",
        balanceUsd: null,
        balanceNative: calls,
        unit: "calls",
        cumulativeUsageUsd: calls * pricing.unitPriceUsd,
        note: `${input.noApiReason}: spend ${FINANCE_CONFIG.usageLedgerNote} at $${pricing.unitPriceUsd.toFixed(2)}/call`,
      };
    },
  };
}

const uncensoredAi = usageLedgerAdapter({
  source: FinanceSource.UNCENSORED_AI,
  label: "uncensored.ai",
  apiProvider: ApiProvider.UNCENSORED_AI,
  noApiReason:
    "no API-key balance endpoint (credits sit in the logged-in dashboard)",
});

const freedomGpt = usageLedgerAdapter({
  source: FinanceSource.FREEDOM_GPT,
  label: "FreedomGPT",
  apiProvider: ApiProvider.FREEDOMGPT,
  noApiReason: "no balance endpoint (/credits /balance /usage /user all 404)",
});

export const PROVIDER_ADAPTERS: readonly ProviderAdapter[] = [
  openRouter,
  nanoGpt,
  venice,
  gab,
  uncensoredAi,
  freedomGpt,
];

export function providerLabel(source: typeof FinanceSourceValue): string {
  return (
    PROVIDER_ADAPTERS.find((a) => a.source === source)?.label ?? String(source)
  );
}
