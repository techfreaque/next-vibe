import { describe, expect, test } from "bun:test";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import {
  SEO_LOCALES,
  seoLanguageAlternates,
} from "next-vibe/core/i18n/core/seo-locales";
import { z } from "zod";

import { SITEMAP_STATIC_PATHS } from "./_root/sitemap.xml/build-sitemap";
import { crawlLinkRel } from "../vibe/ui/crawl-link-rel";

const origin = Bun.env.SEO_CONTRACT_ORIGIN;
const full = Bun.env.SEO_CONTRACT_FULL === "1";
const selectedPaths = Bun.env.SEO_CONTRACT_PATHS?.split(",").filter(Boolean);
const schemaType = z.union([z.string().min(1), z.array(z.string().min(1))]);
const jsonLd = z
  .object({
    "@context": z.literal("https://schema.org"),
    "@type": schemaType.optional(),
    "@graph": z.array(z.object({ "@type": schemaType })).optional(),
  })
  .refine((data) => data["@type"] !== undefined || !!data["@graph"]?.length);

interface PageHead {
  titles: string[];
  descriptions: string[];
  canonicals: string[];
  alternates: Record<string, string>;
  robots: string[];
  viewport: string[];
  jsonLd: string[];
  internalLinks: { href: string; rel: string | null }[];
}

async function inspectHtml(html: string): Promise<PageHead> {
  const head: PageHead = {
    titles: [],
    descriptions: [],
    canonicals: [],
    alternates: {},
    robots: [],
    viewport: [],
    jsonLd: [],
    internalLinks: [],
  };
  let title = "";
  let structuredData = "";
  await new HTMLRewriter()
    .on("head > title", {
      text(chunk) {
        title += chunk.text;
        if (chunk.lastInTextNode) {
          head.titles.push(title.trim());
          title = "";
        }
      },
    })
    .on('meta[name="description"]', {
      element: (el) => {
        head.descriptions.push(el.getAttribute("content") ?? "");
      },
    })
    .on('meta[name="viewport"]', {
      element: (el) => {
        head.viewport.push(el.getAttribute("content") ?? "");
      },
    })
    .on('meta[name="robots"]', {
      element: (el) => {
        head.robots.push(el.getAttribute("content") ?? "");
      },
    })
    .on('link[rel="canonical"]', {
      element: (el) => {
        head.canonicals.push(el.getAttribute("href") ?? "");
      },
    })
    .on('link[rel="alternate"][hreflang]', {
      element(el) {
        const lang = el.getAttribute("hreflang");
        const href = el.getAttribute("href");
        if (lang && href) {
          expect(
            head.alternates[lang],
            `duplicate hreflang=${lang}`,
          ).toBeUndefined();
          head.alternates[lang] = href;
        }
      },
    })
    .on('script[type="application/ld+json"]', {
      text(chunk) {
        structuredData += chunk.text;
        if (chunk.lastInTextNode) {
          head.jsonLd.push(structuredData);
          structuredData = "";
        }
      },
    })
    .on('a[href^="/"]', {
      element(el) {
        const href = el.getAttribute("href");
        if (href) {
          head.internalLinks.push({ href, rel: el.getAttribute("rel") });
        }
      },
    })
    .transform(new Response(html))
    .text();
  return head;
}

function pathType(path: string): string {
  if (SITEMAP_STATIC_PATHS.includes(path)) return path;
  return path.replace(/^\/(models\/compare|models|skill)\/.+$/, "/$1/:id");
}

function expectedTypes(path: string): string[] {
  if (path.startsWith("/story/blog/")) return ["BlogPosting"];
  if (path.startsWith("/story/compare/")) return ["Article"];
  if (path === "/docs/api") return ["TechArticle"];
  if (path === "/subscription/overview" || pathType(path) === "/models/:id")
    return path === "/models/changelog" ? [] : ["Service"];
  if (pathType(path) === "/models/compare/:id")
    return ["Service", "BreadcrumbList"];
  if (path === "/models/compare") return ["BreadcrumbList"];
  return [];
}

// SEO_CONTRACT_ORIGIN=http://127.0.0.1:3000 bun test src/_pages/seo-route-contract.e2e.test.ts
// SEO_CONTRACT_FULL=1 checks every sitemap URL, including all dynamic slugs.
describe.skipIf(!origin)("public page SEO contract", () => {
  for (const locale of SEO_LOCALES) {
    test(
      `initial HTML for ${locale}`,
      async () => {
        const sitemap = await getPage("/sitemap.xml");
        expect(sitemap.status).toBe(200);
        const xml = await sitemap.text();
        const sitemapUrls = new Set(
          [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
            (match) => match[1] ?? "",
          ),
        );
        const canonicalOrigin = new URL([...sitemapUrls][0] ?? "").origin;
        const paths = [...sitemapUrls]
          .map((url) => new URL(url).pathname)
          .filter((path) => path.startsWith(`/${locale}/`))
          .map((path) => path.slice(locale.length + 1));
        const indexedPaths = new Set(paths);
        if (!selectedPaths) {
          for (const path of SITEMAP_STATIC_PATHS) {
            expect(indexedPaths.has(path), `missing sitemap path ${path}`).toBe(
              true,
            );
          }
        }
        const representatives = new Map<string, string>();
        for (const path of paths) {
          const type = pathType(path);
          if (!representatives.has(type)) representatives.set(type, path);
        }
        // Core templates run in every locale. Full mode also covers all model
        // pairs, models and skills. Static and editorial paths run by default.
        const cases =
          selectedPaths ?? (full ? paths : [...representatives.values()]);
        expect(cases.length).toBeGreaterThan(0);
        for (const path of cases) {
          await checkIndexablePage(canonicalOrigin, locale, path, sitemapUrls);
        }
      },
      full ? 600_000 : 180_000,
    );
  }

  test("noindex chat, canonical aliases, and missing slugs", async () => {
    const locale = defaultLocale;
    const prefix = new URL(`/${locale}`, origin).href;

    const guest = await getPage(
      `${prefix}/threads/private/new?model=claude-sonnet-5.5&q=SEO+contract&skill=thea&ref=contract`,
    );
    expect(guest.status).toBe(307);
    const destination = new URL(guest.headers.get("location") ?? "", origin);
    expect(destination.pathname).toBe(`/${locale}/threads/incognito/new`);
    expect(Object.fromEntries(destination.searchParams)).toEqual({
      model: "claude-sonnet-5.5",
      q: "SEO contract",
      skill: "thea",
      ref: "contract",
    });
    const chat = await getPage(destination.href);
    expect(chat.status).toBe(200);
    const head = await inspectHtml(await chat.text());
    expect(head.robots).toEqual(["noindex, follow"]);
    expect(head.canonicals.map((url) => new URL(url).pathname)).toEqual([
      `/${locale}/threads/incognito/new`,
    ]);
    expect(head.alternates).toEqual({});
    for (const path of [
      "/creator/seo-contract-missing",
      "/shared/seo-contract-missing",
      "/frame/seo-contract-missing",
      "/threads/public/00000000-0000-4000-8000-000000000099",
    ]) {
      const missing = await getPage(prefix + path);
      expect(missing.status, path).toBe(404);
    }
    const hub = await getPage(`${prefix}/story/compare`);
    expect(hub.status).toBe(308);
    expect(new URL(hub.headers.get("location") ?? "", origin).pathname).toBe(
      `/${locale}/story/compare/uncensored-ai-platforms`,
    );
  }, 60_000);
});

function getPage(path: string): Promise<Response> {
  // This exercises browser documents, including response codes and raw SEO metadata.
  return fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
}

async function checkIndexablePage(
  canonicalOrigin: string,
  locale: CountryLanguage,
  path: string,
  sitemapUrls: ReadonlySet<string>,
): Promise<void> {
  const route = `/${locale}${path}`;
  const response = await getPage(route);
  expect(response.status, route).toBe(200);
  const head = await inspectHtml(await response.text());
  expect(head.titles, route).toHaveLength(1);
  expect(head.titles[0], route).toMatch(/\S/);
  expect(head.descriptions, route).toHaveLength(1);
  expect(head.descriptions[0], route).toMatch(/\S/);
  expect(head.canonicals, route).toEqual([`${canonicalOrigin}${route}`]);
  expect(head.alternates, route).toEqual(
    seoLanguageAlternates(canonicalOrigin, path),
  );
  for (const alternate of Object.values(head.alternates)) {
    expect(sitemapUrls.has(alternate), alternate).toBe(true);
  }
  expect(head.robots, route).toHaveLength(1);
  expect(head.viewport, route).toHaveLength(1);
  expect(head.viewport[0], route).toContain("width=device-width");
  expect(head.robots[0], route).toMatch(/(?:^|,\s*)index(?:,|$)/);
  expect(head.robots[0], route).not.toContain("noindex");
  expect(response.headers.get("x-robots-tag") ?? "", route).not.toContain(
    "noindex",
  );
  const types = head.jsonLd.flatMap((value) => {
    const data = jsonLd.parse(JSON.parse(value));
    return [
      data["@type"] ?? [],
      ...(data["@graph"] ?? []).map((node) => node["@type"]),
    ].flat();
  });
  for (const type of ["Organization", "WebSite", ...expectedTypes(path)]) {
    expect(types, route).toContain(type);
  }
  for (const { href, rel } of head.internalLinks) {
    expect(href, route).not.toMatch(/^\/[a-z]{2}-[A-Z]+\/tools(?:[/?#]|$)/);
    if (crawlLinkRel(href) === "nofollow") {
      expect(rel?.split(/\s+/), `${route} -> ${href}`).toContain("nofollow");
    }
    if (/^\/[a-z]{2}-[A-Z]+\/models\/compare\/[^/]+\/[^/?#]+$/.test(href)) {
      expect(
        sitemapUrls.has(`${canonicalOrigin}${href}`),
        `${route} -> ${href}`,
      ).toBe(true);
    }
  }
}
