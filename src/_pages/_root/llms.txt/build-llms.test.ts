/**
 * /llms.txt + JSON-LD builders: numbers come from config, every blog post is
 * listed, nothing ships with an unfilled placeholder or an em dash.
 */

import { describe, expect, it } from "bun:test";
import { serializeJsonLd } from "next-vibe/ui/components/json-ld";

import { buildFaqStructuredData } from "@/_pages/_components/faq-structured-data";
import {
  buildBlogPostStructuredData,
  buildPlanOffers,
  buildPricingStructuredData,
  buildSiteStructuredData,
} from "@/_pages/_components/structured-data";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { ProductIds, productsRepository } from "@/products/platform-products";

import { listBlogPostCards } from "../../story/blog/posts-cards";
import { BLOG_POST_DATES, type BlogPostSlug } from "../../story/blog/posts-meta";
import { sitemapLocales } from "../sitemap.xml/build-sitemap";
import { buildLlmsTxt, resolveLlmsLocale } from "./build-llms";

const EM_DASH = "—";
function isBlogPostSlug(value: string): value is BlogPostSlug {
  return value in BLOG_POST_DATES;
}
const slugs = Object.keys(BLOG_POST_DATES).filter(isBlogPostSlug);

describe("llms.txt", () => {
  it("states the configured free credits and lists every blog post", async () => {
    const locale = resolveLlmsLocale(null);
    const text = await buildLlmsTxt(locale, "short");
    expect(text.startsWith("# ")).toBe(true);
    expect(text).toContain(`${FREE_CREDIT_ALLOWANCE.guest} without an account`);
    expect(text).toContain(`${FREE_CREDIT_SIGNED_IN_TOTAL} with a free account`);
    expect(text).toContain(`${FREE_CREDIT_MAX_TOTAL} with a free account and`);
    expect(text).toContain("HTTP 402");
    expect(text).toContain("/v1/images/generations");
    expect(text).toContain("/v1/videos");
    expect(text).toContain("/llms-full.txt");
    for (const slug of slugs) {
      expect(text).toContain(`/${locale}/story/blog/${slug})`);
    }
  });

  it("has no unfilled placeholders or em dashes in any locale", async () => {
    for (const locale of sitemapLocales()) {
      for (const variant of ["short", "full"] as const) {
        const text = await buildLlmsTxt(locale, variant);
        expect(text).toContain(`/${locale}/story/abliterated-ai-chat)`);
        expect(text).not.toContain("{{");
        expect(text).not.toContain(EM_DASH);
      }
    }
  });

  it("full variant adds the model list", async () => {
    const text = await buildLlmsTxt(resolveLlmsLocale(null), "full");
    expect(text).toContain("## Chat models");
    expect(text).toContain("## Media models");
    expect(text).not.toContain("/llms-full.txt");
  });

  it("only accepts site locales from ?locale=", () => {
    expect(resolveLlmsLocale("de-DE")).toBe("de-DE");
    expect(resolveLlmsLocale("es-MX")).toBe("es-ES");
    expect(resolveLlmsLocale("it-CH")).toBe("it-IT");
    expect(resolveLlmsLocale("fr")).toBe("fr-FR");
    expect(resolveLlmsLocale("FR-fr")).toBe("fr-FR");
    expect(resolveLlmsLocale("en")).toBe("en-GLOBAL");
    expect(resolveLlmsLocale("xx-YY")).toBe(resolveLlmsLocale(null));
  });
});

describe("JSON-LD", () => {
  it("offers carry the real checkout prices", () => {
    for (const locale of sitemapLocales()) {
      const products = productsRepository.getProducts(locale);
      const offers = buildPlanOffers(locale, 1);
      const pricing = buildPricingStructuredData({ locale, modelCount: 1 });
      expect(pricing["@type"]).toBe("Service");
      expect(pricing.offers).toEqual(offers);
      const prices = offers.map((offer) => offer.price);
      expect(prices).toEqual([
        0,
        products[ProductIds.SUBSCRIPTION].price,
        productsRepository.getProduct(ProductIds.SUBSCRIPTION, locale, "year")
          .price,
        products[ProductIds.SUBSCRIPTION_PLUS].price,
        products[ProductIds.SUBSCRIPTION_PRO].price,
        products[ProductIds.SUBSCRIPTION_ULTRA].price,
        products[ProductIds.CREDIT_PACK].price,
      ]);
      for (const offer of offers) {
        expect(offer.priceCurrency).toBe(products[ProductIds.CREDIT_PACK].currency);
      }
    }
  });

  it("every blog post gets BlogPosting + BreadcrumbList", () => {
    const cards = listBlogPostCards("en-US");
    expect(cards.map((card) => card.slug).toSorted()).toEqual(slugs.toSorted());
    for (const slug of slugs) {
      const data = buildBlogPostStructuredData({ locale: "en-US", slug });
      const json = JSON.stringify(data);
      expect(json).toContain('"@type":"BlogPosting"');
      expect(json).toContain('"@type":"BreadcrumbList"');
      expect(json).toContain(`"datePublished":"${BLOG_POST_DATES[slug]}"`);
      // Google Article fields: image with real size, author/publisher by name.
      expect(json).toContain('"image":{"@type":"ImageObject"');
      expect(json).toContain('"width":1200,"height":630');
      expect(json).toMatch(/"author":\{"@type":"Organization","@id":"[^"]+","name":"[^"]+"/);
    }
  });

  it("never claims ratings or reviews", () => {
    const json = JSON.stringify([
      buildSiteStructuredData({
        locale: "en-US",
        modelCount: 1,
        providerCount: 1,
      }),
      buildPricingStructuredData({ locale: "en-US", modelCount: 1 }),
    ]);
    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain("review");
    expect(json).not.toContain('"@type":"Product"');
    // Software App rich results require ratings, which we do not claim.
    expect(json).not.toContain('"@type":"WebApplication"');
    expect(json).not.toContain('"@type":"SoftwareApplication"');
    expect(json).not.toContain("shippingDetails");
    expect(json).not.toContain("hasMerchantReturnPolicy");
    expect(json).not.toContain("{{");
  });

  it("escapes < so a string cannot close the script tag", () => {
    const out = serializeJsonLd(
      buildFaqStructuredData([{ question: "</script>", answer: "a" }]),
    );
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toBeTruthy();
  });
});
