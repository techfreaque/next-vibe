/**
 * OpenAI-compatible API: key lifecycle, key auth, models, billing, 402,
 * streaming, ownership isolation. Inference goes through an injected fake
 * runner (no provider call, no real spend); everything else - keys, auth,
 * model resolution, credit pre-flight and deduction - is the real code on the
 * real DB.
 */

import { eq } from "drizzle-orm";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ApiKeyAuth } from "@/api-keys/auth";
import { userApiKeys } from "@/api-keys/db";
import apiKeysEndpoints from "@/api-keys/definition";
import revokeEndpoints from "@/api-keys/[id]/definition";
import { findActiveKey, hashApiKey, resetRateLimit } from "@/api-keys/keys";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  createE2ECreditUser,
  drainCredits,
  type E2ECreditUser,
} from "next-vibe/agent/ai-stream/testing/e2e-credit-user";

import { V1ChatCompletionsRepository } from "./chat/completions/repository";
import { scopedTranslation } from "./i18n";
import { V1ModelsRepository } from "./models/repository";
import type { InferenceRunner } from "./shared/inference";
import { listUserChatModels } from "./shared/models";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: creditsT } = creditsScopedTranslation.scopedT(defaultLocale);

const fakeRunner: InferenceRunner = {
  generate: () =>
    Promise.resolve({
      text: "Hello from the fake model",
      finishReason: "stop",
      usage: { inputTokens: 20_000, outputTokens: 2_000, cachedInputTokens: 0 },
    }),
  async *stream() {
    yield { type: "text", text: "Hello " };
    yield { type: "text", text: "stream" };
    yield {
      type: "finish",
      finishReason: "stop",
      usage: { inputTokens: 20_000, outputTokens: 2_000, cachedInputTokens: 0 },
    };
  },
};

function v1Request(path: string, bearer: string | undefined, body?: object): Request {
  return new Request(`http://localhost/api/en-US/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

async function createKey(user: JwtPrivatePayloadType, name: string): Promise<{ id: string; key: string }> {
  const res = await sendTestRequest({
    endpoint: apiKeysEndpoints.POST,
    data: { name },
    user,
    toolExecutionContext: undefined,
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
  if (!res.success) {
    return { id: "", key: "" };
  }
  return { id: res.data.id, key: res.data.key };
}

/** Resolve the key's user the way the auth layer does on a /v1 request. */
async function authed(request: Request): Promise<JwtPrivatePayloadType | undefined> {
  const auth = await ApiKeyAuth.authenticateRequest(request, defaultLocale, logger);
  if (!auth?.success || auth.data.isPublic) {
    return undefined;
  }
  return auth.data;
}

async function balanceOf(user: JwtPrivatePayloadType): Promise<number> {
  const res = await CreditRepository.getCreditBalanceForUser(user, defaultLocale, logger, creditsT);
  return res.success ? res.data.total : -1;
}

async function completionsCall(
  bearer: string,
  body: { model: string; stream?: boolean; messages?: Array<{ role: "user"; content: string }> },
): Promise<Response> {
  const request = v1Request("/chat/completions", bearer, body);
  const user = (await authed(request)) ?? ApiKeyAuthAnonymous();
  const out = await V1ChatCompletionsRepository.complete({
    data: {
      model: body.model,
      messages: body.messages ?? [{ role: "user", content: "hi" }],
      stream: body.stream,
    },
    user,
    locale: defaultLocale,
    logger,
    request,
    t,
    toolExecutionContext: rootlessToolExecutionContext(),
    runner: fakeRunner,
  });
  return out.response;
}

function ApiKeyAuthAnonymous(): { isPublic: true; leadId: string; roles: ["PUBLIC"] } {
  return { isPublic: true, leadId: "", roles: ["PUBLIC"] };
}

describe("OpenAI-compatible API", () => {
  let alice: E2ECreditUser;
  let bob: E2ECreditUser;
  let modelId = "";

  beforeAll(async () => {
    alice = await createE2ECreditUser("v1-api-alice", 500);
    bob = await createE2ECreditUser("v1-api-bob", 500);
    const models = listUserChatModels(alice.user, await getEnvAvailability());
    modelId = models[0]?.id ?? "";
  });

  afterAll(async () => {
    await alice.remove();
    await bob.remove();
  });

  it("a model is servable in this environment", () => {
    expect(modelId).not.toBe("");
  });

  describe("key lifecycle", () => {
    it("creates a key, shows plaintext once, stores only the hash", async () => {
      const { id, key } = await createKey(alice.user, "lifecycle");
      expect(key.startsWith("sk-unb-")).toBe(true);
      const [row] = await db.select().from(userApiKeys).where(eq(userApiKeys.id, id));
      expect(row?.hashedKey).toBe(hashApiKey(key));
      expect(JSON.stringify(row)).not.toContain(key);
      expect(row?.keyPrefix).toBe(key.slice(0, row?.keyPrefix.length ?? 0));

      const list = await sendTestRequest({
        endpoint: apiKeysEndpoints.GET,
        user: alice.user,
        toolExecutionContext: undefined,
      });
      expect(list.success).toBe(true);
      if (!list.success) {
        return;
      }
      const listed = list.data.keys.find((k) => k.id === id);
      expect(listed?.keyPrefix).toBe(row?.keyPrefix);
      expect(JSON.stringify(list.data)).not.toContain(key);
      expect(JSON.stringify(list.data)).not.toContain(row?.hashedKey ?? "x");
      expect(list.data.baseUrl.endsWith("/v1")).toBe(true);
    });

    it("revoke disables the key", async () => {
      const { id, key } = await createKey(alice.user, "to-revoke");
      expect(await findActiveKey(key)).toBeDefined();
      const res = await sendTestRequest({
        endpoint: revokeEndpoints.DELETE,
        urlPathParams: { id },
        user: alice.user,
        toolExecutionContext: undefined,
      });
      expect(res.success).toBe(true);
      expect(await findActiveKey(key)).toBeUndefined();
      expect(await authed(v1Request("/models", key))).toBeUndefined();
    });

    it("ownership: another user cannot revoke or see the key", async () => {
      const { id } = await createKey(alice.user, "alice-private");
      const revoke = await sendTestRequest({
        endpoint: revokeEndpoints.DELETE,
        urlPathParams: { id },
        user: bob.user,
        toolExecutionContext: undefined,
      });
      expect(revoke.success).toBe(false);
      const list = await sendTestRequest({
        endpoint: apiKeysEndpoints.GET,
        user: bob.user,
        toolExecutionContext: undefined,
      });
      expect(list.success && list.data.keys.some((k) => k.id === id)).toBe(false);
    });
  });

  describe("key auth", () => {
    it("accepts a valid key and resolves the owner", async () => {
      const { key } = await createKey(alice.user, "auth-ok");
      const user = await authed(v1Request("/models", key));
      expect(user?.id).toBe(alice.user.id);
    });

    it("rejects invalid / missing keys and ignores non-/v1 paths", async () => {
      expect(await authed(v1Request("/models", "sk-unb-not-a-real-key"))).toBeUndefined();
      expect(await authed(v1Request("/models", undefined))).toBeUndefined();
      const { key } = await createKey(alice.user, "scope");
      const other = new Request("http://localhost/api/en-US/user/private/me", {
        headers: { Authorization: `Bearer ${key}` },
      });
      // A key is NOT a session: it never authenticates outside /v1.
      expect(
        await ApiKeyAuth.authenticateRequest(other, defaultLocale, logger),
      ).toBeUndefined();
    });
  });

  describe("GET /v1/models", () => {
    it("lists the user's models in OpenAI shape", async () => {
      const { key } = await createKey(alice.user, "models");
      const request = v1Request("/models", key);
      const user = await authed(request);
      const out = await V1ModelsRepository.list(user ?? ApiKeyAuthAnonymous(), request, t);
      expect(out.response.status).toBe(200);
      const body = (await out.response.json()) as {
        object: string;
        data: Array<{ id: string; object: string }>;
      };
      expect(body.object).toBe("list");
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data.every((m) => m.object === "model")).toBe(true);
      expect(body.data.some((m) => m.id === modelId)).toBe(true);
    });

    it("401 with OpenAI error body for a bad key", async () => {
      const request = v1Request("/models", "sk-unb-bad");
      const out = await V1ModelsRepository.list(ApiKeyAuthAnonymous(), request, t);
      expect(out.response.status).toBe(401);
      const body = (await out.response.json()) as { error: { code: string; type: string } };
      expect(body.error.code).toBe("invalid_api_key");
      expect(body.error.type).toBe("authentication_error");
    });
  });

  describe("POST /v1/chat/completions", () => {
    it("runs, bills and returns the OpenAI shape", async () => {
      const { key } = await createKey(alice.user, "chat");
      const before = await balanceOf(alice.user);
      const res = await completionsCall(key, { model: modelId });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        object: string;
        model: string;
        choices: Array<{ message: { role: string; content: string }; finish_reason: string }>;
        usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number; credits_charged: number };
      };
      expect(body.object).toBe("chat.completion");
      expect(body.model).toBe(modelId);
      expect(body.choices[0]?.message).toEqual({ role: "assistant", content: "Hello from the fake model" });
      expect(body.choices[0]?.finish_reason).toBe("stop");
      expect(body.usage.total_tokens).toBe(22_000);
      expect(body.usage.credits_charged).toBeGreaterThan(0);
      const after = await balanceOf(alice.user);
      expect(before - after).toBeGreaterThan(0);
      expect(before - after).toBeCloseTo(body.usage.credits_charged, 1);
    });

    it("streams OpenAI SSE chunks, ends with [DONE] and bills", async () => {
      const { key } = await createKey(alice.user, "stream");
      const before = await balanceOf(alice.user);
      const res = await completionsCall(key, { model: modelId, stream: true });
      expect(res.headers.get("content-type")).toContain("text/event-stream");
      const text = await res.text();
      const events = text.split("\n\n").filter((e) => e.startsWith("data: "));
      expect(events.at(-1)).toBe("data: [DONE]");
      const chunks = events
        .slice(0, -1)
        .map((e) => JSON.parse(e.slice(6)) as { object: string; choices: Array<{ delta: { content?: string }; finish_reason: string | null }> });
      expect(chunks.every((c) => c.object === "chat.completion.chunk")).toBe(true);
      expect(chunks.map((c) => c.choices[0]?.delta.content ?? "").join("")).toBe("Hello stream");
      expect(chunks.at(-1)?.choices[0]?.finish_reason).toBe("stop");
      expect(before - (await balanceOf(alice.user))).toBeGreaterThan(0);
    });

    it("404 model_not_found for an unknown model (no charge)", async () => {
      const { key } = await createKey(alice.user, "nomodel");
      const before = await balanceOf(alice.user);
      const res = await completionsCall(key, { model: "definitely-not-a-model" });
      expect(res.status).toBe(404);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe("model_not_found");
      expect(await balanceOf(alice.user)).toBe(before);
    });

    it("401 without a valid key", async () => {
      const res = await completionsCall("sk-unb-nope", { model: modelId });
      expect(res.status).toBe(401);
    });

    it("429 once the per-key rate limit is hit", async () => {
      const { id, key } = await createKey(alice.user, "ratelimit");
      await db.update(userApiKeys).set({ rateLimitPerMinute: 1 }).where(eq(userApiKeys.id, id));
      resetRateLimit(id);
      expect((await completionsCall(key, { model: modelId })).status).toBe(200);
      const limited = await completionsCall(key, { model: modelId });
      expect(limited.status).toBe(429);
      expect(limited.headers.get("retry-after")).not.toBeNull();
    });

    it("402 insufficient_credits when the account is empty", async () => {
      const { key } = await createKey(bob.user, "broke");
      await drainCredits(bob.user);
      const res = await completionsCall(key, { model: modelId });
      expect(res.status).toBe(402);
      const body = (await res.json()) as { error: { code: string; type: string } };
      expect(body.error.code).toBe("insufficient_credits");
      expect(body.error.type).toBe("insufficient_quota");
    });
  });
});
