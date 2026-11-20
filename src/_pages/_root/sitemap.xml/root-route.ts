/**
 * GET /sitemap.xml - root route (served outside [locale] on Next and TanStack;
 * shells are generated from src/_pages/_root/<file>/root-route.ts).
 */

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { DEFAULT_SKILLS } from "next-vibe/agent/skills/config";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { buildSitemapXml, type SitemapSkillPage } from "./build-sitemap";

/**
 * Never prerender. This handler reads no request data, so `next build` would
 * otherwise bake it into a static file. The Docker build runs with
 * placeholder env (no provider keys) and no DB, so the baked sitemap had zero
 * model, compare and skill pages, and the runtime env patch only rewrites JS,
 * never prerendered bodies.
 */
export const dynamic = "force-dynamic";

/** Built once per (availability, public skill set) state. */
let cached: { key: string; xml: string } | null = null;
const builtInSkillIds = new Set(DEFAULT_SKILLS.map(({ id }) => id));

async function listSkillPages(): Promise<SitemapSkillPage[]> {
  const pages: SitemapSkillPage[] =
    SkillsRepository.listPublicDefaultSkillIds().map((id) => ({
      id,
      updatedAt: null,
    }));
  const community = await SkillsRepository.listPublishedCommunitySkillPages(
    createEndpointLogger(false, defaultLocale),
    defaultLocale,
  );
  if (community.success) {
    pages.push(
      ...community.data
        .filter(({ id, name }) => name.trim() && !builtInSkillIds.has(id))
        .map(({ id, updatedAt }) => ({ id, updatedAt })),
    );
  }
  return pages;
}

export async function GET(): Promise<Response> {
  const [availability, skillPages] = await Promise.all([
    getEnvAvailability(),
    listSkillPages(),
  ]);
  const key = JSON.stringify({ availability, skillPages });
  if (cached?.key !== key) {
    cached = { key, xml: buildSitemapXml(availability, skillPages) };
  }
  return new Response(cached.xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
