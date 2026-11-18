/**
 * Upstream error parts seen on prod (2026-11-17) map to a message that tells
 * the user what to do, instead of a generic "no response".
 */

import { describe, expect, it } from "vitest";

import { providerErrorTranslationKey } from "./provider-error-key";

describe("providerErrorTranslationKey", () => {
  it("overloads and outages say retry or switch", () => {
    expect(
      providerErrorTranslationKey(
        "Model is temporarily overloaded. Please try again after 5 seconds or choose another model.",
      ),
    ).toBe("errors.providerBusy");
    expect(
      providerErrorTranslationKey(
        "The requested service is temporarily unavailable. Please try again later.",
      ),
    ).toBe("errors.providerBusy");
  });

  it("provider moderation reads as a content filter", () => {
    expect(
      providerErrorTranslationKey(
        "Upstream error from Alibaba: Output data may contain inappropriate content.",
      ),
    ).toBe("errors.contentFiltered");
  });

  it("an upstream account / edge refusal reads as model unavailable", () => {
    expect(
      providerErrorTranslationKey(
        "This request requires more credits, or fewer max_tokens. You requested up to 935342 tokens, but can only afford 767542.",
      ),
    ).toBe("errors.modelUnavailable");
    expect(
      providerErrorTranslationKey(
        'FreedomGPT edge returned 403 "Attention Required! | Cloudflare" (Cloudflare block/challenge)',
      ),
    ).toBe("errors.modelUnavailable");
  });

  it("unknown or missing provider errors fall back to the caller's message", () => {
    expect(providerErrorTranslationKey(null)).toBeNull();
    expect(
      providerErrorTranslationKey(
        "Partial response received, but the final tool call was malformed and was not executed.",
      ),
    ).toBeNull();
  });
});
