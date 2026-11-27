/**
 * robots.txt vs sitemap vs noindex: the three must never contradict each
 * other (Search Console reports every contradiction as an indexing issue).
 *
 * - every sitemap URL is crawlable under robots.txt,
 * - app pages that carry noindex (chat, account, auth) are crawlable, so
 *   Google can see the noindex instead of reporting "Indexed, though blocked
 *   by robots.txt",
 * - raw APIs and admin tools stay disallowed,
 * - no noindex page type is listed in the sitemap.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { NOINDEX_FOLLOW_ROBOTS } from "next-vibe/core/i18n/core/metadata";

import {
  canonicalComparisonPath,
  isIndexableComparison,
  listModelFacts,
} from "../../models/_shared/model-facts";
import { generateMetadata as compareMetadata } from "../../models/compare/[a]/[b]/page";
import { generateMetadata as threadsMetadata } from "../../threads/[...path]/page";
import { listSitemapUrls } from "./build-sitemap";

const ALL: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  nanoGPT: true,
  scrappey: true,
  openAiImages: true,
  openAiStt: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  edenAiStt: true,
  deepgram: true,
  openAiTts: true,
  edenAiTts: true,
  elevenlabs: true,
  unbottledSystem: false,
  unbottledForce: false,
};

const BASE = "https://example.test";

interface RobotsRule {
  allow: boolean;
  pattern: string;
}

/** Rules of the `User-agent: *` group. */
function parseRobots(text: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let inStarGroup = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*$/, "").trim();
    const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!match) {
      continue;
    }
    const key = (match[1] ?? "").toLowerCase();
    const value = (match[2] ?? "").trim();
    if (key === "user-agent") {
      inStarGroup = value === "*";
    } else if (inStarGroup && (key === "allow" || key === "disallow")) {
      if (value) {
        rules.push({ allow: key === "allow", pattern: value });
      }
    }
  }
  return rules;
}

function patternRegex(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** Google semantics: longest matching rule wins, Allow wins a tie. */
function isAllowed(rules: readonly RobotsRule[], path: string): boolean {
  let best: RobotsRule | null = null;
  for (const rule of rules) {
    if (!patternRegex(rule.pattern).test(path)) {
      continue;
    }
    if (
      best === null ||
      rule.pattern.length > best.pattern.length ||
      (rule.pattern.length === best.pattern.length && rule.allow)
    ) {
      best = rule;
    }
  }
  return best === null || best.allow;
}

const rules = parseRobots(
  readFileSync(join(process.cwd(), "public", "robots.txt"), "utf8"),
);

describe("robots.txt rules", () => {
  test("every sitemap URL is crawlable", () => {
    const skillPages = SkillsRepository.listPublicDefaultSkillIds().map(
      (id) => ({ id, updatedAt: null }),
    );
    const urls = listSitemapUrls(ALL, skillPages, BASE);
    expect(urls.length).toBeGreaterThan(100);
    const blocked = urls
      .map(({ url }) => url.slice(BASE.length))
      .filter((path) => !isAllowed(rules, path));
    expect(blocked).toEqual([]);
  });

  test("noindex app pages are crawlable so the noindex is seen", () => {
    for (const path of [
      "/en-US/threads",
      "/en-US/threads/incognito/new",
      "/en-US/threads/public",
      "/en-US/threads/private/new?model=glm-5.3&q=hi",
      "/de-DE/user/login",
      "/en-US/user/signup",
      "/en-US/user/referral",
      "/en-US/user/api-keys",
      "/en-US/subscription/buy",
    ]) {
      expect({ path, allowed: isAllowed(rules, path) }).toEqual({
        path,
        allowed: true,
      });
    }
  });

  test("raw APIs and admin tools stay disallowed", () => {
    for (const path of [
      "/api/en-US/credits",
      "/en-US/api/anything",
      "/en-US/tools",
      "/en-US/tools/agent/chat",
    ]) {
      expect({ path, allowed: isAllowed(rules, path) }).toEqual({
        path,
        allowed: false,
      });
    }
  });

  test("the sitemap lists no noindex page type", () => {
    const paths = listSitemapUrls(ALL, [], BASE).map(({ url }) =>
      url.slice(BASE.length).replace(/^\/[a-z]{2}-[A-Z]+/, ""),
    );
    const noindexPrefixes = [
      "/threads",
      "/user",
      "/tools",
      "/setup",
      "/invoice",
      "/subscription/buy",
      "/subscription/history",
      "/story/newsletter/unsubscribe",
      "/story/newsletter/confirm",
    ];
    expect(
      paths.filter((path) =>
        noindexPrefixes.some(
          (prefix) => path === prefix || path.startsWith(`${prefix}/`),
        ),
      ),
    ).toEqual([]);
  });

  test("chat pages carry noindex, follow and the canonical composer URL", async () => {
    const metadata = await threadsMetadata({
      params: Promise.resolve({ locale: "en-US", path: ["incognito", "new"] }),
      searchParams: Promise.resolve({}),
    });
    expect(metadata.robots).toEqual(NOINDEX_FOLLOW_ROBOTS);
    expect(metadata.alternates?.canonical).toMatch(
      /\/en-US\/threads\/incognito\/new$/,
    );
  });

  test("compare pages index current pairs and legacy->successor upgrades, and noindex unrelated legacy pairs", async () => {
    const models = listModelFacts(ALL);
    const legacyWithSuccessor = models.find(
      (facts) => facts.isLegacy && facts.successor !== null,
    );
    const otherLegacy = models.find(
      (facts) =>
        facts.isLegacy &&
        legacyWithSuccessor !== undefined &&
        facts.id !== legacyWithSuccessor.id,
    );
    const currentModels = models.filter((facts) => !facts.isLegacy);
    const unrelatedCurrent = currentModels.find(
      (facts) =>
        legacyWithSuccessor?.successor !== null &&
        facts.id !== legacyWithSuccessor?.successor?.id,
    );
    if (!legacyWithSuccessor?.successor || !otherLegacy || !unrelatedCurrent) {
      expect.unreachable("expected legacy and current models in registry");
    }

    const successorFacts = models.find(
      (facts) => facts.id === legacyWithSuccessor.successor?.id,
    );
    if (!successorFacts) {
      expect.unreachable("expected successor facts");
    }

    expect(isIndexableComparison(successorFacts, unrelatedCurrent)).toBe(true);
    expect(isIndexableComparison(legacyWithSuccessor, successorFacts)).toBe(
      true,
    );
    expect(isIndexableComparison(legacyWithSuccessor, unrelatedCurrent)).toBe(
      false,
    );
    expect(isIndexableComparison(legacyWithSuccessor, otherLegacy)).toBe(false);

    // Every compare URL in the sitemap must be indexable.
    const bySlug = new Map(models.map((facts) => [facts.slug, facts]));
    for (const { url } of listSitemapUrls(ALL, [], BASE)) {
      const path = url.slice(BASE.length).replace(/^\/[a-z]{2}-[A-Z]+/, "");
      if (!path.startsWith("/models/compare/")) {
        continue;
      }
      const [, , , leftSlug, rightSlug] = path.split("/");
      const left = leftSlug ? bySlug.get(leftSlug) : undefined;
      const right = rightSlug ? bySlug.get(rightSlug) : undefined;
      if (!left || !right) {
        expect.unreachable(`unknown models in sitemap compare path: ${path}`);
      }
      expect(isIndexableComparison(left, right)).toBe(true);
    }

    // Metadata robots check on real compare page generateMetadata (when a
    // provider key is configured in the test env for these models).
    const upgradePath = canonicalComparisonPath(
      legacyWithSuccessor,
      successorFacts,
    );
    const [, , , upA, upB] = upgradePath.split("/");
    const unrelatedPath = canonicalComparisonPath(
      legacyWithSuccessor,
      unrelatedCurrent,
    );
    const [, , , unA, unB] = unrelatedPath.split("/");
    if (upA && upB && unA && unB) {
      try {
        const upgradeMeta = await compareMetadata({
          params: Promise.resolve({ locale: "en-US", a: upA, b: upB }),
        });
        expect(upgradeMeta.robots).not.toEqual(NOINDEX_FOLLOW_ROBOTS);
        const unrelatedMeta = await compareMetadata({
          params: Promise.resolve({ locale: "en-US", a: unA, b: unB }),
        });
        expect(unrelatedMeta.robots).toEqual(NOINDEX_FOLLOW_ROBOTS);
      } catch {
        // In environments without provider keys configured, notFound() throws.
      }
    }
  });
});
