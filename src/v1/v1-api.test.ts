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
import type {
  JWTPublicPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
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
import type { InferenceRequest, InferenceRunner } from "./shared/inference";
import type { V1ChatCompletionsPostRequestOutput } from "./chat/completions/definition";
import { generateApiKey } from "@/api-keys/keys";
import { resetPaidCache } from "@/api-keys/paid";
import { listUserChatModels } from "./shared/models";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: creditsT } = creditsScopedTranslation.scopedT(defaultLocale);

const fakeRunner: InferenceRunner = {
  generate: () =>
    Promise.resolve({
      text: "Hello from the fake model",
      toolCalls: [],
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
  body: Partial<V1ChatCompletionsPostRequestOutput> & { model: string },
  runner: InferenceRunner = fakeRunner,
): Promise<Response> {
  const request = v1Request("/chat/completions", bearer, body);
  const user = (await authed(request)) ?? ApiKeyAuthAnonymous();
  const out = await V1ChatCompletionsRepository.complete({
    data: {
      ...body,
      messages: body.messages ?? [{ role: "user", content: "hi" }],
    },
    user,
    locale: defaultLocale,
    logger,
    request,
    t,
    toolExecutionContext: rootlessToolExecutionContext(),
    runner,
  });
  return out.response;
}

function ApiKeyAuthAnonymous(): JWTPublicPayloadType {
  return { isPublic: true, leadId: "", roles: [UserPermissionRole.PUBLIC] };
}

describe("OpenAI-compatible API", () => {
  let alice: E2ECreditUser;
  let bob: E2ECreditUser;
  let modelId = "";
  let toolModelId = "";
  let free: E2ECreditUser;

  beforeAll(async () => {
    alice = await createE2ECreditUser("v1-api-alice", 500);
    bob = await createE2ECreditUser("v1-api-bob", 500);
    const models = listUserChatModels(alice.user, await getEnvAvailability());
    modelId = models[0]?.id ?? "";
    toolModelId = models.find((m) => m.supportsTools)?.id ?? "";
    free = await createE2ECreditUser("v1-api-free", 0);
  });

  afterAll(async () => {
    await alice.remove();
    await bob.remove();
    await free.remove();
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
      // One entry per id, even when a model has several provider routes.
      const ids = body.data.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
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

  describe("paid-plan gate", () => {
    it("a free-tier account cannot create a key (402 PAYMENT_REQUIRED)", async () => {
      resetPaidCache(free.user.id);
      const res = await sendTestRequest({
        endpoint: apiKeysEndpoints.POST,
        data: { name: "free" },
        user: free.user,
        toolExecutionContext: undefined,
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.errorType.errorKey).toContain("payment_required");
      }
      const list = await sendTestRequest({
        endpoint: apiKeysEndpoints.GET,
        user: free.user,
        toolExecutionContext: undefined,
      });
      expect(list.success && list.data.isPaid).toBe(false);
    });

    it("a free-tier key (made before lapsing) gets 402 paid_plan_required on /v1", async () => {
      const generated = generateApiKey();
      await db.insert(userApiKeys).values({
        userId: free.user.id,
        name: "legacy",
        keyPrefix: generated.keyPrefix,
        hashedKey: generated.hashedKey,
      });
      resetPaidCache(free.user.id);
      const res = await completionsCall(generated.plaintext, { model: modelId });
      expect(res.status).toBe(402);
      const body = (await res.json()) as { error: { code: string; type: string; message: string } };
      expect(body.error.code).toBe("paid_plan_required");
      expect(body.error.type).toBe("insufficient_quota");
      const request = v1Request("/models", generated.plaintext);
      const models = await V1ModelsRepository.list((await authed(request)) ?? ApiKeyAuthAnonymous(), request, t);
      expect(models.response.status).toBe(402);
    });

    it("a user with purchased credits is paid", async () => {
      resetPaidCache(alice.user.id);
      const list = await sendTestRequest({
        endpoint: apiKeysEndpoints.GET,
        user: alice.user,
        toolExecutionContext: undefined,
      });
      expect(list.success && list.data.isPaid).toBe(true);
    });
  });

  describe("tools / function calling", () => {
    const weatherTool = {
      type: "function" as const,
      function: {
        name: "get_weather",
        description: "Weather for a city",
        parameters: {
          type: "object",
          properties: { city: { type: "string" } },
          required: ["city"],
        },
      },
    };
    let captured: InferenceRequest | undefined;
    // Read through a getter: TS narrows a closure-assigned `let` to never.
    const capturedRequest = (): InferenceRequest | undefined => captured;
    const toolRunner: InferenceRunner = {
      generate: (request) => {
        captured = request;
        return Promise.resolve({
          text: "",
          toolCalls: [{ id: "call_1", name: "get_weather", arguments: '{"city":"Berlin"}' }],
          finishReason: "tool_calls",
          usage: { inputTokens: 100, outputTokens: 20, cachedInputTokens: 0 },
        });
      },
      async *stream(request) {
        captured = request;
        yield { type: "tool-call-start", id: "call_1", name: "get_weather" };
        yield { type: "tool-call-delta", id: "call_1", argumentsDelta: '{"city":' };
        yield { type: "tool-call-delta", id: "call_1", argumentsDelta: '"Berlin"}' };
        yield {
          type: "finish",
          finishReason: "tool_calls",
          usage: { inputTokens: 100, outputTokens: 20, cachedInputTokens: 0 },
        };
      },
    };

    it("non-stream: passes tools through and returns OpenAI tool_calls", async () => {
      const { key } = await createKey(alice.user, "tools");
      captured = undefined;
      const res = await completionsCall(
        key,
        { model: toolModelId, tools: [weatherTool], tool_choice: "required" },
        toolRunner,
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        choices: Array<{
          message: { content: string | null; tool_calls: Array<{ id: string; type: string; function: { name: string; arguments: string } }> };
          finish_reason: string;
        }>;
      };
      expect(body.choices[0]?.finish_reason).toBe("tool_calls");
      expect(body.choices[0]?.message.content).toBeNull();
      expect(body.choices[0]?.message.tool_calls).toEqual([
        { id: "call_1", type: "function", function: { name: "get_weather", arguments: '{"city":"Berlin"}' } },
      ]);
      expect(capturedRequest()?.tools?.[0]?.name).toBe("get_weather");
      expect(capturedRequest()?.toolChoice).toBe("required");
    });

    it("stream: emits tool_calls deltas by index and finishes with tool_calls", async () => {
      const { key } = await createKey(alice.user, "tools-stream");
      const res = await completionsCall(
        key,
        { model: toolModelId, tools: [weatherTool], stream: true },
        toolRunner,
      );
      const text = await res.text();
      const chunks = text
        .split("\n\n")
        .filter((e) => e.startsWith("data: ") && !e.includes("[DONE]"))
        .map(
          (e) =>
            JSON.parse(e.slice(6)) as {
              choices: Array<{
                delta: { tool_calls?: Array<{ index: number; id?: string; function: { name?: string; arguments: string } }> };
                finish_reason: string | null;
              }>;
            },
        );
      const calls = chunks.flatMap((c) => c.choices[0]?.delta.tool_calls ?? []);
      expect(calls[0]).toMatchObject({ index: 0, id: "call_1", function: { name: "get_weather" } });
      expect(calls.map((c) => c.function.arguments).join("")).toBe('{"city":"Berlin"}');
      expect(calls.every((c) => c.index === 0)).toBe(true);
      expect(chunks.at(-1)?.choices[0]?.finish_reason).toBe("tool_calls");
    });

    it("maps assistant tool_calls + tool results back into the model messages", async () => {
      const { key } = await createKey(alice.user, "tools-roundtrip");
      captured = undefined;
      const res = await completionsCall(
        key,
        {
          model: toolModelId,
          tools: [weatherTool],
          messages: [
            { role: "user", content: "Weather in Berlin?" },
            {
              role: "assistant",
              content: null,
              tool_calls: [{ id: "call_1", type: "function", function: { name: "get_weather", arguments: '{"city":"Berlin"}' } }],
            },
            { role: "tool", tool_call_id: "call_1", content: "18C, cloudy" },
          ],
        },
        fakeRunner,
      );
      expect(res.status).toBe(200);
      // fakeRunner does not capture; run again through toolRunner to inspect messages
      await completionsCall(
        key,
        {
          model: toolModelId,
          tools: [weatherTool],
          messages: [
            { role: "user", content: "Weather in Berlin?" },
            {
              role: "assistant",
              content: null,
              tool_calls: [{ id: "call_1", type: "function", function: { name: "get_weather", arguments: '{"city":"Berlin"}' } }],
            },
            { role: "tool", tool_call_id: "call_1", content: "18C, cloudy" },
          ],
        },
        toolRunner,
      );
      const messages = capturedRequest()?.messages ?? [];
      expect(messages[1]).toMatchObject({
        role: "assistant",
        content: [{ type: "tool-call", toolCallId: "call_1", toolName: "get_weather", input: { city: "Berlin" } }],
      });
      expect(messages[2]).toMatchObject({
        role: "tool",
        content: [{ type: "tool-result", toolCallId: "call_1", toolName: "get_weather", output: { type: "text", value: "18C, cloudy" } }],
      });
    });

    it("400 for a tool_choice that names an undeclared function", async () => {
      const { key } = await createKey(alice.user, "tools-badchoice");
      const res = await completionsCall(
        key,
        { model: toolModelId, tools: [weatherTool], tool_choice: { type: "function", function: { name: "nope" } } },
        toolRunner,
      );
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { param: string } };
      expect(body.error.param).toBe("tool_choice");
    });

    it("400 for a tool message without tool_call_id", async () => {
      const { key } = await createKey(alice.user, "tools-noid");
      const res = await completionsCall(key, {
        model: toolModelId,
        messages: [{ role: "tool", content: "x" }],
      });
      expect(res.status).toBe(400);
    });
  });
});
