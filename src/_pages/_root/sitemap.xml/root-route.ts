/**
 * GET /sitemap.xml - root route (served outside [locale] on Next and TanStack;
 * shells are generated from src/_pages/_root/<file>/root-route.ts).
 */

import { buildSitemapXml } from "./build-sitemap";

/** Built once per server process - all inputs are static registries. */
let cachedXml: string | null = null;

export function GET(): Response {
  cachedXml ??= buildSitemapXml();
  return new Response(cachedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
