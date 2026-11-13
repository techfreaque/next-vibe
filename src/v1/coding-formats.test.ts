/**
 * Responses API (Codex CLI) + Anthropic Messages API (Claude Code) on the
 * shared /v1 path: key auth (Bearer and x-api-key), wire-format error shapes,
 * billing at real usage, streaming sequences, tool-call round trips, model id
 * mapping and token counting. Inference goes through an injected fake runner
 * (no provider call, no spend); keys, auth, model resolution, credit
 * pre-flight and deduction are the real code on the real DB.
 */

import { eq } from "drizzle-orm";
import {
  createE2ECreditUser,
  drainCredits,
  type E2ECreditUser,
} from "next-vibe/agent/ai-stream/testing/e2e-credit-user";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
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
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ApiKeyAuth } from "@/api-keys/auth";
import { userApiKeys } from "@/api-keys/db";
import apiKeysEndpoints from "@/api-keys/definition";
import { resetRateLimit } from "@/api-keys/keys";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { scopedTranslation } from "./i18n";
import { V1CountTokensRepository } from "./messages/[action]/repository";
import type { V1MessagesPostRequestOutput } from "./messages/definition";
import { V1MessagesRepository } from "./messages/repository";
import { V1ModelsRepository } from "./models/repository";
import type { V1ResponsesPostRequestOutput } from "./responses/definition";
import { V1ResponsesRepository } from "./responses/repository";
import type { InferenceRequest, InferenceRunner } from "./shared/inference";
import { listUserCallableModels } from "./shared/models";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: creditsT } = creditsScopedTranslation.scopedT(defaultLocale);

const USAGE = {
  inputTokens: 20_000,
  outputTokens: 2_000,
  cachedInputTokens: 5_000,
  reasoningTokens: 100,
};

let captured: InferenceRequest | undefined;
const capturedRequest = (): InferenceRequest | undefined => captured;

/** Reasoning, text, then two parallel tool calls - the shape coding agents see. */
const agentRunner: InferenceRunner = {
  generate: (request) => {
    captured = request;
    return Promise.resolve({
      text: "Reading both.",
      toolCalls: [
        { id: "call_1", name: "read_file", arguments: '{"path":"a.txt"}' },
        { id: "call_2", name: "read_file", arguments: '{"path":"b.txt"}' },
      ],
      parts: [
        { type: "reasoning", text: "Need both files.", replay: undefined },
        { type: "text", text: "Reading both." },
        { type: "tool-call", id: "call_1", name: "read_file", arguments: '{"path":"a.txt"}' },
        { type: "tool-call", id: "call_2", name: "read_file", arguments: '{"path":"b.txt"}' },
      ],
      finishReason: "tool_calls",
      usage: USAGE,
    });
  },
  async *stream(request) {
    captured = request;
    yield { type: "reasoning", text: "Need both files." };
    yield { type: "reasoning-end", replay: { openrouter: { sig: "x" } } };
    yield { type: "text", text: "Reading " };
    yield { type: "text", text: "both." };
    yield { type: "tool-call-start", id: "call_1", name: "read_file" };
    yield { type: "tool-call-delta", id: "call_1", argumentsDelta: '{"path":' };
    yield { type: "tool-call-delta", id: "call_1", argumentsDelta: '"a.txt"}' };
    yield { type: "tool-call-end", id: "call_1" };
    yield { type: "tool-call-start", id: "call_2", name: "read_file" };
    yield { type: "tool-call-delta", id: "call_2", argumentsDelta: '{"path":"b.txt"}' };
    yield { type: "tool-call-end", id: "call_2" };
    yield { type: "finish", finishReason: "tool_calls", usage: USAGE };
  },
};

const textRunner: InferenceRunner = {
  generate: (request) => {
    captured = request;
    return Promise.resolve({
      text: "Hello there",
      toolCalls: [],
      parts: [{ type: "text", text: "Hello there" }],
      finishReason: "stop",
      usage: USAGE,
    });
  },
  async *stream(request) {
    captured = request;
    yield { type: "text", text: "Hello " };
    yield { type: "text", text: "there" };
    yield { type: "finish", finishReason: "stop", usage: USAGE };
  },
};

const readFileFunction = {
  type: "function" as const,
  name: "read_file",
  description: "Read a file",
  parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
};
const readFileAnthropic = {
  name: "read_file",
  description: "Read a file",
  input_schema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
};

function v1Request(path: string, headers: Record<string, string>, body?: object): Request {
  return new Request(`http://localhost/api/en-US/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", ...headers },
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
  return res.success ? { id: res.data.id, key: res.data.key } : { id: "", key: "" };
}

function anonymous(): JWTPublicPayloadType {
  return { isPublic: true, leadId: "", roles: [UserPermissionRole.PUBLIC] };
}

async function authed(request: Request): Promise<JwtPrivatePayloadType | JWTPublicPayloadType> {
  const auth = await ApiKeyAuth.authenticateRequest(request, defaultLocale, logger);
  return auth?.success ? auth.data : anonymous();
}

async function balanceOf(user: JwtPrivatePayloadType): Promise<number> {
  const res = await CreditRepository.getCreditBalanceForUser(user, defaultLocale, logger, creditsT);
  return res.success ? res.data.total : -1;
}

async function responsesCall(
  headers: Record<string, string>,
  body: Partial<V1ResponsesPostRequestOutput> & { model: string },
  runner: InferenceRunner,
): Promise<Response> {
  const data = { input: "hi", ...body };
  const request = v1Request("/responses", headers, data);
  const out = await V1ResponsesRepository.create({
    data,
    user: await authed(request),
    locale: defaultLocale,
    logger,
    request,
    t,
    toolExecutionContext: rootlessToolExecutionContext(),
    runner,
  });
  return out.response;
}

async function messagesCall(
  headers: Record<string, string>,
  body: Partial<V1MessagesPostRequestOutput> & { model: string },
  runner: InferenceRunner,
): Promise<Response> {
  const data: V1MessagesPostRequestOutput = {
    max_tokens: 1024,
    messages: [{ role: "user", content: "hi" }],
    ...body,
  };
  const request = v1Request("/messages", { "anthropic-version": "2023-06-01", ...headers }, data);
  const out = await V1MessagesRepository.create({
    data,
    user: await authed(request),
    locale: defaultLocale,
    logger,
    request,
    t,
    toolExecutionContext: rootlessToolExecutionContext(),
    runner,
  });
  return out.response;
}

interface SseEvent {
  type: string;
  [key: string]: unknown;
}

function sseEvents(text: string): SseEvent[] {
  return text
    .split("\n\n")
    .filter((chunk) => chunk.includes("data: "))
    .map((chunk) => JSON.parse(chunk.slice(chunk.indexOf("data: ") + 6)) as SseEvent);
}

describe("coding-agent formats", () => {
  let user: E2ECreditUser;
  let broke: E2ECreditUser;
  let toolModelId = "";
  let claudeSonnetId: string | undefined;

  beforeAll(async () => {
    user = await createE2ECreditUser("v1-formats", 500);
    broke = await createE2ECreditUser("v1-formats-broke", 500);
    const models = listUserCallableModels(user.user, await getEnvAvailability());
    toolModelId = models.find((m) => m.supportsTools)?.id ?? "";
    claudeSonnetId = models.find((m) => /^claude-sonnet-\d/.test(m.id))?.id;
  });

  afterAll(async () => {
    await user.remove();
    await broke.remove();
  });

  it("a tool-capable model is servable in this environment", () => {
    expect(toolModelId).not.toBe("");
  });

  describe("POST /v1/responses", () => {
    it("runs, bills and returns a Response with reasoning, message and function calls", async () => {
      const { key } = await createKey(user.user, "responses");
      const before = await balanceOf(user.user);
      const res = await responsesCall(
        { Authorization: `Bearer ${key}` },
        { model: toolModelId, tools: [readFileFunction], store: false },
        agentRunner,
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        object: string;
        status: string;
        model: string;
        output: Array<{ type: string; call_id?: string; arguments?: string; content?: Array<{ text: string }> }>;
        usage: { input_tokens: number; output_tokens: number; total_tokens: number; input_tokens_details: { cached_tokens: number }; credits_charged: number };
      };
      expect(body.object).toBe("response");
      expect(body.status).toBe("completed");
      expect(body.model).toBe(toolModelId);
      expect(body.output.map((item) => item.type)).toEqual(["reasoning", "message", "function_call", "function_call"]);
      expect(body.output[1]?.content?.[0]?.text).toBe("Reading both.");
      expect(body.output[2]).toMatchObject({ call_id: "call_1", arguments: '{"path":"a.txt"}' });
      expect(body.output[3]).toMatchObject({ call_id: "call_2", arguments: '{"path":"b.txt"}' });
      expect(body.usage).toMatchObject({ input_tokens: 20_000, output_tokens: 2_000, total_tokens: 22_000 });
      expect(body.usage.input_tokens_details.cached_tokens).toBe(5_000);
      const spent = before - (await balanceOf(user.user));
      expect(spent).toBeGreaterThan(0);
      expect(spent).toBeCloseTo(body.usage.credits_charged, 1);
      expect(capturedRequest()?.tools?.[0]?.name).toBe("read_file");
    });

    it("streams the Responses event sequence and bills", async () => {
      const { key } = await createKey(user.user, "responses-stream");
      const before = await balanceOf(user.user);
      const res = await responsesCall(
        { Authorization: `Bearer ${key}` },
        { model: toolModelId, tools: [readFileFunction], stream: true, include: ["reasoning.encrypted_content"] },
        agentRunner,
      );
      expect(res.headers.get("content-type")).toContain("text/event-stream");
      const events = sseEvents(await res.text());
      expect(events[0]?.type).toBe("response.created");
      expect(events.at(-1)?.type).toBe("response.completed");
      const done = events
        .filter((e) => e.type === "response.output_item.done")
        .map((e) => e["item"] as { type: string; call_id?: string; arguments?: string; encrypted_content?: string });
      expect(done.map((item) => item.type)).toEqual(["reasoning", "message", "function_call", "function_call"]);
      expect(done[0]?.encrypted_content?.startsWith("unb1.")).toBe(true);
      expect(done[2]).toMatchObject({ call_id: "call_1", arguments: '{"path":"a.txt"}' });
      expect((events.at(-1)?.["response"] as { usage: { total_tokens: number } }).usage.total_tokens).toBe(22_000);
      expect(before - (await balanceOf(user.user))).toBeGreaterThan(0);
    });

    it("round-trips the previous turn's items (tool calls, outputs, reasoning) into model messages", async () => {
      const { key } = await createKey(user.user, "responses-roundtrip");
      // turn 1: get the reasoning item exactly as the stream returned it
      const first = await responsesCall(
        { Authorization: `Bearer ${key}` },
        { model: toolModelId, tools: [readFileFunction], stream: true },
        agentRunner,
      );
      const items = sseEvents(await first.text())
        .filter((e) => e.type === "response.output_item.done")
        .map((e) => e["item"]);
      const reasoning = items[0] as { type: "reasoning"; summary: Array<{ type: "summary_text"; text: string }>; encrypted_content: string };
      const res = await responsesCall(
        { Authorization: `Bearer ${key}` },
        {
          model: toolModelId,
          tools: [readFileFunction],
          input: [
            { type: "message", role: "user", content: [{ type: "input_text", text: "read a and b" }] },
            reasoning,
            { type: "function_call", call_id: "call_1", name: "read_file", arguments: '{"path":"a.txt"}' },
            { type: "function_call", call_id: "call_2", name: "read_file", arguments: '{"path":"b.txt"}' },
            { type: "function_call_output", call_id: "call_1", output: "AAA" },
            { type: "function_call_output", call_id: "call_2", output: "BBB" },
          ],
        },
        textRunner,
      );
      expect(res.status).toBe(200);
      const messages = capturedRequest()?.messages ?? [];
      expect(messages.map((m) => m.role)).toEqual(["user", "assistant", "tool"]);
      expect(messages[1]).toMatchObject({
        role: "assistant",
        content: [
          { type: "reasoning", text: "Need both files.", providerOptions: { openrouter: { sig: "x" } } },
          { type: "tool-call", toolCallId: "call_1", input: { path: "a.txt" } },
          { type: "tool-call", toolCallId: "call_2", input: { path: "b.txt" } },
        ],
      });
      expect(messages[2]).toMatchObject({
        role: "tool",
        content: [
          { toolCallId: "call_1", toolName: "read_file", output: { type: "text", value: "AAA" } },
          { toolCallId: "call_2", toolName: "read_file", output: { type: "text", value: "BBB" } },
        ],
      });
    });

    it("accepts the OpenAI spelling of our model ids", async () => {
      const gpt = listUserCallableModels(user.user, await getEnvAvailability()).find((m) => /^gpt-\d\d(-|$)/.test(m.id));
      if (!gpt) {
        return;
      }
      const { key } = await createKey(user.user, "responses-gpt-spelling");
      const spelled = gpt.id.replace(/^gpt-(\d)(\d)/, "gpt-$1.$2");
      const res = await responsesCall({ Authorization: `Bearer ${key}` }, { model: spelled }, textRunner);
      expect(res.status).toBe(200);
      expect(capturedRequest()?.model.id).toBe(gpt.id);
    });

    it("OpenAI-shaped errors: 401, 404 unknown model, 400 previous_response_id", async () => {
      const unauthorized = await responsesCall({ Authorization: "Bearer sk-unb-nope" }, { model: toolModelId }, textRunner);
      expect(unauthorized.status).toBe(401);
      expect(((await unauthorized.json()) as { error: { code: string } }).error.code).toBe("invalid_api_key");
      const { key } = await createKey(user.user, "responses-errors");
      const missing = await responsesCall({ Authorization: `Bearer ${key}` }, { model: "no-such-model" }, textRunner);
      expect(missing.status).toBe(404);
      expect(((await missing.json()) as { error: { code: string; type: string } }).error).toMatchObject({
        code: "model_not_found",
        type: "not_found_error",
      });
      const stored = await responsesCall(
        { Authorization: `Bearer ${key}` },
        { model: toolModelId, previous_response_id: "resp_123" },
        textRunner,
      );
      expect(stored.status).toBe(400);
      expect(((await stored.json()) as { error: { param: string } }).error.param).toBe("previous_response_id");
    });
  });

  describe("POST /v1/messages", () => {
    it("authenticates with x-api-key, runs, bills and returns an Anthropic message", async () => {
      const { key } = await createKey(user.user, "messages");
      const before = await balanceOf(user.user);
      const res = await messagesCall(
        { "x-api-key": key },
        { model: toolModelId, tools: [readFileAnthropic], system: [{ type: "text", text: "Be brief." }] },
        agentRunner,
      );
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        type: string;
        role: string;
        model: string;
        content: Array<{ type: string; id?: string; input?: object; text?: string; signature?: string }>;
        stop_reason: string;
        usage: { input_tokens: number; output_tokens: number; cache_read_input_tokens: number; credits_charged: number };
      };
      expect(body.type).toBe("message");
      expect(body.role).toBe("assistant");
      expect(body.model).toBe(toolModelId);
      expect(body.content.map((block) => block.type)).toEqual(["thinking", "text", "tool_use", "tool_use"]);
      expect(body.content[2]).toEqual({ type: "tool_use", id: "call_1", name: "read_file", input: { path: "a.txt" } });
      expect(body.stop_reason).toBe("tool_use");
      // Anthropic counts cache reads separately from input_tokens
      expect(body.usage).toMatchObject({ input_tokens: 15_000, cache_read_input_tokens: 5_000, output_tokens: 2_000 });
      const spent = before - (await balanceOf(user.user));
      expect(spent).toBeGreaterThan(0);
      expect(spent).toBeCloseTo(body.usage.credits_charged, 1);
      expect(capturedRequest()?.messages[0]).toEqual({ role: "system", content: "Be brief." });
    });

    it("authenticates with Authorization: Bearer and streams the Anthropic event sequence", async () => {
      const { key } = await createKey(user.user, "messages-stream");
      const res = await messagesCall(
        { Authorization: `Bearer ${key}` },
        { model: toolModelId, tools: [readFileAnthropic], stream: true },
        agentRunner,
      );
      expect(res.status).toBe(200);
      const events = sseEvents(await res.text());
      expect(events.map((e) => e.type)).toEqual([
        "message_start",
        "ping",
        "content_block_start",
        "content_block_delta",
        "content_block_delta",
        "content_block_stop",
        "content_block_start",
        "content_block_delta",
        "content_block_delta",
        "content_block_stop",
        "content_block_start",
        "content_block_delta",
        "content_block_stop",
        "content_block_start",
        "content_block_delta",
        "content_block_stop",
        "message_delta",
        "message_stop",
      ]);
      expect(events.at(-2)).toMatchObject({ delta: { stop_reason: "tool_use" }, usage: { output_tokens: 2_000 } });
    });

    it("round-trips tool_use / tool_result and the thinking signature", async () => {
      const { key } = await createKey(user.user, "messages-roundtrip");
      const first = await messagesCall(
        { "x-api-key": key },
        { model: toolModelId, tools: [readFileAnthropic], stream: true },
        agentRunner,
      );
      const signature = sseEvents(await first.text())
        .map((e) => e["delta"] as { type?: string; signature?: string } | undefined)
        .find((delta) => delta?.type === "signature_delta")?.signature;
      expect(signature).toBeDefined();
      const res = await messagesCall(
        { "x-api-key": key },
        {
          model: toolModelId,
          tools: [readFileAnthropic],
          messages: [
            { role: "user", content: "read a" },
            {
              role: "assistant",
              content: [
                { type: "thinking", thinking: "Need both files.", signature: signature ?? "" },
                { type: "tool_use", id: "call_1", name: "read_file", input: { path: "a.txt" } },
              ],
            },
            { role: "user", content: [{ type: "tool_result", tool_use_id: "call_1", content: "AAA" }] },
          ],
        },
        textRunner,
      );
      expect(res.status).toBe(200);
      const messages = capturedRequest()?.messages ?? [];
      expect(messages[1]).toMatchObject({
        role: "assistant",
        content: [
          { type: "reasoning", text: "Need both files.", providerOptions: { openrouter: { sig: "x" } } },
          { type: "tool-call", toolCallId: "call_1", toolName: "read_file", input: { path: "a.txt" } },
        ],
      });
      expect(messages[2]).toMatchObject({
        role: "tool",
        content: [{ toolCallId: "call_1", toolName: "read_file", output: { type: "text", value: "AAA" } }],
      });
    });

    it("maps Claude Code's dated Claude ids to our Claude model", async () => {
      if (!claudeSonnetId) {
        return;
      }
      const { key } = await createKey(user.user, "messages-claude-id");
      const res = await messagesCall({ "x-api-key": key }, { model: "claude-sonnet-4-5-20250929" }, textRunner);
      expect(res.status).toBe(200);
      expect(capturedRequest()?.model.id.startsWith("claude-sonnet-")).toBe(true);
      // the response echoes the id the client sent
      expect(((await res.json()) as { model: string }).model).toBe("claude-sonnet-4-5-20250929");
    });

    it("Anthropic-shaped errors: 401, 404, 402", async () => {
      const unauthorized = await messagesCall({ "x-api-key": "sk-unb-nope" }, { model: toolModelId }, textRunner);
      expect(unauthorized.status).toBe(401);
      expect(await unauthorized.json()).toMatchObject({ type: "error", error: { type: "authentication_error" } });
      const { key } = await createKey(user.user, "messages-errors");
      const missing = await messagesCall({ "x-api-key": key }, { model: "no-such-model" }, textRunner);
      expect(missing.status).toBe(404);
      expect(await missing.json()).toMatchObject({ type: "error", error: { type: "not_found_error" } });
      const brokeKey = await createKey(broke.user, "messages-broke");
      await drainCredits(broke.user);
      const poor = await messagesCall({ "x-api-key": brokeKey.key }, { model: toolModelId }, textRunner);
      expect(poor.status).toBe(402);
      expect(await poor.json()).toMatchObject({ type: "error", error: { type: "billing_error" } });
      expect(poor.headers.get("x-should-retry")).toBe("false");
    });
  });

  describe("POST /v1/messages/count_tokens", () => {
    it("estimates input tokens without spending credits or rate-limit budget", async () => {
      const { id, key } = await createKey(user.user, "count-tokens");
      await db.update(userApiKeys).set({ rateLimitPerMinute: 1 }).where(eq(userApiKeys.id, id));
      resetRateLimit(id);
      const before = await balanceOf(user.user);
      for (let i = 0; i < 3; i++) {
        const request = v1Request("/messages/count_tokens", { "x-api-key": key }, {});
        const out = await V1CountTokensRepository.count({
          data: {
            action: "count_tokens",
            model: "claude-sonnet-4-5",
            system: "You are a coding agent.",
            messages: [{ role: "user", content: "Read notes.txt and summarize it." }],
            tools: [readFileAnthropic],
          },
          user: await authed(request),
          request,
          t,
          logger,
        });
        expect(out.response.status).toBe(200);
        expect(((await out.response.json()) as { input_tokens: number }).input_tokens).toBeGreaterThan(10);
      }
      expect(await balanceOf(user.user)).toBe(before);
      // the one real call this minute is still available
      expect((await messagesCall({ "x-api-key": key }, { model: toolModelId }, textRunner)).status).toBe(200);
    });
  });

  describe("GET /v1/models", () => {
    it("works with x-api-key and carries both OpenAI and Anthropic fields", async () => {
      const { key } = await createKey(user.user, "models-anthropic");
      const request = v1Request("/models", { "x-api-key": key });
      const out = await V1ModelsRepository.list(await authed(request), request, t, logger);
      expect(out.response.status).toBe(200);
      const body = (await out.response.json()) as {
        object: string;
        has_more: boolean;
        data: Array<{ id: string; object: string; type: string; display_name: string; created_at: string }>;
      };
      expect(body.object).toBe("list");
      expect(body.has_more).toBe(false);
      expect(body.data[0]).toMatchObject({ object: "model", type: "model" });
      expect(typeof body.data[0]?.display_name).toBe("string");
      expect(Number.isNaN(Date.parse(body.data[0]?.created_at ?? ""))).toBe(false);
    });
  });
});
