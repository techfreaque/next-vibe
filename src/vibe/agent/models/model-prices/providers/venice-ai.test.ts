import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { VenicePriceFetcher } from "./venice-ai";

describe("Venice image prices", () => {
  it("collects generation and inpaint prices from the model catalog", async () => {
    const fetchMock = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ data: [] }))
      .mockResolvedValueOnce(
        Response.json({
          data: [
            {
              id: "chroma",
              type: "image",
              model_spec: { pricing: { generation: { usd: 0.01 } } },
            },
            {
              id: "qwen-edit-uncensored",
              type: "inpaint",
              model_spec: { pricing: { inpaint: { usd: 0.04 } } },
            },
            {
              id: "firered-image-edit",
              type: "inpaint",
              model_spec: { pricing: { inpaint: { usd: 0.04 } } },
            },
          ],
        }),
      )
      .mockResolvedValue(new Response(null, { status: 404 }));
    try {
      const result = await new VenicePriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "https://api.venice.ai/api/v1/models?type=all",
        { headers: { Accept: "application/json" } },
      );
      const prices = Object.fromEntries(
        result.updates
          .filter((update) => update.field === "creditCostPerImage")
          .map((update) => [update.providerModel, update.value]),
      );
      expect(prices).toEqual({
        chroma: 1,
        "qwen-edit-uncensored": 4,
        "firered-image-edit": 4,
      });
    } finally {
      fetchMock.mockRestore();
    }
  });
});
