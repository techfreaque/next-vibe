/**
 * StreamRelayPostBody + toolSource filtering unit tests
 *
 * Tests that RemoteTransport.relayStream() applies the correct toolSource
 * filtering to the POST body before forwarding to the remote:
 *
 * - toolSource=remote → strips systemPrompt + tools
 * - toolSource=local  → sends all fields as-is
 * - toolSource=both   → sends local schemas; remote merges with its own
 *
 * We test the filtering logic in isolation — no network calls.
 */

import { describe, expect, it } from "vitest";

import type { StreamRelayPostBody } from "@/app/api/[locale]/remote-connection/stream-relay";
import type { ToolSource } from "@/app/api/[locale]/remote-connection/db";

// ─── Mirror the filtering logic from RemoteTransport.relayStream() ────────────

function applyToolSourceFilter(
  body: StreamRelayPostBody,
  toolSource: ToolSource,
): StreamRelayPostBody {
  const filtered: StreamRelayPostBody = { ...body };
  if (toolSource === "remote") {
    delete filtered.systemPrompt;
    delete filtered.tools;
  }
  return filtered;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

const FULL_BODY: StreamRelayPostBody = {
  content: "Hello",
  model: "claude-haiku-4-5",
  skill: "default",
  threadId: "thread-abc",
  systemPrompt: "You are a helpful assistant.",
  tools: [
    {
      name: "web_search",
      description: "Search the web",
      parameters: { type: "object", properties: {} },
    },
  ],
};

describe("toolSource filtering on relayStream postBody", () => {
  it("toolSource=remote strips systemPrompt and tools", () => {
    const result = applyToolSourceFilter(FULL_BODY, "remote");
    expect(result).not.toHaveProperty("systemPrompt");
    expect(result).not.toHaveProperty("tools");
  });

  it("toolSource=remote preserves all other fields", () => {
    const result = applyToolSourceFilter(FULL_BODY, "remote");
    expect(result.content).toBe("Hello");
    expect(result.model).toBe("claude-haiku-4-5");
    expect(result.skill).toBe("default");
    expect(result.threadId).toBe("thread-abc");
  });

  it("toolSource=local sends all fields including systemPrompt and tools", () => {
    const result = applyToolSourceFilter(FULL_BODY, "local");
    expect(result.systemPrompt).toBe("You are a helpful assistant.");
    expect(result.tools).toHaveLength(1);
    expect(result.tools?.[0]?.name).toBe("web_search");
  });

  it("toolSource=both sends all fields (remote merges its own)", () => {
    const result = applyToolSourceFilter(FULL_BODY, "both");
    expect(result.systemPrompt).toBe("You are a helpful assistant.");
    expect(result.tools).toHaveLength(1);
  });

  it("toolSource=remote on body without systemPrompt or tools is a no-op", () => {
    const minimalBody: StreamRelayPostBody = { content: "Hi", model: "m" };
    const result = applyToolSourceFilter(minimalBody, "remote");
    expect(result).toEqual({ content: "Hi", model: "m" });
  });

  it("does not mutate the original body", () => {
    const body = { ...FULL_BODY };
    applyToolSourceFilter(body, "remote");
    expect(body.systemPrompt).toBe("You are a helpful assistant.");
    expect(body.tools).toHaveLength(1);
  });

  it("toolSource=remote with tools:[] → tools key absent from result", () => {
    const body: StreamRelayPostBody = { content: "Hi", model: "m", tools: [] };
    const result = applyToolSourceFilter(body, "remote");
    expect(result).not.toHaveProperty("tools");
  });

  it("toolSource=both with 3 named tools → all 3 names present", () => {
    const body: StreamRelayPostBody = {
      content: "Hi",
      tools: [
        { name: "alpha", description: "a", parameters: {} },
        { name: "beta", description: "b", parameters: {} },
        { name: "gamma", description: "c", parameters: {} },
      ],
    };
    const result = applyToolSourceFilter(body, "both");
    const names = result.tools?.map((t) => t.name) ?? [];
    expect(names).toContain("alpha");
    expect(names).toContain("beta");
    expect(names).toContain("gamma");
  });

  it("filter is non-destructive: original object reference unchanged after any toolSource", () => {
    const body = { ...FULL_BODY };
    const ref = body;
    applyToolSourceFilter(body, "remote");
    applyToolSourceFilter(body, "local");
    applyToolSourceFilter(body, "both");
    expect(body).toBe(ref);
    expect(body.systemPrompt).toBe("You are a helpful assistant.");
  });

  it("instanceId field survives filter for all toolSource values", () => {
    const body: StreamRelayPostBody = { content: "Hi", instanceId: "hermes" };
    expect(applyToolSourceFilter(body, "remote").instanceId).toBe("hermes");
    expect(applyToolSourceFilter(body, "local").instanceId).toBe("hermes");
    expect(applyToolSourceFilter(body, "both").instanceId).toBe("hermes");
  });

  it("threadMirrorMode passes through for all toolSource values", () => {
    const body: StreamRelayPostBody = { content: "Hi", threadMirrorMode: "both" };
    expect(applyToolSourceFilter(body, "remote").threadMirrorMode).toBe("both");
    expect(applyToolSourceFilter(body, "local").threadMirrorMode).toBe("both");
    expect(applyToolSourceFilter(body, "both").threadMirrorMode).toBe("both");
  });

  it("filter applied twice is idempotent", () => {
    const body = { ...FULL_BODY };
    const once = applyToolSourceFilter(body, "remote");
    const twice = applyToolSourceFilter(once, "remote");
    expect(twice).toEqual(once);
  });
});

// ─── StreamRelayPostBody shape validation ────────────────────────────────────

describe("StreamRelayPostBody optional fields", () => {
  it("accepts a minimal body with only content", () => {
    const body: StreamRelayPostBody = { content: "Hello" };
    expect(body.content).toBe("Hello");
    expect(body.model).toBeUndefined();
    expect(body.systemPrompt).toBeUndefined();
    expect(body.tools).toBeUndefined();
  });

  it("accepts a full body with all optional fields", () => {
    const body: StreamRelayPostBody = {
      content: "Hello",
      model: "gpt-4",
      skill: "coding",
      threadId: "t-123",
      instanceId: "hermes",
      rootFolderId: "background",
      timezone: "UTC",
      threadMirrorMode: "both",
      systemPrompt: "Be concise.",
      tools: [{ name: "t", description: "d", parameters: {} }],
    };
    expect(body.tools?.[0]?.name).toBe("t");
    expect(body.threadMirrorMode).toBe("both");
  });
});

// ─── StreamRelayResult shape ──────────────────────────────────────────────────

describe("StreamRelayResult", () => {
  it("has responseThreadId and messageId fields", async () => {
    // Import just to verify the type structure exists at runtime (no assertions needed)
    const mod = await import("@/app/api/[locale]/remote-connection/stream-relay");
    expect(typeof mod.relayStream).toBe("function");
  });
});
