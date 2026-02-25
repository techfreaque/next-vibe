/**
 * PUBLIC_USER_SKILL.md - Signed-In User Skill Manifest
 * GET /api/[locale]/system/unified-interface/ai/skills/PUBLIC_USER_SKILL.md
 *
 * Returns a markdown document listing all tools available to authenticated users
 * (PUBLIC + CUSTOMER role endpoints with REMOTE_SKILL marker).
 *
 * Use this manifest when an AI agent is acting on behalf of a signed-in user.
 * Includes all tools from AGENT.md plus additional tools requiring authentication.
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { generateSkillMarkdown } from "../markdown-generator";

const CACHE_MAX_AGE = 300; // 5 minutes

export async function GET(
  // oxlint-disable-next-line no-unused-vars
  request: Request,
  { params }: { params: Promise<{ locale: CountryLanguage }> },
): Promise<Response> {
  const { locale } = await params.catch(() => ({
    locale: defaultLocale,
  }));

  try {
    const markdown = generateSkillMarkdown(
      "public-user",
      locale ?? defaultLocale,
    );

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=60`,
        "X-Skill-Tier": "public-user",
        "X-Skill-File": "PUBLIC_USER_SKILL.md",
      },
    });
  } catch (error) {
    const parsed = parseError(error);
    return new Response(
      `# Error\n\nFailed to generate PUBLIC_USER_SKILL.md skill manifest.\n\n\`\`\`\n${parsed.message}\n\`\`\``,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }
}
