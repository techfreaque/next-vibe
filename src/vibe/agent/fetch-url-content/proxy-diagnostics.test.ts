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

  it("recovers a missing target response once within the original deadline", async () => {
    const signals: Array<AbortSignal | null | undefined> = [];
    const fetchImpl = Object.assign(
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        signals.push(init?.signal);
        return signals.length === 1
          ? Response.json(
              {
                solution: { verified: false, ipInfo: { city: "fixture-city" } },
              },
              { status: 500 },
            )
          : Response.json({
              solution: {
                statusCode: 200,
                currentUrl: "https://example.test",
                response: "fixture page",
              },
              timeElapsed: 11,
            });
      },
      { preconnect: fetch.preconnect },
    );
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        "https://example.test",
        fetchImpl,
      );
    expect(result).toMatchObject({ ok: true, data: { html: "fixture page" } });
    expect(signals).toHaveLength(2);
    expect(signals[1]).toBe(signals[0]);
  });

  it("reports a repeated unverified scrape without copying upstream location data", async () => {
    let attempts = 0;
    const fetchImpl = Object.assign(
      async () => {
        attempts++;
        return Response.json(
          { solution: { verified: false, ipInfo: { city: "fixture-city" } } },
          { status: 500 },
        );
      },
      { preconnect: fetch.preconnect },
    );
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        "https://example.test",
        fetchImpl,
      );
    expect(attempts).toBe(2);
    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 500,
      solutionVerified: false,
    });
    expect(JSON.stringify(result)).toContain("No target HTTP status reported");
    expect(JSON.stringify(result)).not.toContain("fixture-city");
  });

  it("records a failed body read after receiving the proxy status", async () => {
    const body = new ReadableStream({
      start(controller): void {
        controller.error(new Error("fixture body stream reset"));
      },
    });
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
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
