import { afterEach, beforeEach, expect, it, mock, spyOn } from "bun:test";
import { createEndpointLogger } from "next-vibe/logger/server";
import sharp from "sharp";

import { agentEnv } from "../../env";
import { generateVideoWithOpenRouter } from "./openrouter";

let originalKey: typeof agentEnv.OPENROUTER_API_KEY;
beforeEach(() => {
  originalKey = agentEnv.OPENROUTER_API_KEY;
  agentEnv.OPENROUTER_API_KEY = "local-provider-fixture";
});
afterEach(() => {
  agentEnv.OPENROUTER_API_KEY = originalKey;
});

it("submits WebP bookends as PNG, preserves audio references and returns a structured rejection's message", async () => {
  const webp = await sharp({
    create: { width: 4, height: 3, channels: 4, background: "#1358" },
  })
    .webp()
    .toBuffer();
  const detail = "Unsupported reference video duration";
  const handler = mock(
    async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body: {
        frame_images: { image_url: { url: string } }[];
        input_references: { type: string }[];
      } = JSON.parse(String(init?.body));
      const frame = body.frame_images[0]?.image_url.url ?? "";
      expect(frame).toStartWith("data:image/png;base64,");
      expect(
        await sharp(
          Buffer.from(frame.split(",")[1] ?? "", "base64"),
        ).metadata(),
      ).toMatchObject({
        format: "png",
        width: 4,
        height: 3,
        hasAlpha: true,
      });
      expect(body.input_references[0]?.type).toBe("audio_url");
      return Response.json(
        { error: { code: 400, message: detail } },
        { status: 400 },
      );
    },
  );
  const result = await generateVideoWithOpenRouter({
    providerModel: "fixture",
    prompt: "fixture",
    frameReferences: [
      {
        role: "first",
        url: `data:image/webp;base64,${webp.toString("base64")}`,
      },
      { role: "reference", url: "data:audio/mpeg;base64,AAAA" },
    ],
    fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
    logger: createEndpointLogger(false, "en-US"),
    locale: "en-US",
  });
  expect(handler).toHaveBeenCalledTimes(1);
  expect(result.success).toBe(false);
  if (!result.success) expect(result.message).toContain(detail);
});

it("stops retrying a BYOK-only model on the same unconfigured account", async () => {
  const handler = mock(async () =>
    Response.json(
      {
        error: {
          code: 404,
          message: "No endpoints found for minimax/hailuo-3.",
          metadata: {
            routing_funnel: [
              { step: "Initial Endpoints", endpoint_count: 1 },
              {
                step: "Add BYOK Endpoints",
                endpoint_count: 0,
                reason: "The matches are BYOK-only and you have no MiniMax key",
              },
            ],
          },
        },
      },
      { status: 404 },
    ),
  );
  const params = {
    providerModel: "minimax/hailuo-3",
    prompt: "fixture",
    fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
    logger: createEndpointLogger(false, "en-US"),
    locale: "en-US",
  } satisfies Parameters<typeof generateVideoWithOpenRouter>[0];
  const result = await generateVideoWithOpenRouter(params);
  expect(result.success).toBe(false);
  if (!result.success) expect(result.message).toContain("minimax/hailuo-3");
  await generateVideoWithOpenRouter(params);
  expect(handler).toHaveBeenCalledTimes(1);
  const clock = spyOn(Date, "now").mockReturnValue(Date.now() + 300_001);
  try {
    await generateVideoWithOpenRouter(params);
    expect(handler).toHaveBeenCalledTimes(2);
  } finally {
    clock.mockRestore();
  }
  agentEnv.OPENROUTER_API_KEY = "another-local-provider-fixture";
  await generateVideoWithOpenRouter(params);
  expect(handler).toHaveBeenCalledTimes(3);
});
