/**
 * Upstream error parts seen on prod (2026-11-17) map to a message that tells
 * the user what to do, instead of a generic "no response".
 */

import { describe, expect, it } from "vitest";

import { providerErrorTranslationKey } from "./provider-error-key";

describe("providerErrorTranslationKey", () => {
  it("identifies the provider's per-image limit without treating a token limit as an image error", () => {
    expect(providerErrorTranslationKey("image exceeds 10 MB maximum")).toBe("errors.imageTooLarge");
    expect(providerErrorTranslationKey("Input exceeds 3000 tokens")).toBeNull();
  });

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

  it("a malformed tool call says the partial reply is saved and to continue", () => {
    // NanoGPT, prod 2026-11-20 (GLM 5.3 Uncensored, two support reports)
    expect(
      providerErrorTranslationKey(
        "Partial response received, but the final tool call was malformed and was not executed.",
      ),
    ).toBe("errors.malformedToolCall");
    expect(
      providerErrorTranslationKey("Invalid tool call: arguments are not JSON"),
    ).toBe("errors.malformedToolCall");
  });

  it("a context-length overflow tells the user to shorten or switch model", () => {
    // Parasail via Uncensored LM, prod 2026-11-25 (248k-char pasted message)
    expect(
      providerErrorTranslationKey(
        'Parasail API error: 400 - {"error":{"message":"This model\'s maximum context length is 65536 tokens. However, you requested 1000 output tokens and your prompt contains at least 64537 input tokens, for a total of at least 65537 tokens. Please reduce the length of the input prompt or the number of requested output tokens. (parameter=input_tokens, value=64537)","type":"BadRequestError","param":"input_tokens","code":400}}',
      ),
    ).toBe("errors.contextTooLong");
  });

  it("unknown or missing provider errors fall back to the caller's message", () => {
    expect(providerErrorTranslationKey(null)).toBeNull();
    expect(
      providerErrorTranslationKey("Something unexpected happened upstream."),
    ).toBeNull();
  });
});
