/**
 * Finance provider adapters (upstream spend / balance, READ-ONLY).
 *
 * Endpoints (found by probing our own accounts):
 *  - OpenRouter  GET  /api/v1/credits                 documented  total_credits, total_usage
 *  - NanoGPT     POST /api/check-balance              documented  usd_balance
 *  - Venice      GET  /api/v1/api_keys/rate_limits    documented  data.balances.USD
 *  - Gab         GET  /v1/credits                     undocumented total_available (own credit unit)
 *  - uncensored.ai   none: credits live in a Supabase table read with the dashboard
 *                    session, there is no API-key balance endpoint
 *  - FreedomGPT  none: /credits /balance /usage /user all 404
 * A provider with no endpoint is skipped with a recorded reason, never an error.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { z } from "zod";

import { FINANCE_CONFIG } from "../config";
import { FinanceSource, type FinanceSourceValue } from "../enum";
import type { FinanceHttp } from "./http";
import type { ProviderResult } from "./types";

export interface ProviderAdapter {
  source: typeof FinanceSourceValue;
  label: string;
  /** null = no balance endpoint exists */
  endpoint: string | null;
  /** Why there is no endpoint (recorded as the skip reason). */
  noEndpointReason: string | null;
  fetchBalance(http: FinanceHttp, apiKey: string): Promise<ProviderResult>;
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
  monthly_allotment: z.object({ used: numeric }).optional(),
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
    const unitUsd = FINANCE_CONFIG.nativeUnitUsd.gab;
    const used = parsed.data.monthly_allotment?.used;
    return {
      status: "ok",
      balanceUsd:
        unitUsd === null ? null : parsed.data.total_available * unitUsd,
      balanceNative: parsed.data.total_available,
      unit: "gab-credits",
      cumulativeUsageUsd:
        unitUsd === null || used === undefined ? null : used * unitUsd,
    };
  },
};

const uncensoredAi: ProviderAdapter = {
  source: FinanceSource.UNCENSORED_AI,
  label: "uncensored.ai",
  endpoint: null,
  noEndpointReason:
    "no API-key balance endpoint: the credit balance sits in the dashboard (Supabase api_keys.credits_remaining) behind a logged-in session; the JS bundle exposes no key-authenticated route",
  async fetchBalance() {
    return {
      status: "skipped",
      reason: uncensoredAi.noEndpointReason ?? "no endpoint",
    };
  },
};

const freedomGpt: ProviderAdapter = {
  source: FinanceSource.FREEDOM_GPT,
  label: "FreedomGPT",
  endpoint: null,
  noEndpointReason:
    "no balance endpoint: /api/v1/credits, /balance, /usage and /user all return 404",
  async fetchBalance() {
    return {
      status: "skipped",
      reason: freedomGpt.noEndpointReason ?? "no endpoint",
    };
  },
};

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
