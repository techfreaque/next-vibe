import { describe, expect, it } from "bun:test";

import { sanitizeLeadUrlMetadata, sanitizeTelemetryUrl } from "./telemetry-url";

describe("sanitizeTelemetryUrl", () => {
  it("stores only the path and allow-listed attribution values", () => {
    const url =
      "https://user:password@example.test/en-US/story?token=private&utm_source=newsletter&utm_campaign=Fr%C3%BChjahr+2026&utm_id=0c0a6b88-2f65-40bb-ba4a-e1c3174bd306&ref=ALLY&locale=en-US&email=user@example.test#section";
    expect(sanitizeTelemetryUrl(url, true)).toBe(
      "/en-US/story?utm_source=newsletter&utm_campaign=Fr%C3%BChjahr+2026&utm_id=0c0a6b88-2f65-40bb-ba4a-e1c3174bd306&ref=ALLY&locale=en-US",
    );
    expect(sanitizeTelemetryUrl(url)).toBe("/en-US/story");
  });

  it("rejects email addresses, embedded URLs, JWTs and duplicate attribution values", () => {
    expect(
      sanitizeTelemetryUrl(
        "/story?utm_medium=mail&utm_medium=duplicate&utm_source=https%3A%2F%2Fexample.test&utm_term=person%40example.test&utm_content=eyJabc.payload.signature&ref=ALLY",
        true,
      ),
    ).toBe("/story?utm_medium=mail&ref=ALLY");
  });

  const privateRoutes = [
    [
      "/en-US/user/reset-password/eyJabc.payload.signature?utm_source=x",
      "/en-US/user/reset-password/:token",
    ],
    ["/user/reset-password/confirm/12345", "/user/reset-password/confirm/:token"],
    [
      "/de-DE/user/verify-email/a%2Bb%40example.test?locale=de-DE",
      "/de-DE/user/verify-email/:token",
    ],
    ["/user/%76erify-email%2Fshort", "/user/verify-email/:token"],
    ["/en-US/user/signup?confirm=1&utm_source=x#signup-magic-token", "/en-US/user/signup"],
    ["/en-US/user/magic-link/short", "/en-US/user/magic-link/:token"],
    [
      "/api/en-US/user/public/reset-password/validate?token=sensitive&utm_source=x",
      "/api/en-US/user/public/reset-password/validate",
    ],
    ["/api/en-US/resource/token/short?ref=X", "/api/en-US/resource/token/:token"],
    ["/api/en-US/resource/item;token=short", "/api/en-US/resource/:token"],
    [
      "/api/en-US/newsletter/unsubscribe/oneclick/short",
      "/api/en-US/newsletter/unsubscribe/oneclick/:token",
    ],
    [
      "/en-US/story/newsletter/unsubscribe/alice%40example.test",
      "/en-US/story/newsletter/unsubscribe/:token",
    ],
    ["/en-US/story/newsletter/confirm/opaque", "/en-US/story/newsletter/confirm/:token"],
    ["/en-US/shared/short", "/en-US/shared/:token"],
  ];
  for (const [input, expected] of privateRoutes) {
    it(`redacts ${expected ?? "the sensitive route"}`, () => {
      const sanitized = sanitizeTelemetryUrl(input, true);
      expect(sanitized).toBe(expected);
      expect(sanitizeTelemetryUrl(sanitized, true)).toBe(sanitized);
    });
  }

  it("drops invalid inputs and canonicalizes protocol-relative URLs", () => {
    expect(sanitizeTelemetryUrl("http://[invalid", true)).toBeNull();
    expect(sanitizeTelemetryUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeTelemetryUrl("opaque-private-value")).toBeNull();
    expect(sanitizeTelemetryUrl("//example.test/en-US/story?utm_source=email", true)).toBe(
      "/en-US/story?utm_source=email",
    );
  });

  it("scrubs URL fields, including legacy and custom metadata", () => {
    expect(
      sanitizeLeadUrlMetadata({
        url: "https://example.test/user/signup?confirm=1#short",
        referer: "https://example.test/user/verify-email/short",
        destinationUrl: "https://example.test/story?utm_medium=email&other=private",
        custom_landingUrl: "/user/reset-password/private",
        userAgent: "Browser",
        custom_count: 3,
      }),
    ).toEqual({
      url: "/user/signup",
      referer: "/user/verify-email/:token",
      destinationUrl: "/story?utm_medium=email",
      custom_landingUrl: "/user/reset-password/:token",
      userAgent: "Browser",
      custom_count: 3,
    });
  });
});
