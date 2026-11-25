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
