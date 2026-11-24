import { expect, it, spyOn } from "bun:test";

import { FetchUrlContentRepository } from "./repository";

it("separates the scraper HTTP failure from its reported target status", async () => {
  const fetch = spyOn(globalThis, "fetch").mockResolvedValue(Response.json({
    status: "success",
    solution: { statusCode: 429, verified: false, response: "fixture body" },
  }, { status: 500 }));
  try {
    const result = await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
      "https://example.test/item",
      globalThis.fetch,
    );
    expect(result).toMatchObject({
      ok: false,
      failureStage: "proxy-status",
      upstreamStatus: 500,
      proxyBodyStatus: "success",
      targetStatusCode: 429,
      solutionVerified: false,
      deadlineFired: false,
    });
  } finally {
    fetch.mockRestore();
  }
});
