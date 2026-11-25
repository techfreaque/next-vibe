import { describe, expect, it } from "bun:test";

import { FetchUrlContentRepository } from "./repository";

function proxyResponse(response: Response): typeof fetch {
  return Object.assign(async () => response, { preconnect: fetch.preconnect });
}

describe("Scrappey proxy failures", () => {
  it("retains the proxy HTTP status and reported target status", async () => {
    const service = FetchUrlContentRepository.getFetchUrlService();
    const result = await service.fetchRawHtml(
      "https://example.test",
      proxyResponse(
        Response.json(
          { status: "success", solution: { statusCode: 407, verified: false } },
          { status: 500 },
        ),
      ),
    );

    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 500,
      targetStatusCode: 407,
      solutionVerified: false,
      proxyBodyRead: "complete",
      failureStage: "proxy-status",
    });
  });

  it("records a failed body read after receiving the proxy status", async () => {
    const body = new ReadableStream({
      start(controller): void {
        controller.error(new Error("fixture body stream reset"));
      },
    });
    const result = await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
      "https://example.test",
      proxyResponse(new Response(body, { status: 502 })),
    );

    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 502,
      proxyBodyRead: "stream-error",
      failureStage: "proxy-status",
    });
  });
});
