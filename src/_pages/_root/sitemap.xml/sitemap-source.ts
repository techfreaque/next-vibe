/**
 * Runtime inputs of the sitemap: provider availability plus the public skill
 * pages (built-ins and published community skills from the DB). Shared by
 * GET /sitemap.xml and the IndexNow submitter so both list the same URLs.
 */

import "server-only";

import {
  type AgentEnvAvailability,
  getEnvAvailability,
} from "next-vibe/agent/env-availability";
import { DEFAULT_SKILLS } from "next-vibe/agent/skills/config";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { SitemapSkillPage } from "./build-sitemap";

const builtInSkillIds = new Set(DEFAULT_SKILLS.map(({ id }) => id));

async function listSkillPages(
  logger: EndpointLogger,
): Promise<SitemapSkillPage[]> {
  const pages: SitemapSkillPage[] =
    SkillsRepository.listPublicDefaultSkillIds().map((id) => ({
      id,
      updatedAt: null,
    }));
  const community = await SkillsRepository.listPublishedCommunitySkillPages(
    logger,
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

export async function loadSitemapInputs(logger: EndpointLogger): Promise<{
  availability: AgentEnvAvailability;
  skillPages: SitemapSkillPage[];
}> {
  const [availability, skillPages] = await Promise.all([
    getEnvAvailability(),
    listSkillPages(logger),
  ]);
  return { availability, skillPages };
}
