import { describe, expect, it } from "bun:test";

import {
  canonicalSeoLocale,
  hreflangFor,
  SEO_LOCALES,
  seoLanguageAlternates,
} from "./seo-locales";

describe("seo-locales", () => {
  it("keeps indexable locales canonical", () => {
    for (const locale of SEO_LOCALES) {
      expect(canonicalSeoLocale(locale)).toBe(locale);
    }
  });

  it("maps mixed locales to their language's indexable locale", () => {
    expect(canonicalSeoLocale("de-US")).toBe("de-DE");
    expect(canonicalSeoLocale("de-GLOBAL")).toBe("de-DE");
    expect(canonicalSeoLocale("pl-GLOBAL")).toBe("pl-PL");
    expect(canonicalSeoLocale("it-CH")).toBe("it-IT");
    expect(canonicalSeoLocale("es-MX")).toBe("es-ES");
    expect(canonicalSeoLocale("sk-GLOBAL")).toBe("sk-SK");
    expect(canonicalSeoLocale("de-AT")).toBe("de-DE");
    expect(canonicalSeoLocale("fr-CA")).toBe("fr-FR");
    expect(canonicalSeoLocale("fr-DE")).toBe("fr-FR");
    expect(canonicalSeoLocale("en-PL")).toBe("en-GLOBAL");
    expect(canonicalSeoLocale("en-DE")).toBe("en-GLOBAL");
    expect(canonicalSeoLocale("hi-GLOBAL")).toBe("hi-IN");
    expect(canonicalSeoLocale("hi-US")).toBe("hi-IN");
    expect(canonicalSeoLocale("en-IN")).toBe("en-IN");
    expect(canonicalSeoLocale("en-US")).toBe("en-GLOBAL");
  });

  it("announces GLOBAL as the bare language", () => {
    expect(hreflangFor("en-GLOBAL")).toBe("en");
    expect(hreflangFor("de-DE")).toBe("de-DE");
  });

  it("builds valid alternates with x-default and no GLOBAL region", () => {
    const alternates = seoLanguageAlternates("https://example.com/", "models");
    expect(Object.keys(alternates).toSorted()).toEqual(
      [
        "de-DE",
        "de",
        "en",
        "fr-FR",
        "fr",
        "it-IT",
        "it",
        "es-ES",
        "es",
        "sk-SK",
        "sk",
        "en-IN",
        "hi-IN",
        "hi",
        "pl-PL",
        "pl",
        "x-default",
      ].toSorted(),
    );
    expect(alternates["de"]).toBe("https://example.com/de-DE/models");
    expect(alternates["es"]).toBe("https://example.com/es-ES/models");
    expect(alternates["sk"]).toBe("https://example.com/sk-SK/models");
    expect(alternates["en-IN"]).toBe("https://example.com/en-IN/models");
    expect(alternates["hi-IN"]).toBe("https://example.com/hi-IN/models");
    expect(alternates["hi"]).toBe("https://example.com/hi-IN/models");
    expect(alternates["x-default"]).toBe(
      "https://example.com/en-GLOBAL/models",
    );
    expect(alternates["en"]).toBe("https://example.com/en-GLOBAL/models");
    expect(alternates["en-US"]).toBeUndefined();
    expect(seoLanguageAlternates("https://example.com", "")["de-DE"]).toBe(
      "https://example.com/de-DE",
    );
  });
});
