import { describe, expect, it } from "bun:test";

import {
  classifyImageProviderError,
  ImageProviderFailureKind,
} from "./provider-error";

describe("classifyImageProviderError", () => {
  it("flags content-filter refusals (prod messages)", () => {
    for (const message of [
      // OpenRouter / GPT Image, prod 2026-11-16 12:35
      "External service error: Your request was rejected by the safety system. If you believe this is an error, contact us at help.openai.com and include the request ID req_33997fce (HTTP 400)",
      "External service error: Prompt violates our content policy (HTTP 400)",
      "NSFW content detected in the prompt",
      "Request flagged by moderation",
      "Green net check rejected text (input)",
      "Request failed because the input text 'content[0]' may contain sensitive information.",
    ]) {
      expect(classifyImageProviderError(message)).toBe(
        ImageProviderFailureKind.CONTENT_POLICY,
      );
    }
  });

  it("flags outages: 5xx, timeouts, network, rate limits", () => {
    for (const message of [
      "External service error: HTTP 503 (HTTP 503)",
      "External service error: Upstream error (HTTP 502)",
      "Request timed out waiting for image generation",
      "Request failed: fetch failed",
      "External service error: Rate limit exceeded (HTTP 429)",
      "Provider returned a non-JSON response (HTTP 504): <html>",
      "No endpoints found for minimax/hailuo-3-max.",
      "No allowed providers are available for the selected model",
    ]) {
      expect(classifyImageProviderError(message)).toBe(
        ImageProviderFailureKind.OUTAGE,
      );
    }
  });

  it("leaves everything else as a plain failure", () => {
    expect(
      classifyImageProviderError("No image URL returned from provider"),
    ).toBe(ImageProviderFailureKind.OTHER);
    expect(
      classifyImageProviderError(
        "Video generation completed with no output (content may have been filtered)",
      ),
    ).toBe(ImageProviderFailureKind.OTHER);
    expect(classifyImageProviderError("Invalid model id (HTTP 400)")).toBe(
      ImageProviderFailureKind.OTHER,
    );
  });
});
