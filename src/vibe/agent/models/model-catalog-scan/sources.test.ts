import { expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { fetchUpstreamListings } from "./sources";

it("validates catalog fields without traversing unconsumed provider details", async () => {
  const transport = spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(Response.json({ data: [] }))
    .mockResolvedValueOnce(Response.json({ data: [{ id: 123 }] }))
    .mockResolvedValueOnce(Response.json({ data: [] }))
    .mockResolvedValueOnce(new Response("{"))
    .mockResolvedValueOnce(
      new Response(
        '{"data":[{"id":"example/model","pricing":{"unit":"per_million_tokens","prompt":0.1,"completion":0.5},"provider_details":{"unused_numeric_limit":1e999}}]}',
      ),
    );

  try {
    const listings = await fetchUpstreamListings(
      createEndpointLogger(false, defaultLocale),
    );
    expect(listings).toMatchObject([
      { source: "openrouter", ok: true, models: [] },
      {
        source: "openrouter-images",
        ok: false,
        error: expect.stringContaining("id"),
        models: [],
      },
      { source: "openrouter-videos", ok: true, models: [] },
      {
        source: "venice",
        ok: false,
        error: expect.any(String),
        models: [],
      },
      {
        source: "nano-gpt",
        ok: true,
        models: [
          {
            id: "example/model",
            kind: "chat",
            inputUsdPer1M: 0.1,
            outputUsdPer1M: 0.5,
          },
        ],
      },
    ]);
  } finally {
    transport.mockRestore();
  }
});
