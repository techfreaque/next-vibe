/**
 * Locale redirect mapping: a locale-shaped first segment (/en/, /es-ES/,
 * /en-us/) is REPLACED by the best supported locale, any other path is
 * prefixed. Regression: /fr-FR/user/referral used to redirect to
 * /en-GLOBAL/fr-FR/user/referral (404), back when French was unsupported.
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import { languageConfig } from "../../../../core/i18n";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { middleware } from "../index";
import { buildLocaleRedirectPath, detectLocale } from "./index";

const supportedLocales: CountryLanguage[] = Object.values(languageConfig.countryInfo).map(({ language, code }): CountryLanguage => `${language}-${code}`);
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
    expect(target("/fr-FR/user/referral")).toBe("(none)");
    expect(target("/fr-GLOBAL/story")).toBe("(none)");
    expect(target("/api/fr-FR/credits")).toBe("(none)");
    expect(target("/api/en-GLOBAL/credits")).toBe("(none)");
  });

  it("serves each configured regional language and negotiates language before location", () => {
    for (const { code, languages } of Object.values(languageConfig.countryInfo)) {
      for (const language of languages) {
        expect(target(`/${language}-${code}/story`)).toBe("(none)");
      }
    }
    expect(target("/story", { "accept-language": "de-AT" })).toBe("/de-AT/story");
    expect(target("/story", { "accept-language": "es", "cf-ipcountry": "US" })).toBe("/es-US/story");
    expect(target("/story", { "accept-language": "fr-CA;q=0.2,it-CH;q=0.9" })).toBe("/it-CH/story");
    expect(target("/story", { "cf-ipcountry": "MX" })).toBe("/es-MX/story");
  });

  it("replaces a language-only segment", () => {
    expect(target("/en/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/de/user/referral")).toBe("/de-GLOBAL/user/referral");
    expect(target("/PL")).toBe("/pl-GLOBAL");
    expect(target("/fr/story")).toBe("/fr-GLOBAL/story");
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
    expect(target("/fr/user", { "accept-language": "fr-FR" })).toBe(
      "/fr-FR/user",
    );
    // Cookie of another language does not override the requested language
    expect(target("/de/user", { cookie: "locale=en-US" })).toBe(
      "/de-GLOBAL/user",
    );
  });

  it("replaces an unsupported locale with the same language when supported", () => {
    expect(target("/en-JP/user")).toBe("/en-GLOBAL/user");
    expect(target("/de_jp/user")).toBe("/de-GLOBAL/user");
  });

  it("replaces an unsupported language with the negotiated locale", () => {
    expect(target("/nl-NL/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/nl-NL/")).toBe("/en-GLOBAL");
    expect(target("/nl-NL/x/")).toBe("/en-GLOBAL/x/");
    expect(target("/ja-JP/user", { cookie: "locale=de-DE" })).toBe(
      "/de-DE/user",
    );
    expect(target("/ja-JP/user", { "accept-language": "pl-PL" })).toBe(
      "/pl-PL/user",
    );
    expect(target("/ja-JP/user", { "accept-language": "fr-FR" })).toBe(
      "/fr-FR/user",
    );
    expect(target("/api/nl-NL/credits")).toBe("/api/en-GLOBAL/credits");
  });

  it("lands French visitors on French, not en-GLOBAL", () => {
    expect(target("/", { "accept-language": "fr-FR,fr;q=0.9,en;q=0.8" })).toBe(
      "/fr-FR",
    );
    expect(target("/story", { "accept-language": "fr" })).toBe(
      "/fr-GLOBAL/story",
    );
    expect(target("/", { "accept-language": "fr-CA,fr;q=0.9" })).toBe(
      "/fr-CA",
    );
    expect(target("/user", { cookie: "locale=fr-FR" })).toBe("/fr-FR/user");
    expect(target("/fr-fr/user")).toBe("/fr-FR/user");
    expect(target("/api/credits", { "accept-language": "fr-FR" })).toBe(
      "/api/fr-FR/credits",
    );
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
      request("/nl-NL/user/referral?ref=abc&utm_source=x"),
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
