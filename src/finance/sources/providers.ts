/**
 * Finance provider adapters (upstream spend / balance, READ-ONLY).
 *
 * Endpoints (found by probing our own accounts):
 *  - OpenRouter  GET  /api/v1/credits                 documented  total_credits, total_usage (balance)
 *                GET  /api/v1/key                     documented  data.usage (this key's spend)
 *  - NanoGPT     POST /api/check-balance              documented  usd_balance
 *  - Venice      GET  /api/v1/api_keys/rate_limits    documented  data.balances.USD
 *  - Gab         GET  /v1/credits and /v1/usage       documented balance and charges in credits
 *                The Gab Plus plan fee is booked separately in the USD rollup.
 *  - ModelsLab   POST /api/wallet_balance             documented  data.balance (USD), key in the body
 *  - Eden AI     GET  /v2/cost_management/credits/    credits (USD); the v3 billing
 *                endpoint refuses inference keys, this one accepts EDEN_AI_API_KEY
 *  - uncensored.ai and FreedomGPT use signed-in dashboard reads (dashboard.ts).
 * Every balance read is free: none of these endpoints bills a call.
 * The usage ledger supplies a USD estimate whenever dashboard usage cannot be
 * measured in dollars.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { z } from "zod";

import {
  chatModelDefinitions,
  ChatModelId,
} from "@/vibe/agent/ai-stream/models-definitions";
import { ApiProvider } from "@/vibe/agent/models/models";

import { FINANCE_CONFIG } from "../config";
import { FinanceSource, type FinanceSourceValue } from "../enum";
import type { LedgerUsageBreakdown, SpendBasis } from "../logic";
import {
  freedomDashboard,
  type ProviderDashboard,
  uncensoredDashboard,
} from "./dashboard";
import type { FinanceHttp } from "./http";
import type { ProviderResult } from "./types";

/** Our own usage log, used when a provider's USD spend is unavailable. */
export interface UsageLedgerPort {
  /** Distinct billed calls on these model IDs, optionally in [from, to). */
  billedCalls(
    modelIds: readonly ChatModelId[],
    window?: { from: Date; to: Date },
  ): Promise<number>;
  /** Who / what was billed on these model ids in [from, to): alert context. */
  usageBreakdown(
    modelIds: readonly ChatModelId[],
    from: Date,
    to: Date,
  ): Promise<LedgerUsageBreakdown>;
}

export interface ProviderAdapter {
  source: typeof FinanceSourceValue;
  label: string;
  /** null = no balance endpoint exists */
  endpoint: string | null;
  /** Why there is no endpoint (recorded as the skip reason). */
  noEndpointReason: string | null;
  /** provider-api = the provider's own figures; usage-ledger = estimated from ours. */
  spendBasis: SpendBasis;
  dashboard?: ProviderDashboard;
  estimateSpend?(
    ledger: UsageLedgerPort,
    from: Date,
    to: Date,
  ): Promise<number | null>;
  /**
   * Usage-ledger providers only: the billed usage behind a spend window, so a
   * spike alert can say who / what drove it. null for provider-api adapters.
   */
  ledgerBreakdown:
    | ((
        ledger: UsageLedgerPort,
        from: Date,
        to: Date,
      ) => Promise<LedgerUsageBreakdown | null>)
    | null;
  fetchBalance(
    http: FinanceHttp,
    apiKey: string,
    ledger: UsageLedgerPort,
  ): Promise<ProviderResult>;
  /** Provider-reported charges in the balance's own unit, in [from, to). */
  fetchSpendNative?(
    http: FinanceHttp,
    apiKey: string,
    from: Date,
    to: Date,
  ): Promise<{ spend: number; reason: null } | { spend: null; reason: string }>;
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

const openRouterKeySchema = z.object({
  data: z.object({ usage: numeric }),
});

const openRouter: ProviderAdapter = {
  source: FinanceSource.OPENROUTER,
  label: "OpenRouter",
  endpoint: "https://openrouter.ai/api/v1/credits",
  noEndpointReason: null,
  spendBasis: "provider-api",
  ledgerBreakdown: null,
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
    // Spend comes from THIS key's usage counter (/api/v1/key), not the
    // account-wide total_usage: dev / local keys share the account and were
    // booked as prod cost (~11% of the week of 2026-11-09). The balance stays
    // account-wide (it is one shared wallet). No per-key reading = null usage,
    // so the spend delta falls back to the balance drop instead of mixing the
    // two counters.
    const keyRes = await http({
      url: "https://openrouter.ai/api/v1/key",
      method: "GET",
      headers: bearer(apiKey),
    });
    const keyParsed =
      keyRes.status === 200 ? openRouterKeySchema.safeParse(keyRes.json) : null;
    const keyUsage =
      keyParsed?.success && Number.isFinite(keyParsed.data.data.usage)
        ? keyParsed.data.data.usage
        : null;
    return {
      status: "ok",
      balanceUsd: balance,
      balanceNative: balance,
      unit: "usd",
      cumulativeUsageUsd: keyUsage,
      ...(keyUsage === null
        ? {
            note: `per-key usage unavailable (HTTP ${keyRes.status}); spend from account balance drop (account usage $${total_usage.toFixed(2)})`,
          }
        : {}),
    };
  },
};

const nanoSchema = z.object({ usd_balance: numeric });

const nanoGpt: ProviderAdapter = {
  source: FinanceSource.NANO_GPT,
  label: "NanoGPT",
  endpoint: "https://nano-gpt.com/api/check-balance",
  noEndpointReason: null,
  spendBasis: "provider-api",
  ledgerBreakdown: null,
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
  spendBasis: "provider-api",
  ledgerBreakdown: null,
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

const gabCredits = numeric.pipe(z.number().nonnegative());

const gabSchema = z.object({
  total_available: gabCredits,
  monthly_allotment: z
    .object({ used: gabCredits, total: gabCredits })
    .optional(),
  purchased: z.object({ available: gabCredits }).optional(),
  monthly_used: gabCredits.optional(),
  monthly_credits: gabCredits.optional(),
  purchased_credits: gabCredits.optional(),
});

const gabUsageSchema = z.object({
  data: z.array(
    z.object({
      created: z.number().int(),
      credits_used: gabCredits,
    }),
  ),
  has_more: z.boolean(),
  last_id: z.string().min(1).nullish(),
});

const gab: ProviderAdapter = {
  source: FinanceSource.GAB,
  label: "Gab AI",
  endpoint: "https://gab.ai/v1/credits",
  noEndpointReason: null,
  spendBasis: "provider-api",
  ledgerBreakdown: null,
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
    if (!parsed.success) {
      return unexpectedShape("Gab");
    }
    const used =
      parsed.data.monthly_allotment?.used ?? parsed.data.monthly_used;
    const total =
      parsed.data.monthly_allotment?.total ?? parsed.data.monthly_credits;
    const purchased =
      parsed.data.purchased?.available ?? parsed.data.purchased_credits ?? 0;
    const allotment =
      used !== undefined && total !== undefined ? { used, total } : null;
    return {
      status: "ok",
      balanceUsd: null,
      balanceNative: parsed.data.total_available,
      unit: "gab-credits",
      cumulativeUsageUsd: null,
      note: `flat-rate plan: $${FINANCE_CONFIG.fixedMonthlyCostUsd.gab.toFixed(2)}/month counted as fixed daily cost${
        allotment
          ? `; ${allotment.used.toFixed(1)} of ${allotment.total.toFixed(0)} monthly credits used`
          : ""
      }${purchased > 0 ? `; ${purchased} purchased credits available` : ""}`,
    };
  },
  async fetchSpendNative(http, apiKey, from, to) {
    const fromSeconds = from.getTime() / 1_000;
    const toSeconds = to.getTime() / 1_000;
    const url = new URL("https://gab.ai/v1/usage");
    url.searchParams.set("start_date", from.toISOString());
    // Gab's upper bound is inclusive and its usage timestamps are Unix seconds.
    url.searchParams.set(
      "end_date",
      new Date(to.getTime() - 1_000).toISOString(),
    );
    url.searchParams.set("limit", "1000");
    const cursors = new Set<string>();
    let spend = 0;
    for (let page = 0; page < FINANCE_CONFIG.maxPages; page += 1) {
      const result = await http({
        url: url.toString(),
        method: "GET",
        headers: bearer(apiKey),
      }).catch(() => null);
      if (result?.status !== 200) {
        return {
          spend: null,
          reason: result
            ? `Gab usage unavailable (HTTP ${result.status})`
            : "Gab usage request failed",
        };
      }
      const parsed = gabUsageSchema.safeParse(result.json);
      if (!parsed.success) {
        return {
          spend: null,
          reason: "Gab usage response has an unexpected shape",
        };
      }
      for (const record of parsed.data.data) {
        if (record.created >= fromSeconds && record.created < toSeconds) {
          spend += record.credits_used;
        }
      }
      if (!parsed.data.has_more) {
        return { spend, reason: null };
      }
      const cursor = parsed.data.last_id;
      if (!cursor || cursors.has(cursor)) {
        return {
          spend: null,
          reason: "Gab usage pagination stopped advancing",
        };
      }
      cursors.add(cursor);
      url.searchParams.set("before", cursor);
    }
    return { spend: null, reason: "Gab usage exceeded the page limit" };
  },
};

const modelsLabSchema = z.object({
  status: z.string().optional(),
  data: z.object({ balance: numeric, currency: z.string().optional() }),
});

const modelsLab: ProviderAdapter = {
  source: FinanceSource.MODELSLAB,
  label: "ModelsLab",
  endpoint: "https://modelslab.com/api/wallet_balance",
  noEndpointReason: null,
  spendBasis: "provider-api",
  ledgerBreakdown: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://modelslab.com/api/wallet_balance",
      method: "POST",
      headers: {},
      body: { key: apiKey },
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = modelsLabSchema.safeParse(res.json);
    if (
      !parsed.success ||
      Number.isNaN(parsed.data.data.balance) ||
      (parsed.data.data.currency !== undefined &&
        parsed.data.data.currency.toLowerCase() !== "usd")
    ) {
      return unexpectedShape("ModelsLab");
    }
    const usd = parsed.data.data.balance;
    return {
      status: "ok",
      balanceUsd: usd,
      balanceNative: usd,
      unit: "usd",
      cumulativeUsageUsd: null,
    };
  },
};

const edenAiSchema = z.object({ credits: numeric });

const edenAi: ProviderAdapter = {
  source: FinanceSource.EDEN_AI,
  label: "Eden AI",
  endpoint: "https://api.edenai.run/v2/cost_management/credits/",
  noEndpointReason: null,
  spendBasis: "provider-api",
  ledgerBreakdown: null,
  async fetchBalance(http, apiKey) {
    const res = await http({
      url: "https://api.edenai.run/v2/cost_management/credits/",
      method: "GET",
      headers: bearer(apiKey),
    });
    if (res.status !== 200) {
      return httpFailure(res.status);
    }
    const parsed = edenAiSchema.safeParse(res.json);
    if (!parsed.success || Number.isNaN(parsed.data.credits)) {
      return unexpectedShape("Eden AI");
    }
    // Eden AI credits are US dollars.
    const usd = parsed.data.credits;
    return {
      status: "ok",
      balanceUsd: usd,
      balanceNative: usd,
      unit: "usd",
      cumulativeUsageUsd: null,
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
  dashboard: ProviderDashboard;
}): ProviderAdapter {
  return {
    source: input.source,
    label: input.label,
    endpoint: input.dashboard.balanceUrl,
    noEndpointReason: null,
    spendBasis: "usage-ledger",
    dashboard: input.dashboard,
    async estimateSpend(ledger, from, to) {
      const { modelIds, unitPriceUsd } = usagePricing(input.apiProvider);
      if (modelIds.length === 0 || unitPriceUsd === null) {
        return null;
      }
      const calls = await ledger.billedCalls(modelIds, { from, to });
      return calls * unitPriceUsd;
    },
    async ledgerBreakdown(ledger, from, to) {
      const pricing = usagePricing(input.apiProvider);
      if (pricing.modelIds.length === 0) {
        return null;
      }
      return await ledger.usageBreakdown(pricing.modelIds, from, to);
    },
    // oxlint-disable-next-line no-unused-vars
    async fetchBalance(_http, _apiKey, ledger) {
      const pricing = usagePricing(input.apiProvider);
      if (pricing.modelIds.length === 0 || pricing.unitPriceUsd === null) {
        return {
          status: "skipped",
          reason:
            "no single per-call price in the model definitions to estimate from",
        };
      }
      const calls = await ledger.billedCalls(pricing.modelIds);
      return {
        status: "ok",
        balanceUsd: null,
        balanceNative: null,
        unit: "usd",
        cumulativeUsageUsd: calls * pricing.unitPriceUsd,
        note: `USD spend ${FINANCE_CONFIG.usageLedgerNote} at $${pricing.unitPriceUsd.toFixed(2)}/call`,
      };
    },
  };
}

const uncensoredAi = usageLedgerAdapter({
  source: FinanceSource.UNCENSORED_AI,
  label: "uncensored.ai",
  apiProvider: ApiProvider.UNCENSORED_AI,
  dashboard: uncensoredDashboard,
});

const freedomGpt = usageLedgerAdapter({
  source: FinanceSource.FREEDOM_GPT,
  label: "FreedomGPT",
  apiProvider: ApiProvider.FREEDOMGPT,
  dashboard: freedomDashboard,
});

export const PROVIDER_ADAPTERS: readonly ProviderAdapter[] = [
  openRouter,
  nanoGpt,
  venice,
  gab,
  uncensoredAi,
  freedomGpt,
  modelsLab,
  edenAi,
];

export function providerLabel(source: typeof FinanceSourceValue): string {
  return (
    PROVIDER_ADAPTERS.find((a) => a.source === source)?.label ?? String(source)
  );
}
