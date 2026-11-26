import { describe, expect, test } from "bun:test";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  classifyImageProviderError,
  ImageProviderFailureKind,
} from "../../image-generation/provider-error";
import { generateVideoWithVenice } from "./venice";

interface RecordedCall {
  url: string;
  method: string;
  body: Record<string, string | number | boolean> | undefined;
}

/** Scripted fetch: each call takes the next response, every call is recorded. */
function scriptedFetch(responses: Response[]): {
  fetchImpl: typeof globalThis.fetch;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  const queue = [...responses];
  const handler = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const body: Record<string, string | number | boolean> | undefined =
      typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({
      url: String(input),
      method: init?.method ?? "GET",
      body,
    });
    return queue.shift() ?? new Response("{}", { status: 500 });
  };
  const fetchImpl = Object.assign(handler, { preconnect: fetch.preconnect });
  return { fetchImpl, calls };
}

const json = (body: object, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      // Collapse pollDelay to 10ms (same marker a fixture replay carries).
      "x-vibe-fixture-replay": "true",
    },
  });

const mp4 = (): Response =>
  new Response(new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112]), {
    status: 200,
    headers: { "content-type": "video/mp4", "x-vibe-fixture-replay": "true" },
  });

const logger = createEndpointLogger(false, "en-GLOBAL");

const baseParams: {
  providerModel: string;
  prompt: string;
  durationSeconds: number;
  locale: CountryLanguage;
} = {
  providerModel: "seedance-2-5-flash-text-to-video-basic",
  prompt: "a cat on a skateboard",
  durationSeconds: 4,
  locale: "en-GLOBAL",
};

describe("generateVideoWithVenice", () => {
  test("text-to-video: queue, poll, inline mp4 bytes", async () => {
    const { fetchImpl, calls } = scriptedFetch([
      json({ model: baseParams.providerModel, queue_id: "q1" }),
      json({
        status: "PROCESSING",
        average_execution_time: 1,
        execution_duration: 1,
      }),
      mp4(),
    ]);
    const result = await generateVideoWithVenice({
      ...baseParams,
      aspectRatio: "16:9",
      resolution: "480p",
      generateAudio: true,
      logger,
      fetchImpl,
    });
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.mimeType).toBe("video/mp4");
    expect(result.data.videoBytes.byteLength).toBe(8);
    expect(result.data.providerJobId).toBe("q1");
    expect(calls[0]?.url).toBe("https://api.venice.ai/api/v1/video/queue");
    expect(calls[0]?.body).toEqual({
      model: "seedance-2-5-flash-text-to-video-basic",
      prompt: "a cat on a skateboard",
      duration: "4s",
      resolution: "480p",
      aspect_ratio: "16:9",
      audio: true,
    });
    expect(calls[1]?.body?.queue_id).toBe("q1");
    expect(calls[1]?.body?.delete_media_on_completion).toBe(true);
  });

  test("a seed image switches to the image-to-video id, no aspect ratio", async () => {
    const { fetchImpl, calls } = scriptedFetch([
      json({ model: "seedance-2-5-flash-image-to-video-basic", queue_id: "q2" }),
      mp4(),
    ]);
    const result = await generateVideoWithVenice({
      ...baseParams,
      aspectRatio: "16:9",
      inputImageUrl: "data:image/png;base64,AAAA",
      logger,
      fetchImpl,
    });
    expect(result.success).toBe(true);
    expect(calls[0]?.body?.model).toBe(
      "seedance-2-5-flash-image-to-video-basic",
    );
    expect(calls[0]?.body?.image_url).toBe("data:image/png;base64,AAAA");
    expect(calls[0]?.body?.aspect_ratio).toBeUndefined();
  });

  test("private download_url: fetched without auth, then revoked", async () => {
    const { fetchImpl, calls } = scriptedFetch([
      json({
        model: baseParams.providerModel,
        queue_id: "q3",
        download_url: "https://dl.venice.example/x.mp4",
      }),
      json({ status: "COMPLETED" }),
      mp4(),
      new Response(null, { status: 204 }),
    ]);
    const result = await generateVideoWithVenice({
      ...baseParams,
      logger,
      fetchImpl,
    });
    expect(result.success).toBe(true);
    expect(calls[2]).toMatchObject({
      url: "https://dl.venice.example/x.mp4",
      method: "GET",
    });
    expect(calls[3]).toMatchObject({
      url: "https://dl.venice.example/x.mp4",
      method: "DELETE",
    });
  });

  test("422 reads as a content refusal, 5xx as an outage", async () => {
    const refused = await generateVideoWithVenice({
      ...baseParams,
      logger,
      fetchImpl: scriptedFetch([
        json({ error: "Your prompt was rejected" }, 422),
      ]).fetchImpl,
    });
    expect(refused.success).toBe(false);
    if (!refused.success) {
      expect(classifyImageProviderError(refused.message)).toBe(
        ImageProviderFailureKind.CONTENT_POLICY,
      );
    }

    const down = await generateVideoWithVenice({
      ...baseParams,
      logger,
      fetchImpl: scriptedFetch([
        new Response("<html>Bad Gateway</html>", { status: 502 }),
      ]).fetchImpl,
    });
    expect(down.success).toBe(false);
    if (!down.success) {
      expect(classifyImageProviderError(down.message)).toBe(
        ImageProviderFailureKind.OUTAGE,
      );
    }
  });

  test("refusal during polling (retrieve 422) is a refusal too", async () => {
    const result = await generateVideoWithVenice({
      ...baseParams,
      logger,
      fetchImpl: scriptedFetch([
        json({ model: baseParams.providerModel, queue_id: "q4" }),
        json({ error: "Content policy violation" }, 422),
      ]).fetchImpl,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(classifyImageProviderError(result.message)).toBe(
        ImageProviderFailureKind.CONTENT_POLICY,
      );
    }
  });
});
