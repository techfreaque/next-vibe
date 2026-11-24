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
import { billsUpstreamCost } from "next-vibe/agent/ai-stream/repository/loop/token-accumulator";
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
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
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

import { ApiKeyAuth } from "@/api-keys/auth";
import apiKeysEndpoints from "@/api-keys/definition";
import { creditTransactions } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { V1ChatCompletionsRepository } from "./chat/completions/repository";
import { scopedTranslation } from "./i18n";
import { V1MessagesRepository } from "./messages/repository";
import { V1ResponsesRepository } from "./responses/repository";
import type { InferenceRunner, InferenceUsage } from "./shared/inference";
import { listUserCallableModels } from "./shared/models";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: creditsT } = creditsScopedTranslation.scopedT(defaultLocale);

const USAGE: InferenceUsage = {
  inputTokens: 20_000,
  outputTokens: 2_000,
  cachedInputTokens: 5_000,
  reasoningTokens: 0,
};
/** Real upstream cost of one call: an endpoint far pricier than the list price. */
const UPSTREAM_USD = 0.0731;

function openRouterMeta(cost: number): ProviderMetadata {
  return { openrouter: { provider: "Parasail", usage: { cost } } };
}

/** A text runner whose calls report `meta` (undefined = no real cost). */
function runnerWith(meta: ProviderMetadata | undefined): InferenceRunner {
  return {
    generate: () =>
      Promise.resolve({
        text: "Hello there",
        toolCalls: [],
        parts: [{ type: "text", text: "Hello there" }],
        finishReason: "stop",
        usage: USAGE,
        providerMetadata: meta,
      }),
    async *stream() {
      yield { type: "text", text: "Hello " };
      yield { type: "text", text: "there" };
      yield {
        type: "finish",
        finishReason: "stop",
        usage: USAGE,
        providerMetadata: meta,
      };
    },
  };
}

function anonymous(): JWTPublicPayloadType {
  return { isPublic: true, leadId: "", roles: [UserPermissionRole.PUBLIC] };
}

function v1Request(path: string, key: string, body: object): Request {
  return new Request(`http://localhost/api/en-US/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
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
    const request = v1Request("/chat/completions", key, data);
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
    const request = v1Request("/responses", key, data);
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
  const request = v1Request("/messages", key, data);
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

  beforeAll(async () => {
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
    await payer.remove();
  });

  it("an OpenRouter per-token model is servable in this environment", () => {
    expect(model?.id).toBeDefined();
    expect(key).not.toBe("");
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
      );
      expect(expected).not.toBe(tokenPrice);

      const before = await balanceOf(payer.user);
      const snapshot = await usageRows(payer.user);
      const res = await call(format, key, model.id, stream, runnerWith(openRouterMeta(UPSTREAM_USD)));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain(`${expected}`);

      const rows = await newUsageRows(payer.user, snapshot);
      expect(charged(rows)).toBe(expected);
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.apiProvider).toBe(model.apiProvider);
        expect(row.upstreamCostUsd).toBe(UPSTREAM_USD);
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
