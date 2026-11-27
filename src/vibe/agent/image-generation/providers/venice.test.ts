import { afterEach, beforeEach, expect, it } from "bun:test";
import { createEndpointLogger } from "next-vibe/logger/server";

import { agentEnv } from "../../env";
import { generateWithVenice } from "./venice";

let originalKey: typeof agentEnv.VENICE_AI_API_KEY;
beforeEach(() => {
  originalKey = agentEnv.VENICE_AI_API_KEY;
  agentEnv.VENICE_AI_API_KEY = "local-provider-fixture";
});
afterEach(() => {
  agentEnv.VENICE_AI_API_KEY = originalKey;
});

it("sends an explicitly requested edit ratio and leaves the source ratio automatic otherwise", async () => {
  for (const aspectRatio of ["9:16", undefined]) {
    let sent = false;
    const handler = async (
      _input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const body: { aspect_ratio?: string } = JSON.parse(String(init?.body));
      expect(body.aspect_ratio).toBe(aspectRatio);
      sent = true;
      return new Response(new Uint8Array([1]), {
        headers: { "content-type": "image/webp" },
      });
    };
    const result = await generateWithVenice({
      providerModel: "firered-image-edit",
      prompt: "fixture",
      size: "1024x1024",
      inputMediaUrl: "data:image/png;base64,AAAA",
      aspectRatio,
      fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
      locale: "en-US",
      logger: createEndpointLogger(false, "en-US"),
    });
    expect(sent).toBe(true);
    expect(result.success).toBe(true);
  }
});

it("retries a busy model once before reporting an outage (prod 11-25 chroma 503)", async () => {
  let calls = 0;
  const handler = async (): Promise<Response> => {
    calls += 1;
    if (calls === 1) {
      return Response.json(
        { error: "The model is at capacity. Please try again later." },
        { status: 503, headers: { "retry-after": "0.01" } },
      );
    }
    return Response.json({ data: [{ b64_json: "AAAA" }] });
  };
  const result = await generateWithVenice({
    providerModel: "chroma",
    prompt: "fixture",
    size: "1024x1024",
    fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
    locale: "en-US",
    logger: createEndpointLogger(false, "en-US"),
  });
  expect(calls).toBe(2);
  expect(result.success).toBe(true);
});

it("names an unloadable reference link instead of a provider error", async () => {
  const handler = async (): Promise<Response> =>
    new Response("missing", { status: 404 });
  const result = await generateWithVenice({
    providerModel: "firered-image-edit",
    prompt: "fixture",
    size: "1024x1024",
    inputMediaUrl: "https://93.184.215.14/missing.png",
    fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
    locale: "en-US",
    logger: createEndpointLogger(false, "en-US"),
  });
  expect(result.success).toBe(false);
  expect(result.success ? "" : result.message).toContain("HTTP 404");
  expect(result.success ? null : result.errorType?.errorKey).toBe(
    "errorTypes.not_found",
  );
});
