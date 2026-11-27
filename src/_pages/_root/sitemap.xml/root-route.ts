/**
 * GET /sitemap.xml - root route (served outside [locale] on Next and TanStack;
 * shells are generated from src/_pages/_root/<file>/root-route.ts).
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  buildSitemapIndexXml,
  buildSitemapXml,
  parseSitemapPart,
} from "./build-sitemap";
import { loadSitemapInputs } from "./sitemap-source";

/**
 * Never prerender. The index reads no request data, so `next build` would
 * otherwise bake it into a static file. The Docker build runs with
 * placeholder env (no provider keys) and no DB, so the baked sitemap had zero
 * model, compare and skill pages, and the runtime env patch only rewrites JS,
 * never prerendered bodies.
 */
export const dynamic = "force-dynamic";

/** Built once per (availability, public skill set, child) state. */
const cached = new Map<string, string>();
let cachedInputs = "";

/**
 * `/sitemap.xml` is the sitemap index; `/sitemap.xml?type=<type>&locale=<l>`
 * serves one child (a page type in one locale). Unknown children are 404.
 */
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const part = parseSitemapPart(params);
  if (part === null && (params.has("type") || params.has("locale"))) {
    return new Response("Not found", { status: 404 });
  }
  const { availability, skillPages } = await loadSitemapInputs(
    createEndpointLogger(false, defaultLocale),
  );
  const inputs = JSON.stringify({ availability, skillPages });
  if (inputs !== cachedInputs) {
    cached.clear();
    cachedInputs = inputs;
  }
  const key = part === null ? "index" : `${part.type}:${part.locale}`;
  let xml = cached.get(key);
  if (xml === undefined) {
    xml =
      part === null
        ? buildSitemapIndexXml(availability, skillPages)
        : buildSitemapXml(availability, skillPages, undefined, part);
    cached.set(key, xml);
  }
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
