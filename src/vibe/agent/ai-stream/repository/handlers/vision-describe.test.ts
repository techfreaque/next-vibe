import { describe, expect, mock, test } from "bun:test";
import type { generateText } from "ai";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { ImageVisionModelOption } from "../../vision-models";
import { imageVisionModelOptions } from "../../vision-models";
import { describeWithVisionFallback } from "./vision-describe";

type GenerateResult = Awaited<ReturnType<typeof generateText>>;

const logger = createEndpointLogger(false, "en-US");
const primary = imageVisionModelOptions[0];
const fallback = imageVisionModelOptions.find((m) => m.id !== primary?.id);

function fakeResult(text: string, finishReason: string): GenerateResult {
  const partial: Pick<GenerateResult, "text" | "finishReason"> = {
    text,
    finishReason: finishReason as GenerateResult["finishReason"],
  };
  return partial as GenerateResult;
}

describe("describeWithVisionFallback", () => {
  test("a refusal on the primary model falls back once", async () => {
    const calls: string[] = [];
    const outcome = await describeWithVisionFallback<ImageVisionModelOption>({
      model: primary!,
      mediaSource: "remote-url",
      resolveFallback: () => fallback!,
      run: async (model) => {
        calls.push(model.id);
        return model.id === primary!.id
          ? fakeResult("I'm sorry, I can't describe this image.", "stop")
          : fakeResult("A red bicycle leaning on a brick wall.", "stop");
      },
      logger,
      logTag: "[Test]",
    });
    expect(calls).toEqual([primary!.id, fallback!.id]);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.model.id).toBe(fallback!.id);
    }
  });

  test("a moderation error falls back; both failing returns the reasons", async () => {
    const warn = mock(logger.warn);
    const outcome = await describeWithVisionFallback<ImageVisionModelOption>({
      model: primary!,
      mediaSource: "remote-url",
      resolveFallback: () => fallback!,
      run: async (model) => {
        if (model.id === primary!.id) {
          throw new Error("PROHIBITED_CONTENT");
        }
        return fakeResult("", "content-filter");
      },
      logger: { ...logger, warn },
      logTag: "[Test]",
    });
    expect(warn).toHaveBeenCalledWith(
      "[Test] Vision model refused by provider moderation",
      expect.objectContaining({
        mediaSource: "remote-url",
        visionAttempt: { apiProvider: primary!.apiProvider, isFallback: false },
      }),
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toContain("PROHIBITED_CONTENT");
      expect(outcome.reason).toContain(fallback!.id);
    }
  });

  test("no fallback available returns the primary reason", async () => {
    const outcome = await describeWithVisionFallback<ImageVisionModelOption>({
      model: primary!,
      mediaSource: "remote-url",
      resolveFallback: () => null,
      run: async () => fakeResult("", "stop"),
      logger,
      logTag: "[Test]",
    });
    expect(outcome.ok).toBe(false);
  });
});
