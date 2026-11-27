import { describe, expect, test } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { findUnusableReference, probeReferenceUrl } from "./reference-probe";

function fetchReturning(response: () => Response): typeof globalThis.fetch {
  return Object.assign(
    async (): Promise<Response> => response(),
    { preconnect: (): void => undefined },
  );
}

// Public IP literals skip DNS, so the SSRF guard needs no network.
const PAGE = "https://93.184.215.14/art/some-page-587951808";

describe("probeReferenceUrl", () => {
  test("a web page link is not media (prod 11-27 DeviantArt page to Seedream)", async () => {
    const result = await probeReferenceUrl({
      url: PAGE,
      fetchImpl: fetchReturning(
        () =>
          new Response("<html></html>", {
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
      ),
    });
    expect(result).toEqual({
      usable: false,
      reason: "notMedia",
      host: "93.184.215.14",
      status: 200,
      contentType: "text/html",
    });
  });

  test("a 404 link is unreachable (prod 11-27 example.com frame to Veo)", async () => {
    const result = await probeReferenceUrl({
      url: PAGE,
      fetchImpl: fetchReturning(() => new Response("nope", { status: 404 })),
    });
    expect(result.usable).toBe(false);
    expect(!result.usable && result.reason).toBe("unreachable");
    expect(!result.usable && result.status).toBe(404);
  });

  test("an image link and inline data are usable", async () => {
    const image = await probeReferenceUrl({
      url: PAGE,
      fetchImpl: fetchReturning(
        () =>
          new Response(new Uint8Array([1]), {
            headers: { "content-type": "image/png" },
          }),
      ),
    });
    expect(image).toEqual({ usable: true });
    const inline = await probeReferenceUrl({
      url: "data:image/png;base64,AAAA",
      fetchImpl: fetchReturning(() => {
        throw new Error("must not fetch inline data");
      }),
    });
    expect(inline).toEqual({ usable: true });
  });

  test("findUnusableReference returns the first broken link", async () => {
    const result = await findUnusableReference({
      urls: ["data:image/png;base64,AAAA", PAGE],
      fetchImpl: fetchReturning(() => new Response("", { status: 404 })),
      logger: createEndpointLogger(false, defaultLocale),
      logTag: "VideoGen",
      model: "veo-3-1",
      provider: "openrouter",
      providerError: "Received 404 status code when fetching image from URL",
    });
    expect(result?.reason).toBe("unreachable");
  });
});
