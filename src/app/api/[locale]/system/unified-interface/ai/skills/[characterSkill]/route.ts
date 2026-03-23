/**
 * Skill Skill Manifest - Dynamic Route
 * GET /api/[locale]/system/unified-interface/ai/skills/[skill-id]-skill.md
 *
 * Returns a per-skill manifest listing only the tools that skill
 * has configured in its availableTools list. For generic skills (no availableTools),
 * falls back to the full public-user tier.
 *
 * Examples:
 *   /api/en/system/unified-interface/ai/skills/research-agent-skill.md
 *   /api/en/system/unified-interface/ai/skills/writer-skill.md
 *
 * Returns 404 for unknown, admin-only, or instance-filtered skills.
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  generateSkillAiRunMarkdown,
  generateSkillSkillMarkdown,
} from "../markdown-generator";

const CACHE_MAX_AGE = 300; // 5 minutes

type SegmentType = "skill" | "ai-run";

/**
 * Extract character ID and doc type from segments like:
 *   "research-agent-skill.md"  → { id: "research-agent", type: "skill" }
 *   "research-agent-ai-run.md" → { id: "research-agent", type: "ai-run" }
 */
function parseSkillSegment(
  segment: string,
): { id: string; type: SegmentType } | null {
  if (segment.endsWith("-skill.md")) {
    const id = segment.slice(0, -"-skill.md".length);
    return id ? { id, type: "skill" } : null;
  }
  if (segment.endsWith("-ai-run.md")) {
    const id = segment.slice(0, -"-ai-run.md".length);
    return id ? { id, type: "ai-run" } : null;
  }
  return null;
}

export async function GET(
  // oxlint-disable-next-line no-unused-vars
  request: Request,
  {
    params,
  }: { params: Promise<{ locale: CountryLanguage; skillSlug: string }> },
): Promise<Response> {
  const { locale, skillSlug } = await params.catch(() => ({
    locale: defaultLocale,
    skillSlug: "",
  }));

  const parsed = parseSkillSegment(skillSlug);
  if (!parsed) {
    return new Response(
      "# Not Found\n\nInvalid file name. Expected `[skill-id]-skill.md` or `[skill-id]-ai-run.md`.",
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }

  const { id: skillId, type: docType } = parsed;

  try {
    const markdown =
      docType === "ai-run"
        ? await generateSkillAiRunMarkdown(skillId, locale ?? defaultLocale)
        : await generateSkillSkillMarkdown(skillId, locale ?? defaultLocale);

    if (!markdown) {
      return new Response(
        `# Not Found\n\nSkill \`${skillId}\` does not exist, is admin-only, or is not publicly accessible.`,
        {
          status: 404,
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        },
      );
    }

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=60`,
        "X-Skill-Tier": docType === "ai-run" ? "skill-ai-run" : "skill",
        "X-Skill-Id": skillId,
      },
    });
  } catch (error) {
    const parsedErr = parseError(error);
    return new Response(
      `# Error\n\nFailed to generate \`${skillSlug}\`.\n\n\`\`\`\n${parsedErr.message}\n\`\`\``,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }
}
