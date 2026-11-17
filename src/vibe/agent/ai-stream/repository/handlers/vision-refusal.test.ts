import { describe, expect, test } from "bun:test";

import { detectVisionRefusal, isModerationError } from "./vision-refusal";

describe("detectVisionRefusal", () => {
  test("a real description passes", () => {
    expect(
      detectVisionRefusal(
        "A dark banner with a white genie lamp on the left and the text unbottled.ai.",
        "stop",
      ),
    ).toBeNull();
  });

  test("content-filter finish is a refusal even with text", () => {
    expect(detectVisionRefusal("partial", "content-filter")).toContain(
      "content filter",
    );
  });

  test("empty output is a failure", () => {
    expect(detectVisionRefusal("   ", "stop")).toContain("empty description");
  });

  test("short refusal replies are refusals", () => {
    for (const reply of [
      "I'm sorry, but I can't help with describing this image.",
      "I cannot describe this content.",
      "Sorry, I can't assist with that.",
      "I’m unable to process this image.",
    ]) {
      expect(detectVisionRefusal(reply, "stop")).toContain("model refused");
    }
  });

  test("a long description that opens like a refusal is kept", () => {
    const long = `I can't make out the small print, but ${"the scene shows a crowded street at dusk. ".repeat(20)}`;
    expect(detectVisionRefusal(long, "stop")).toBeNull();
  });
});

describe("isModerationError", () => {
  test("provider moderation blocks", () => {
    expect(isModerationError("Provider returned PROHIBITED_CONTENT")).toBe(
      true,
    );
    expect(isModerationError("blocked by content_policy")).toBe(true);
  });

  test("ordinary failures are not moderation", () => {
    expect(isModerationError("fetch failed: ECONNRESET")).toBe(false);
  });
});
