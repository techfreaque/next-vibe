import { describe, expect, it, spyOn } from "bun:test";
import type { ModelMessage } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { truncateToContextWindow } from "./token-budget";

function text(role: "user" | "assistant", chars: number): ModelMessage {
  return { role, content: "x".repeat(chars) };
}

describe("truncateToContextWindow", () => {
  it("logs one row with the outcome when older messages are dropped", () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const warn = spyOn(logger, "warn");
    const messages = [
      text("user", 35_000),
      text("assistant", 35_000),
      text("user", 3_500),
    ];
    const result = truncateToContextWindow(
      messages,
      12_000,
      logger,
      "",
      undefined,
      "test-model",
    );
    expect(result).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toBe(
      "[Truncation] Messages exceed context window - dropped older messages",
    );
    expect(warn.mock.calls[0]?.[1]).toMatchObject({
      droppedCount: 2,
      stillOverLimit: false,
    });
  });

  it("names the over-budget outcome when the protected message alone is too big", () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const warn = spyOn(logger, "warn");
    const result = truncateToContextWindow(
      [text("user", 350_000)],
      32_768,
      logger,
      "",
      undefined,
      "test-model",
    );
    expect(result).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toBe(
      "[Truncation] Protected messages alone exceed the context window - provider call goes out over budget",
    );
    expect(warn.mock.calls[0]?.[1]).toMatchObject({
      droppedCount: 0,
      stillOverLimit: true,
    });
  });
});
