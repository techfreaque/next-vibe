/**
 * Character Skill Manifest — Dynamic Route
 * GET /api/[locale]/system/unified-interface/ai/skills/[character-id]-skill.md
 *
 * Returns a per-character skill manifest listing only the tools that character
 * has configured in its activeTools list. For generic characters (no activeTools),
 * falls back to the full public-user tier.
 *
 * Examples:
 *   /api/en/system/unified-interface/ai/skills/research-agent-skill.md
 *   /api/en/system/unified-interface/ai/skills/writer-skill.md
 *
 * Returns 404 for unknown, admin-only, or instance-filtered characters.
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import {
  generateCharacterAiRunMarkdown,
  generateCharacterSkillMarkdown,
} from "../markdown-generator";

const CACHE_MAX_AGE = 300; // 5 minutes

type SegmentType = "skill" | "ai-run";

/**
 * Extract character ID and doc type from segments like:
 *   "research-agent-skill.md"  → { id: "research-agent", type: "skill" }
 *   "research-agent-ai-run.md" → { id: "research-agent", type: "ai-run" }
 */
function parseCharacterSegment(
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
  }: { params: Promise<{ locale: CountryLanguage; characterSkill: string }> },
): Promise<Response> {
  const { locale, characterSkill } = await params.catch(() => ({
    locale: defaultLocale,
    characterSkill: "",
  }));

  const parsed = parseCharacterSegment(characterSkill);
  if (!parsed) {
    return new Response(
      "# Not Found\n\nInvalid file name. Expected `[character-id]-skill.md` or `[character-id]-ai-run.md`.",
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }

  const { id: characterId, type: docType } = parsed;

  try {
    const markdown =
      docType === "ai-run"
        ? await generateCharacterAiRunMarkdown(
            characterId,
            locale ?? defaultLocale,
          )
        : await generateCharacterSkillMarkdown(
            characterId,
            locale ?? defaultLocale,
          );

    if (!markdown) {
      return new Response(
        `# Not Found\n\nCharacter \`${characterId}\` does not exist, is admin-only, or is not publicly accessible.`,
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
        "X-Skill-Tier": docType === "ai-run" ? "character-ai-run" : "character",
        "X-Skill-Character": characterId,
      },
    });
  } catch (error) {
    const parsedErr = parseError(error);
    return new Response(
      `# Error\n\nFailed to generate \`${characterSkill}\`.\n\n\`\`\`\n${parsedErr.message}\n\`\`\``,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }
}
