/**
 * User cancel must be a clean abort, never an unhandled rejection.
 *
 * Regression for prod: cancelling an OpenRouter stream (kimi-k3) surfaced as
 * `unhandledRejection: AI_APICallError: Failed to process successful response`
 * with `cause: StreamAbortError`. Two causes, both covered here:
 *   1. StreamAbortError was not named "AbortError", so the AI SDK / provider
 *      `isAbortError` checks wrapped it as an API error instead of an abort.
 *   2. @openrouter/ai-sdk-provider's withStreamErrorHandling `cancel()` called
 *      `reader.cancel()` without handling the rejection (patched in
 *      patches/@openrouter%2Fai-sdk-provider@3.1.0.patch).
 */

import { isAbortError } from "@ai-sdk/provider-utils";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AbortReason, isStreamAbort, StreamAbortError } from "./constants";

const encoder = new TextEncoder();

function sseChunk(content: string): Uint8Array {
  return encoder.encode(
    `data: ${JSON.stringify({
      id: "gen-test",
      model: "moonshotai/kimi-k3",
      choices: [{ index: 0, delta: { content } }],
    })}\n\n`,
  );
}

/** Fake OpenRouter: streams tokens forever; on abort the body errors with the
 *  signal's reason - exactly what a real fetch body does. */
async function fakeOpenRouterFetch(
  _input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const signal = init?.signal;
  let interval: ReturnType<typeof setInterval> | undefined;
  const body = new ReadableStream<Uint8Array>({
    start(controller): void {
      let i = 0;
      interval = setInterval(() => {
        controller.enqueue(sseChunk(`tok${i++} `));
      }, 5);
      signal?.addEventListener(
        "abort",
        () => {
          clearInterval(interval);
          controller.error(signal.reason);
        },
        { once: true },
      );
    },
    cancel(): void {
      clearInterval(interval);
    },
  });
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });
}

describe("StreamAbortError", () => {
  it("is recognised as an abort by the AI SDK", () => {
    const err = new StreamAbortError(AbortReason.USER_CANCELLED);
    expect(isAbortError(err)).toBe(true);
    expect(isStreamAbort(err)).toBe(true);
    expect(err.reason).toBe(AbortReason.USER_CANCELLED);
  });
});

describe("user cancel of an OpenRouter stream", () => {
  const unhandled: Error[] = [];
  const onUnhandled = (reason: Error): void => {
    unhandled.push(reason);
  };

  beforeEach(() => {
    unhandled.length = 0;
    process.on("unhandledRejection", onUnhandled);
  });
  afterEach(() => {
    process.off("unhandledRejection", onUnhandled);
  });

  it("ends as an abort with no unhandled rejection", async () => {
    const provider = createOpenRouter({
      apiKey: "test",
      fetch: Object.assign(fakeOpenRouterFetch, {
        preconnect: (): void => undefined,
      }),
    });
    const controller = new AbortController();
    const result = streamText({
      model: provider.chat("moonshotai/kimi-k3"),
      prompt: "hi",
      abortSignal: controller.signal,
    });

    const partTypes: string[] = [];
    let thrown: Error | null = null;
    try {
      for await (const part of result.fullStream) {
        partTypes.push(part.type);
        if (part.type === "text-delta" && partTypes.length > 4) {
          controller.abort(new StreamAbortError(AbortReason.USER_CANCELLED));
        }
      }
    } catch (error) {
      thrown = error instanceof Error ? error : null;
    }

    // Give any stray rejection a chance to surface.
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    // The SDK takes the clean abort path (an `abort` part), not the error path.
    expect(thrown).toBeNull();
    expect(partTypes).toContain("abort");
    expect(partTypes).not.toContain("error");
    expect(unhandled).toEqual([]);
  });
});
