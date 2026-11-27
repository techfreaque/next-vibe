import { describe, expect, spyOn, test } from "bun:test";
import type { generateText } from "ai";
import { createEndpointLogger } from "next-vibe/logger/server";

import { VideoVisionModelId, videoVisionModelOptions } from "../../vision-models";
import {
  type BridgeAttemptOutcome,
  type BridgeAttemptRecord,
  runBridgeChain,
} from "./bridge-call";

type GenerateResult = Awaited<ReturnType<typeof generateText>>;

function model(id: VideoVisionModelId): (typeof videoVisionModelOptions)[number] {
  const option = videoVisionModelOptions.find((m) => m.id === id);
  if (!option) {
    throw new Error(`fixture model ${id} missing`);
  }
  return option;
}

const gemini = model(VideoVisionModelId.GEMINI_3_5_FLASH_LITE);
const mimo = model(VideoVisionModelId.MIMO_V2_6_FLASH);
const glm = model(VideoVisionModelId.GLM_5_3_FLASH);

function okOutcome(): BridgeAttemptOutcome {
  const partial: Pick<GenerateResult, "text" | "finishReason"> = {
    text: "A long description",
    finishReason: "stop",
  };
  return {
    kind: "ok",
    requestStartedAt: Date.now(),
    result: partial as GenerateResult,
    output: "A long description",
  };
}

function loggerSpies(): {
  logger: ReturnType<typeof createEndpointLogger>;
  warn: ReturnType<typeof spyOn>;
  error: ReturnType<typeof spyOn>;
} {
  const logger = createEndpointLogger(false, "en-US");
  return {
    logger,
    warn: spyOn(logger, "warn").mockImplementation(() => undefined),
    error: spyOn(logger, "error").mockImplementation(() => undefined),
  };
}

const base = {
  bridgeType: "vision" as const,
  modality: "video" as const,
  inputContext: { mediaType: "video/quicktime" },
  errorLabel: "Video vision",
};

describe("runBridgeChain", () => {
  test("a first-call success writes no row", async () => {
    const { logger, warn, error } = loggerSpies();
    const chain = await runBridgeChain({
      ...base,
      logger,
      model: gemini,
      resolveFallback: () => null,
      attempt: async (m, attempts: BridgeAttemptRecord[]) => {
        attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "ok", durationMs: 5, deadlineMs: 150_000 });
        return okOutcome();
      },
    });
    expect(chain.kind).toBe("ok");
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test("a retry that recovers is ONE warn row carrying both attempts", async () => {
    const { logger, warn, error } = loggerSpies();
    let calls = 0;
    const chain = await runBridgeChain({
      ...base,
      logger,
      model: gemini,
      resolveFallback: () => mimo,
      attempt: async (m, attempts) => {
        calls++;
        if (calls === 1) {
          attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "refusal-reply", durationMs: 900, deadlineMs: 150_000, error: "model refused: I cannot" });
          return { kind: "fail", reason: "model refused: I cannot", failureClass: "content-refusal" };
        }
        attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "ok", durationMs: 1200, deadlineMs: 150_000 });
        return okOutcome();
      },
    });
    expect(chain.kind === "ok" && chain.model.id).toBe(mimo.id);
    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    const [message, meta] = warn.mock.calls[0] ?? [];
    expect(message).toBe("[GapFill] Video vision bridge recovered after failed attempts");
    expect(meta).toMatchObject({
      outcome: "recovered",
      attemptStages: [`${gemini.id}:refusal-reply`, `${mimo.id}:ok`],
    });
  });

  test("refusals on every model are ONE error row, after three models", async () => {
    const { logger, warn, error } = loggerSpies();
    const chain = [mimo, glm];
    const chainResult = await runBridgeChain({
      ...base,
      logger,
      model: gemini,
      resolveFallback: () => chain.shift() ?? null,
      attempt: async (m, attempts) => {
        attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "provider-moderation", durationMs: 300, deadlineMs: 150_000 });
        return { kind: "fail", reason: "refused by provider moderation", failureClass: "content-refusal" };
      },
    });
    expect(chainResult.kind).toBe("fail");
    expect(warn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0]?.[1]).toMatchObject({
      outcome: "refused",
      modelsTried: 3,
    });
  });

  test("a provider error chain stops after two models", async () => {
    const { logger, error } = loggerSpies();
    let fallbacks = 0;
    await runBridgeChain({
      ...base,
      logger,
      model: gemini,
      resolveFallback: () => {
        fallbacks++;
        return fallbacks === 1 ? mimo : glm;
      },
      attempt: async (m, attempts) => {
        attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "request-error", durationMs: 10_000, deadlineMs: 150_000, error: "Connect Timeout Error" });
        return { kind: "fail", reason: "Connect Timeout Error", failureClass: "provider-error" };
      },
    });
    expect(fallbacks).toBe(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0]?.[1]).toMatchObject({ outcome: "failed", modelsTried: 2 });
  });

  test("a cancelled stream is ONE aborted row with its reason", async () => {
    const { logger, warn, error } = loggerSpies();
    const chain = await runBridgeChain({
      ...base,
      logger,
      model: gemini,
      resolveFallback: () => mimo,
      attempt: async (m, attempts) => {
        attempts.push({ modelId: m.id, apiProvider: m.apiProvider, attempt: 1, stage: "aborted", durationMs: 40, deadlineMs: 150_000, endedBy: "parent-stream", abortReason: "user_cancelled" });
        return { kind: "aborted" };
      },
    });
    expect(chain.kind).toBe("aborted");
    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[1]).toMatchObject({ abortReason: "user_cancelled" });
  });
});
