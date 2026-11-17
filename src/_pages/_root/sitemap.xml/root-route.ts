/**
 * GET /sitemap.xml - root route (served outside [locale] on Next and TanStack;
 * shells are generated from src/_pages/_root/<file>/root-route.ts).
 */

import { getEnvAvailability } from "next-vibe/agent/env-availability";

import { buildSitemapXml } from "./build-sitemap";

/**
 * Built once per availability state (which provider keys are configured):
 * registries are static, so in practice once per server process.
 */
let cached: { key: string; xml: string } | null = null;

export async function GET(): Promise<Response> {
  const availability = await getEnvAvailability();
  const key = JSON.stringify(availability);
  if (cached?.key !== key) {
    cached = { key, xml: buildSitemapXml(availability) };
  }
  return new Response(cached.xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
