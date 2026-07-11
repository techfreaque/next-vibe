/**
 * Tolerant message-schema parsing: valid messages parse into typed
 * ChatMessage, legacy/garbage shapes are skipped or field-dropped — a
 * message-history parse must never throw.
 */

import { describe, expect, it } from "bun:test";

import { ChatMessageRole } from "./enum";
import {
  chatMessageTolerantSchema,
  messageHistoryTolerantSchema,
  messageMetadataSchema,
} from "./message-schema";

const validMessage = {
  id: "11111111-1111-4111-8111-111111111111",
  threadId: "22222222-2222-4222-8222-222222222222",
  role: ChatMessageRole.USER,
  content: "hello",
  parentId: null,
  sequenceId: null,
  isAI: false,
  model: null,
  skill: null,
  metadata: { totalTokens: 42 },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("messageMetadataSchema", () => {
  it("parses valid metadata into specific types", () => {
    const result = messageMetadataSchema.parse({
      totalTokens: 42,
      toolCall: {
        toolCallId: "call_1",
        toolName: "generate_image",
        args: { prompt: "a cat" },
        result: { imageUrl: "https://x/y.png" },
        status: "completed",
      },
      generatedMedia: {
        type: "image",
        url: "https://x/y.png",
        prompt: "a cat",
        modelId: "flux",
        creditCost: 1,
      },
    });
    expect(result.totalTokens).toBe(42);
    expect(result.toolCall?.toolName).toBe("generate_image");
    expect(result.generatedMedia?.type).toBe("image");
  });

  it("drops fields with legacy/invalid shapes instead of failing", () => {
    const result = messageMetadataSchema.parse({
      totalTokens: "not-a-number",
      toolCall: { legacy: "shape without toolCallId" },
      generatedMedia: { type: "hologram" },
      isStreaming: false,
      unknownLegacyKey: { deeply: ["nested", "junk"] },
    });
    expect(result.totalTokens).toBeUndefined();
    expect(result.toolCall).toBeUndefined();
    expect(result.generatedMedia).toBeUndefined();
    expect(result.isStreaming).toBe(false);
  });

  it("keeps tool calls referencing removed model ids in pipelineSteps", () => {
    const result = messageMetadataSchema.parse({
      pipelineSteps: [
        { type: "stt", modelId: "removed-model-from-2024", creditCost: 0.5 },
      ],
    });
    expect(result.pipelineSteps).toHaveLength(1);
  });
});

describe("chatMessageTolerantSchema", () => {
  it("parses a valid message and coerces dates", () => {
    const parsed = chatMessageTolerantSchema.parse(validMessage);
    expect(parsed.id).toBe(validMessage.id);
    expect(parsed.content).toBe("hello");
    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(parsed.upvotes).toBe(0);
  });

  it("coerces array content (AI SDK multi-part) to a JSON string", () => {
    const parsed = chatMessageTolerantSchema.parse({
      ...validMessage,
      content: [{ type: "text", text: "hi" }],
    });
    expect(parsed.content).toBe(JSON.stringify([{ type: "text", text: "hi" }]));
  });

  it("tolerates bad optional fields and garbage metadata", () => {
    const parsed = chatMessageTolerantSchema.parse({
      ...validMessage,
      parentId: 12345,
      upvotes: "many",
      createdAt: "not-a-date",
      metadata: "corrupted-string-metadata",
    });
    expect(parsed.parentId).toBeNull();
    expect(parsed.upvotes).toBe(0);
    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(parsed.metadata).toEqual({});
  });

  it("rejects messages missing core identity fields", () => {
    const parsed = chatMessageTolerantSchema.safeParse({
      role: ChatMessageRole.USER,
      content: "orphan",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("messageHistoryTolerantSchema", () => {
  it("keeps valid messages and skips legacy shapes without throwing", () => {
    const result = messageHistoryTolerantSchema.parse([
      validMessage,
      { totally: "wrong shape" },
      null,
      "a string",
      42,
      { ...validMessage, id: "33333333-3333-4333-8333-333333333333" },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]?.id).toBe(validMessage.id);
  });

  it("returns [] for null/undefined input", () => {
    expect(messageHistoryTolerantSchema.parse(null)).toEqual([]);
    expect(messageHistoryTolerantSchema.parse(undefined)).toEqual([]);
  });
});
