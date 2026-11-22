/**
 * ModelsLab / Eden AI balance adapters and the USD low-balance floor: no network.
 */

import { describe, expect, it } from "vitest";

import { FinanceSource } from "../enum";
import { detectCreditLowBalance, USD_BALANCE_FLOOR_SOURCES } from "../logic";
import type { FinanceHttp, HttpRequest, JsonValue } from "./http";
import { PROVIDER_ADAPTERS, type UsageLedgerPort } from "./providers";
import type { ProviderResult } from "./types";

const ledger: UsageLedgerPort = {
  billedCalls: () => Promise.resolve(0),
  usageBreakdown: () =>
    Promise.resolve({
      calls: 0,
      billedCredits: 0,
      packCredits: 0,
      freeCredits: 0,
      walletCount: 0,
      topWallets: [],
    }),
};

function fakeHttp(
  status: number,
  json: JsonValue,
): { http: FinanceHttp; calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  return {
    calls,
    http: (request) => {
      calls.push(request);
      return Promise.resolve({ status, json });
    },
  };
}

/** Run one adapter's balance read; a missing adapter fails the test. */
async function readBalance(
  source: typeof FinanceSource.MODELSLAB | typeof FinanceSource.EDEN_AI,
  http: FinanceHttp,
  apiKey: string,
): Promise<ProviderResult> {
  const found = PROVIDER_ADAPTERS.find((a) => a.source === source);
  expect(found).toBeDefined();
  return found
    ? await found.fetchBalance(http, apiKey, ledger)
    : { status: "failed", reason: "no adapter" };
}

describe("ModelsLab balance", () => {
  it("reads data.balance in USD with the key in the body", async () => {
    const { http, calls } = fakeHttp(200, {
      status: "success",
      data: { balance: 8.40042625, currency: "USD" },
    });
    const result = await readBalance(FinanceSource.MODELSLAB, http, "ml-key");
    expect(result).toMatchObject({
      status: "ok",
      balanceUsd: 8.40042625,
      unit: "usd",
    });
    expect(calls[0]).toMatchObject({
      method: "POST",
      url: "https://modelslab.com/api/wallet_balance",
      body: { key: "ml-key" },
    });
  });

  it("refuses a non-USD wallet instead of mislabelling it", async () => {
    const { http } = fakeHttp(200, { data: { balance: 5, currency: "EUR" } });
    const result = await readBalance(FinanceSource.MODELSLAB, http, "k");
    expect(result.status).toBe("failed");
  });
});

describe("Eden AI balance", () => {
  it("reads USD credits with the inference key as Bearer", async () => {
    const { http, calls } = fakeHttp(200, { credits: 6.080947282 });
    const result = await readBalance(FinanceSource.EDEN_AI, http, "eden-key");
    expect(result).toMatchObject({ status: "ok", balanceUsd: 6.080947282 });
    expect(calls[0]?.headers.Authorization).toBe("Bearer eden-key");
  });

  it("reports an HTTP failure", async () => {
    const { http } = fakeHttp(401, { detail: "nope" });
    const result = await readBalance(FinanceSource.EDEN_AI, http, "k");
    expect(result).toEqual({ status: "failed", reason: "HTTP 401" });
  });
});

describe("USD low-balance floor", () => {
  it("covers ModelsLab and Eden AI and speaks dollars", () => {
    expect(USD_BALANCE_FLOOR_SOURCES.has(FinanceSource.MODELSLAB)).toBe(true);
    expect(USD_BALANCE_FLOOR_SOURCES.has(FinanceSource.EDEN_AI)).toBe(true);
    const alert = detectCreditLowBalance({
      provider: FinanceSource.MODELSLAB,
      providerLabel: "ModelsLab",
      balanceCredits: 2,
      warningCredits: 5,
      unit: "usd",
    });
    expect(alert?.message).toContain("$2.00 remaining, below $2.50");
  });
});
