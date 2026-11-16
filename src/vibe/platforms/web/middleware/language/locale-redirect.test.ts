/**
 * Locale redirect mapping: a locale-shaped first segment (/en/, /fr-FR/,
 * /en-us/) is REPLACED by the best supported locale, any other path is
 * prefixed. Regression: /fr-FR/user/referral used to redirect to
 * /en-GLOBAL/fr-FR/user/referral (404).
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { middleware } from "../index";
import { buildLocaleRedirectPath, detectLocale } from "./index";

const supportedLocales: CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "en-GLOBAL",
  "en-US",
];
const options = {
  supportedLocales,
  defaultLocale: "en-GLOBAL" as const,
  allowMixedLocales: true,
};

function request(
  path: string,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
}

function target(path: string, headers: Record<string, string> = {}): string {
  const redirect = detectLocale(request(path, headers), options);
  return redirect ? buildLocaleRedirectPath(path, redirect) : "(none)";
}

describe("locale redirect mapping", () => {
  it("leaves valid locales alone", () => {
    expect(target("/en-US/user/referral")).toBe("(none)");
    expect(target("/en-GLOBAL")).toBe("(none)");
    expect(target("/de-PL/story")).toBe("(none)");
    expect(target("/api/en-GLOBAL/credits")).toBe("(none)");
  });

  it("replaces a language-only segment", () => {
    expect(target("/en/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/de/user/referral")).toBe("/de-GLOBAL/user/referral");
    expect(target("/PL")).toBe("/pl-GLOBAL");
    expect(target("/api/en/credits")).toBe("/api/en-GLOBAL/credits");
  });

  it("uses the cookie / Accept-Language locale of the same language", () => {
    expect(target("/en/user", { cookie: "locale=en-US" })).toBe("/en-US/user");
    expect(target("/en/user", { "accept-language": "en-US,en;q=0.9" })).toBe(
      "/en-US/user",
    );
    expect(target("/de/user", { "accept-language": "de-DE" })).toBe(
      "/de-DE/user",
    );
    // Cookie of another language does not override the requested language
    expect(target("/de/user", { cookie: "locale=en-US" })).toBe(
      "/de-GLOBAL/user",
    );
  });

  it("replaces an unsupported locale with the same language when supported", () => {
    expect(target("/en-GB/user")).toBe("/en-GLOBAL/user");
    expect(target("/de_at/user")).toBe("/de-GLOBAL/user");
  });

  it("replaces an unsupported language with the negotiated locale", () => {
    expect(target("/fr-FR/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/es-ES/")).toBe("/en-GLOBAL");
    expect(target("/es-ES/x/")).toBe("/en-GLOBAL/x/");
    expect(target("/fr-FR/user", { cookie: "locale=de-DE" })).toBe(
      "/de-DE/user",
    );
    expect(target("/fr-FR/user", { "accept-language": "pl-PL" })).toBe(
      "/pl-PL/user",
    );
    expect(target("/api/fr-FR/credits")).toBe("/api/en-GLOBAL/credits");
  });

  it("fixes wrong casing by replacing, not prefixing", () => {
    expect(target("/en-us/user")).toBe("/en-US/user");
    expect(target("/EN-global")).toBe("/en-GLOBAL");
  });

  it("prefixes paths without a locale segment", () => {
    expect(target("/")).toBe("/en-GLOBAL");
    expect(target("/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/track/abc")).toBe("/en-GLOBAL/track/abc");
    // Unsupported bare two-letter segments are not treated as locales
    expect(target("/ai/foo")).toBe("/en-GLOBAL/ai/foo");
    expect(target("/api/credits")).toBe("/api/en-GLOBAL/credits");
    expect(target("/api")).toBe("/api/en-GLOBAL");
  });
});

describe("middleware locale redirect", () => {
  it("redirects once and keeps the query string", async () => {
    const res = await middleware(
      request("/fr-FR/user/referral?ref=abc&utm_source=x"),
      options,
    );
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/en-GLOBAL/user/referral?ref=abc&utm_source=x",
    );
  });

  it("never locale-redirects static paths", async () => {
    for (const path of [
      "/llms.txt",
      "/llms-full.txt",
      "/robots.txt",
      "/sitemap.xml",
      "/_next/static/chunk.js",
    ]) {
      const res = await middleware(request(path), options);
      expect(res.headers.get("location")).toBeNull();
    }
  });
});
