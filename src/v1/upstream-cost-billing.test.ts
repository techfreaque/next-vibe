/**
 * /v1 billing of OpenRouter per-token models: every call bills the REAL
 * upstream cost (usage.cost) x markup, like chat turns, on all three wire
 * formats, streaming and non-streaming. A call without a reported cost falls
 * back to the listed token price with a warning. Exactly one charge per call.
 * Inference goes through an injected fake runner (no provider call, no real
 * spend); keys, auth, model resolution and the credit ledger are real.
 */

import type { ProviderMetadata } from "ai";
import { and, eq, inArray } from "drizzle-orm";
import {
  type ChatModelOption,
  chatModelOptionsPool,
} from "next-vibe/agent/ai-stream/models";
import {
  billsUpstreamCost,
  TokenAccumulator,
} from "next-vibe/agent/ai-stream/repository/loop/token-accumulator";
import {
  createE2ECreditUser,
  type E2ECreditUser,
} from "next-vibe/agent/ai-stream/testing/e2e-credit-user";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  calculateCreditCost,
  upstreamCostToCredits,
} from "next-vibe/agent/models/models";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type {
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ApiKeyAuth } from "@/api-keys/auth";
import apiKeysEndpoints from "@/api-keys/definition";
import { creditTransactions } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { V1ChatCompletionsRepository } from "./chat/completions/repository";
import { scopedTranslation } from "./i18n";
import { V1MessagesRepository } from "./messages/repository";
import { V1ModelsRepository } from "./models/repository";
import { V1ResponsesRepository } from "./responses/repository";
import { chatTokenPricing } from "./shared/chat-pricing";
import type { InferenceRunner, InferenceUsage } from "./shared/inference";
import { listUserCallableModels } from "./shared/models";
import { mockV1Providers } from "./test-providers";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: creditsT } = creditsScopedTranslation.scopedT(defaultLocale);

const USAGE: InferenceUsage = {
  inputTokens: 20_000,
  outputTokens: 2_000,
  cachedInputTokens: 5_000,
  cacheWriteTokens: 2_000,
  reasoningTokens: 0,
};
/** Real upstream cost of one call: an endpoint far pricier than the list price. */
const UPSTREAM_USD = 0.0731;

function openRouterMeta(cost: number): ProviderMetadata {
  return { openrouter: { provider: "Parasail", usage: { cost } } };
}

/** A text runner whose calls report `meta` (undefined = no real cost). */
function runnerWith(meta: ProviderMetadata | undefined, usage: InferenceUsage = USAGE): InferenceRunner {
  return {
    generate: () =>
      Promise.resolve({
        text: "Hello there",
        toolCalls: [],
        parts: [{ type: "text", text: "Hello there" }],
        finishReason: "stop",
        usage,
        providerMetadata: meta,
      }),
    async *stream() {
      yield { type: "text", text: "Hello " };
      yield { type: "text", text: "there" };
      yield {
        type: "finish",
        finishReason: "stop",
        usage,
        providerMetadata: meta,
      };
    },
  };
}

function anonymous(): JWTPublicPayloadType {
  return { isPublic: true, leadId: "", roles: [UserPermissionRole.PUBLIC] };
}

function v1Request(path: string, key: string, body: string): Request {
  return new Request(`http://localhost/api/en-US/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "anthropic-version": "2023-06-01",
    },
    body,
  });
}

async function authed(
  request: Request,
): Promise<JwtPrivatePayloadType | JWTPublicPayloadType> {
  const auth = await ApiKeyAuth.authenticateRequest(request, defaultLocale, logger);
  return auth?.success ? auth.data : anonymous();
}

type Format = "chat" | "responses" | "messages";

/** One call in `format`; returns the drained response (billing is done). */
async function call(
  format: Format,
  key: string,
  model: string,
  stream: boolean,
  runner: InferenceRunner,
): Promise<Response> {
  const common = {
    locale: defaultLocale,
    logger,
    t,
    toolExecutionContext: rootlessToolExecutionContext(),
    runner,
  };
  if (format === "chat") {
    const data = {
      model,
      stream,
      // The credits_charged usage chunk is opt-in on chat completions streams.
      ...(stream ? { stream_options: { include_usage: true } } : {}),
      messages: [{ role: "user" as const, content: "hi" }],
    };
    const request = v1Request("/chat/completions", key, JSON.stringify(data));
    const out = await V1ChatCompletionsRepository.complete({
      ...common,
      data,
      user: await authed(request),
      request,
    });
    return out.response;
  }
  if (format === "responses") {
    const data = { model, stream, input: "hi", store: false };
    const request = v1Request("/responses", key, JSON.stringify(data));
    const out = await V1ResponsesRepository.create({
      ...common,
      data,
      user: await authed(request),
      request,
    });
    return out.response;
  }
  const data = {
    model,
    stream,
    max_tokens: 1024,
    messages: [{ role: "user" as const, content: "hi" }],
  };
  const request = v1Request("/messages", key, JSON.stringify(data));
  const out = await V1MessagesRepository.create({
    ...common,
    data,
    user: await authed(request),
    request,
  });
  return out.response;
}

interface UsageRow {
  id: string;
  amount: number;
  cachedInputTokens: number;
  cacheWriteTokens: number;
  apiProvider: string | undefined;
  upstreamCostUsd: number | undefined;
  billingBasis: string | undefined;
  upstreamProvider: string | null | undefined;
}

/** The account's usage ledger rows, across every wallet of its credit pool. */
async function usageRows(user: JwtPrivatePayloadType): Promise<UsageRow[]> {
  const pool = await CreditRepository.getUserPool(user.id, logger, creditsT, defaultLocale);
  const walletIds = pool.success
    ? [pool.data.userWallet, ...pool.data.leadWallets].flatMap((w) => (w ? [w.id] : []))
    : [];
  expect(walletIds.length).toBeGreaterThan(0);
  const rows = await db
    .select({
      id: creditTransactions.id,
      amount: creditTransactions.amount,
      metadata: creditTransactions.metadata,
    })
    .from(creditTransactions)
    .where(
      and(
        inArray(creditTransactions.walletId, walletIds),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    );
  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    cachedInputTokens: ("cachedInputTokens" in row.metadata ? row.metadata.cachedInputTokens : 0) ?? 0,
    cacheWriteTokens: ("cacheWriteTokens" in row.metadata ? row.metadata.cacheWriteTokens : 0) ?? 0,
    apiProvider:
      "apiProvider" in row.metadata ? row.metadata.apiProvider : undefined,
    upstreamCostUsd:
      "upstreamCostUsd" in row.metadata ? row.metadata.upstreamCostUsd : undefined,
    billingBasis:
      "billingBasis" in row.metadata ? row.metadata.billingBasis : undefined,
    upstreamProvider:
      "upstreamProvider" in row.metadata ? row.metadata.upstreamProvider : undefined,
  }));
}

async function balanceOf(user: JwtPrivatePayloadType): Promise<number> {
  const res = await CreditRepository.getCreditBalanceForUser(
    user,
    defaultLocale,
    logger,
    creditsT,
  );
  return res.success ? res.data.total : -1;
}

/** Charged = sum of the usage rows, rounded off float noise. */
function charged(rows: UsageRow[]): number {
  return Math.round(-rows.reduce((sum, row) => sum + row.amount, 0) * 100) / 100;
}

/** Usage rows a call wrote: everything not in the `before` snapshot. */
async function newUsageRows(
  user: JwtPrivatePayloadType,
  before: UsageRow[],
): Promise<UsageRow[]> {
  const known = new Set(before.map((row) => row.id));
  return (await usageRows(user)).filter((row) => !known.has(row.id));
}

describe("/v1 bills OpenRouter models at real upstream cost", () => {
  let payer: E2ECreditUser;
  let key = "";
  let model: ChatModelOption | undefined;
  let restoreProviders: (() => void) | undefined;

  beforeAll(async () => {
    restoreProviders = mockV1Providers();
    payer = await createE2ECreditUser("v1-upstream-cost", 500);
    const models = listUserCallableModels(payer.user, await getEnvAvailability());
    model = models.find(
      (m) =>
        billsUpstreamCost(m) &&
        !isUncensoredContent(m.content) &&
        (m.inputTokenCost ?? 0) > 0,
    );
    const res = await sendTestRequest({
      endpoint: apiKeysEndpoints.POST,
      data: { name: "upstream-cost" },
      user: payer.user,
      toolExecutionContext: undefined,
    });
    key = res.success ? res.data.key : "";
  });

  afterAll(async () => {
    restoreProviders?.();
    await payer?.remove();
  });

  it("an OpenRouter per-token model is servable in this environment", () => {
    expect(model?.id).toBeDefined();
    expect(key).not.toBe("");
  });

  it("GET /v1/models quotes the same customer credits as billing for each model family", async () => {
    const request = new Request("http://localhost/api/en-US/v1/models", {
      headers: { Authorization: `Bearer ${key}`, "anthropic-version": "2023-06-01" },
    });
    const { response } = await V1ModelsRepository.list(await authed(request), request, defaultLocale, t, logger);
    expect(response.status).toBe(200);
    const price = z.number().nullable();
    const baseRates = z.object({
      input_credits_per_million_tokens: price,
      output_credits_per_million_tokens: price,
      cache_read_credits_per_million_tokens: price,
      cache_write_credits_per_million_tokens: price,
      cache_write_1h_credits_per_million_tokens: price,
    });
    const pricing = baseRates.extend({
      tiers: z.array(baseRates.extend({min_prompt_tokens: z.number().optional(), utc_start: z.number().optional(), utc_end: z.number().optional()})).optional(),
    });
    const catalog = z
      .object({ data: z.array(z.object({ id: z.string(), pricing })) })
      .parse(await response.json());
    const served = listUserCallableModels(
      payer.user,
      await getEnvAvailability(),
    );
    expect(catalog.data.map((row) => row.id).toSorted()).toEqual(
      served.map((row) => row.id).toSorted(),
    );

    function verify(option: ChatModelOption, listing: z.infer<typeof pricing>): void {
      const requestStartedAt = Date.UTC(2026, 10, 24, 12);
      const rates = listing.tiers?.find(tier =>
        tier.utc_start !== undefined && tier.utc_end !== undefined &&
        (tier.utc_start < tier.utc_end ? tier.utc_start <= 1200 && 1200 < tier.utc_end : 1200 >= tier.utc_start || 1200 < tier.utc_end)
      ) ?? listing;
      const input = rates.input_credits_per_million_tokens;
      const output = rates.output_credits_per_million_tokens;
      if (typeof option.creditCost === "number") {
        expect([input, output]).toEqual([null, null]);
        return;
      }
      expect(input).toBeTypeOf("number");
      expect(output).toBeTypeOf("number");
      if (input === null || output === null) {
        return;
      }
      const read = rates.cache_read_credits_per_million_tokens ?? input;
      const write = rates.cache_write_credits_per_million_tokens ?? input;
      const hour = rates.cache_write_1h_credits_per_million_tokens;
      const hourTokens = hour === null ? 0 : 431;
      const tokens = { requestStartedAt, inputTokens: 12345, outputTokens: 2345, cachedInputTokens: 3123, cacheWriteTokens: 1823, hourWriteTokens: hourTokens };
      const unrounded = ((tokens.inputTokens - tokens.cachedInputTokens - tokens.cacheWriteTokens) * input +
        tokens.cachedInputTokens * read + (tokens.cacheWriteTokens - hourTokens) * write +
        hourTokens * (hour ?? write) + tokens.outputTokens * output) / 1_000_000;
      const expected = Math.ceil(unrounded * 100 - 1e-9) / 100;
      const bill = TokenAccumulator.chargeSingleCall(option, tokens, undefined, logger);
      expect(bill.credits, `${option.id}/${option.apiProvider}`).toBe(expected);
    }

    const options = new Map(served.map(option => [String(option.id), option]));
    for (const row of catalog.data) {
      const option = options.get(row.id);
      expect(option).toBeDefined();
      if (option) {
        verify(option, row.pricing);
      }
    }
    // Real key, synthetic completions, real ledger: exercise an inexpensive
    // representative from each callable author family with a mixed prompt.
    for (const family of ["openAI", "anthropic", "deepSeek", "google"]) {
      const option = served.filter(candidate => candidate.provider === family &&
        !isUncensoredContent(candidate.content) && typeof candidate.inputTokenCost === "number")
        .toSorted((a,b) => (a.inputTokenCost ?? 0) - (b.inputTokenCost ?? 0))[0];
      expect(option, family).toBeDefined();
      const rates = catalog.data.find(row => row.id === option?.id)?.pricing;
      if (!option || !rates || rates.input_credits_per_million_tokens === null || rates.output_credits_per_million_tokens === null) {
        continue;
      }
      const mixed = {inputTokens: 1200, outputTokens: 340, cachedInputTokens: 500, cacheWriteTokens: 300, reasoningTokens: 0};
      const input = rates.input_credits_per_million_tokens;
      const expected = Math.ceil(((400 * input + 500 * (rates.cache_read_credits_per_million_tokens ?? input) +
        300 * (rates.cache_write_credits_per_million_tokens ?? input) + 340 * rates.output_credits_per_million_tokens) / 1e6) * 100 - 1e-9) / 100;
      const before = await usageRows(payer.user);
      const completion = await call("chat", key, option.id, false, runnerWith(undefined, mixed));
      expect(completion.status, family).toBe(200);
      const result = z.object({usage:z.object({credits_charged:z.number()})}).parse(await completion.json());
      expect(result.usage.credits_charged, family).toBe(expected);
      expect(charged(await newUsageRows(payer.user,before)), family).toBe(expected);
    }
    // Exercise provider variants even when Atlas has no key for their route.
    for (const option of chatModelOptionsPool) {
      verify(option, chatTokenPricing(option));
    }
  });

  const cases: Array<{ format: Format; stream: boolean }> = [
    { format: "chat", stream: false },
    { format: "chat", stream: true },
    { format: "responses", stream: false },
    { format: "responses", stream: true },
    { format: "messages", stream: false },
    { format: "messages", stream: true },
  ];

  for (const { format, stream } of cases) {
    const label = `${format}${stream ? " (stream)" : ""}`;

    it(`${label}: real cost x markup, stored on the usage row, charged once`, async () => {
      if (!model) {
        return;
      }
      const expected = upstreamCostToCredits(UPSTREAM_USD);
      const tokenPrice = calculateCreditCost(
        model,
        USAGE.inputTokens,
        USAGE.outputTokens,
        USAGE.cachedInputTokens,
        USAGE.cacheWriteTokens,
      );
      expect(expected).not.toBe(tokenPrice);

      const before = await balanceOf(payer.user);
      const snapshot = await usageRows(payer.user);
      const res = await call(format, key, model.id, stream, runnerWith(openRouterMeta(UPSTREAM_USD)));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain(`${expected}`);
      if (format === "chat") {
        expect(text).toContain('"cached_tokens":5000');
        expect(text).toContain('"cache_write_tokens":2000');
      }

      const rows = await newUsageRows(payer.user, snapshot);
      expect(charged(rows)).toBe(expected);
      expect(rows.reduce((total, row) => total + row.cachedInputTokens, 0)).toBe(5000);
      expect(rows.reduce((total, row) => total + row.cacheWriteTokens, 0)).toBe(2000);
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.reduce((sum, row) => sum + (row.upstreamCostUsd ?? 0), 0)).toBeCloseTo(UPSTREAM_USD, 12);
      for (const row of rows) {
        expect(row.apiProvider).toBe(model.apiProvider);
        expect(row.billingBasis).toBe("upstream_cost");
        expect(row.upstreamProvider).toBe("Parasail");
      }
      // No second charge at the token price on top of the real cost.
      expect(Math.round((before - (await balanceOf(payer.user))) * 100) / 100).toBe(expected);
    });

    it(`${label}: no reported cost falls back to the token price with a warning`, async () => {
      if (!model) {
        return;
      }
      const tokenPrice = calculateCreditCost(
        model,
        USAGE.inputTokens,
        USAGE.outputTokens,
        USAGE.cachedInputTokens,
        USAGE.cacheWriteTokens,
      );
      const warn = vi.spyOn(logger, "warn");
      const snapshot = await usageRows(payer.user);
      const res = await call(format, key, model.id, stream, runnerWith(undefined));
      expect(res.status).toBe(200);
      await res.text();
      const warnedMissingCost = warn.mock.calls.some(([message]) =>
        String(message).includes("Upstream cost missing"),
      );
      warn.mockRestore();
      expect(warnedMissingCost).toBe(true);

      const rows = await newUsageRows(payer.user, snapshot);
      expect(charged(rows)).toBe(tokenPrice);
      for (const row of rows) {
        expect(row.apiProvider).toBe(model.apiProvider);
        expect(row.upstreamCostUsd).toBeUndefined();
      }
    });
  }
});
