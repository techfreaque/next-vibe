import { describe, expect, it } from "bun:test";

import {
  FetchUrlContentRepository,
  shouldRetryInRequestMode,
} from "./repository";

/** A fresh Response per call: the fallback mode reads the body again. */
function proxyResponse(makeResponse: () => Response): typeof fetch {
  return Object.assign(async () => makeResponse(), {
    preconnect: fetch.preconnect,
  });
}

describe("Scrappey proxy failures", () => {
  it("retains the proxy HTTP status and reported target status", async () => {
    const service = FetchUrlContentRepository.getFetchUrlService();
    const result = await service.fetchRawHtml(
      "https://example.test",
      proxyResponse(() =>
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

  it("recovers a missing target response once in plain-request mode", async () => {
    const bodies: string[] = [];
    const signals: Array<AbortSignal | null | undefined> = [];
    const fetchImpl = Object.assign(
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        bodies.push(typeof init?.body === "string" ? init.body : "");
        signals.push(init?.signal);
        return bodies.length === 1
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
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).not.toContain("requestType");
    expect(bodies[1]).toContain('"requestType":"request"');
    // Each mode runs under its own deadline.
    expect(signals[1]).not.toBe(signals[0]);
    expect(result.scraperAttempts?.map((a) => [a.mode, a.ok])).toEqual([
      ["browser", false],
      ["request", true],
    ]);
  });

  it("falls back to plain-request mode when the browser run sends no headers", async () => {
    const bodies: string[] = [];
    const fetchImpl = Object.assign(
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        bodies.push(typeof init?.body === "string" ? init.body : "");
        if (bodies.length === 1) {
          throw new DOMException("The operation timed out.", "TimeoutError");
        }
        return Response.json({
          solution: {
            statusCode: 200,
            currentUrl: "https://example.test/repo",
            response: "<p>fixture repo</p>",
          },
          timeElapsed: 900,
        });
      },
      { preconnect: fetch.preconnect },
    );
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        "https://example.test/repo",
        fetchImpl,
      );
    expect(result.ok).toBe(true);
    expect(result.scraperAttempts?.[0]).toMatchObject({
      mode: "browser",
      ok: false,
      failureStage: "proxy-headers",
    });
    expect(bodies[1]).toContain('"requestType":"request"');
  });

  it("reports a timeout on both modes as one timeout failure with both phases", async () => {
    const fetchImpl = Object.assign(
      async () => {
        throw new DOMException("The operation timed out.", "TimeoutError");
      },
      { preconnect: fetch.preconnect },
    );
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        "https://example.test/slow",
        fetchImpl,
      );
    expect(result).toMatchObject({
      ok: false,
      isTimeout: true,
      failureStage: "proxy-headers",
    });
    expect(result.scraperAttempts?.map((a) => a.mode)).toEqual([
      "browser",
      "request",
    ]);
  });

  it("does not re-send a target refusal or our own key/quota failure", () => {
    expect(shouldRetryInRequestMode({ upstreamStatus: 500, targetStatusCode: 404 })).toBe(false);
    expect(shouldRetryInRequestMode({ upstreamStatus: 500, targetStatusCode: 429 })).toBe(false);
    expect(shouldRetryInRequestMode({ upstreamStatus: 401 })).toBe(false);
    expect(shouldRetryInRequestMode({ upstreamStatus: 402 })).toBe(false);
    expect(shouldRetryInRequestMode({ upstreamStatus: 429 })).toBe(false);
    expect(shouldRetryInRequestMode({ upstreamStatus: 400, isCallerError: true })).toBe(false);
    expect(shouldRetryInRequestMode({})).toBe(true);
    expect(shouldRetryInRequestMode({ upstreamStatus: 500, targetStatusCode: 407 })).toBe(true);
    expect(shouldRetryInRequestMode({ upstreamStatus: 500, targetStatusCode: 307 })).toBe(true);
    expect(shouldRetryInRequestMode({ upstreamStatus: 502 })).toBe(true);
    expect(shouldRetryInRequestMode({ upstreamStatus: 200 })).toBe(true);
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
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        "https://example.test",
        proxyResponse(
          () =>
            new Response(
              new ReadableStream({
                start(controller): void {
                  controller.error(new Error("fixture body stream reset"));
                },
              }),
              { status: 502 },
            ),
        ),
      );

    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 502,
      proxyBodyRead: "stream-error",
      failureStage: "proxy-status",
    });
  });
});
