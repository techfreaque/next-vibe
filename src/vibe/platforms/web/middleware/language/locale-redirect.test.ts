/**
 * Locale redirect mapping: a locale-shaped first segment (/en/, /es-ES/,
 * /en-us/) is REPLACED by the best supported locale, any other path is
 * prefixed. Regression: /fr-FR/user/referral used to redirect to
 * /en-GLOBAL/fr-FR/user/referral (404), back when French was unsupported.
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";
import { INDEXNOW_KEY_PATH } from "@/seo/indexnow/constants";

import { languageConfig } from "../../../../core/i18n";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { middleware } from "../index";
import { buildLocaleRedirectPath, detectLocale } from "./index";

const supportedLocales: CountryLanguage[] = Object.values(
  languageConfig.countryInfo,
).flatMap(({ languages, code }) =>
  languages.map((language): CountryLanguage => `${language}-${code}`),
);
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
    for (const { code, languages } of Object.values(
      languageConfig.countryInfo,
    )) {
      for (const language of languages) {
        expect(target(`/${language}-${code}/story`)).toBe("(none)");
      }
    }
    expect(target("/story", { "accept-language": "de-AT" })).toBe(
      "/de-AT/story",
    );
    expect(
      target("/story", { "accept-language": "es", "cf-ipcountry": "US" }),
    ).toBe("/es-US/story");
    expect(
      target("/story", { "accept-language": "fr-CA;q=0.2,it-CH;q=0.9" }),
    ).toBe("/it-CH/story");
    expect(target("/story", { "cf-ipcountry": "MX" })).toBe("/es-MX/story");
  });

  it("negotiates Slovak from the URL, browser, cookie, or country", () => {
    expect(target("/sk-SK/story")).toBe("(none)");
    expect(target("/sk-sk/story")).toBe("/sk-SK/story");
    expect(target("/sk/story")).toBe("/sk-SK/story");
    expect(target("/story", { "accept-language": "sk-SK" })).toBe(
      "/sk-SK/story",
    );
    expect(target("/story", { "cf-ipcountry": "SK" })).toBe("/sk-SK/story");
    expect(target("/story", { cookie: "locale=sk-SK" })).toBe("/sk-SK/story");
  });

  it("lands Indian visitors on en-IN, Hindi speakers on hi-IN", () => {
    expect(target("/hi-IN/story")).toBe("(none)");
    expect(target("/en-IN/story")).toBe("(none)");
    expect(target("/hi-GLOBAL/story")).toBe("(none)");
    expect(target("/hi-in/story")).toBe("/hi-IN/story");
    expect(target("/hi/story")).toBe("/hi-IN/story");
    expect(target("/story", { "accept-language": "hi" })).toBe("/hi-IN/story");
    expect(target("/story", { "accept-language": "hi-IN,hi;q=0.9" })).toBe(
      "/hi-IN/story",
    );
    expect(target("/story", { "cf-ipcountry": "IN" })).toBe("/en-IN/story");
    expect(
      target("/story", {
        "accept-language": "en-US,en;q=0.9",
        "cf-ipcountry": "IN",
      }),
    ).toBe("/en-IN/story");
    expect(
      target("/story", {
        "accept-language": "hi-IN,hi;q=0.9,en;q=0.8",
        "cf-ipcountry": "IN",
      }),
    ).toBe("/hi-IN/story");
    expect(
      target("/story", {
        "accept-language": "en-IN,en;q=0.9,hi;q=0.8",
        "cf-ipcountry": "IN",
      }),
    ).toBe("/en-IN/story");
    expect(target("/story", { cookie: "locale=hi-IN" })).toBe("/hi-IN/story");
  });

  it("replaces a language-only segment", () => {
    expect(target("/en/user/referral")).toBe("/en-GLOBAL/user/referral");
    expect(target("/de/user/referral")).toBe("/de-DE/user/referral");
    expect(target("/PL")).toBe("/pl-PL");
    expect(target("/fr/story")).toBe("/fr-FR/story");
    expect(target("/api/en/credits")).toBe("/api/en-GLOBAL/credits");
  });

  it("uses the canonical SEO locale for a bare language", () => {
    expect(target("/en/user", { cookie: "locale=en-US" })).toBe(
      "/en-GLOBAL/user",
    );
    expect(target("/en/user", { "accept-language": "en-US,en;q=0.9" })).toBe(
      "/en-GLOBAL/user",
    );
    expect(target("/de/user", { "accept-language": "de-DE" })).toBe(
      "/de-DE/user",
    );
    expect(target("/fr/user", { "accept-language": "fr-FR" })).toBe(
      "/fr-FR/user",
    );
    // Cookie of another language does not override the requested language
    expect(target("/de/user", { cookie: "locale=en-US" })).toBe("/de-DE/user");
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
    expect(target("/", { "accept-language": "fr-CA,fr;q=0.9" })).toBe("/fr-CA");
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

  it("resolves bare locales and old routes in one hop", async () => {
    const cases: [string, number, string][] = [
      ["/", 307, "/en-GLOBAL/story"],
      ["/de-US", 308, "/de-DE/story"],
      ["/en-US/", 308, "/en-GLOBAL/story"],
      ["/de-DE", 308, "/de-DE/story"],
      ["/de", 308, "/de-DE/story"],
      ["/en-us", 308, "/en-GLOBAL/story"],
      ["/de-PL/about-us", 308, "/de-DE/story/about-us"],
      ["/de-pl/about-us", 308, "/de-DE/story/about-us"],
      ["/en-US/login?next=x", 308, "/en-US/user/login?next=x"],
      ["/login", 307, "/en-GLOBAL/user/login"],
      ["/v1/audio", 307, "/en-GLOBAL/docs/api"],
      ["/de-GLOBAL/contact", 308, "/de-DE/help"],
    ];
    for (const [path, status, location] of cases) {
      const res = await middleware(request(path), options);
      expect(res.status, path).toBe(status);
      expect(res.headers.get("location"), path).toBe(
        `http://localhost:3000${location}`,
      );
    }
    // Signed-in visitors: the locale page decides (chat), no story redirect.
    const signedIn = await middleware(
      request("/de-DE", { cookie: `${AUTH_TOKEN_COOKIE_NAME}=x` }),
      options,
    );
    expect(signedIn.headers.get("location")).toBeNull();
  });

  it("passes the model changelog feed through to the root handler", async () => {
    const res = await middleware(
      request("/models-changelog.xml?locale=de-DE"),
      options,
    );
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("location")).toBeNull();
  });

  it("locale-redirects paths resembling the feed", async () => {
    for (const path of [
      "/models-changelogXxml",
      "/models-changelog.xml/child",
      "/user/models-changelog.xml",
    ]) {
      const res = await middleware(request(path), options);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe(
        `http://localhost:3000/en-GLOBAL${path}`,
      );
    }
  });

  it("never locale-redirects static paths", async () => {
    for (const path of [
      "/llms.txt",
      "/llms-full.txt",
      "/robots.txt",
      "/sitemap.xml",
      INDEXNOW_KEY_PATH,
      "/_next/static/chunk.js",
    ]) {
      const res = await middleware(request(path), options);
      expect(res.headers.get("location")).toBeNull();
    }
  });
});
