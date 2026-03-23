/**
 * USER_WITH_ACCOUNT_SKILL.md - Account-Required Skill Manifest
 * GET /api/[locale]/system/unified-interface/ai/skills/USER_WITH_ACCOUNT_SKILL.md
 *
 * Returns a markdown document listing tools that strictly require an authenticated account
 * (CUSTOMER role only, no PUBLIC access - REMOTE_SKILL marker required).
 *
 * Use this manifest when building agents that perform account-specific actions:
 * posting messages, managing threads, updating profile, etc.
 *
 * Every tool in this manifest REQUIRES a Bearer JWT token.
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
    const markdown = await generateSkillMarkdown(
      "user-with-account",
      locale ?? defaultLocale,
    );

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=60`,
        "X-Skill-Tier": "user-with-account",
        "X-Skill-File": "USER_WITH_ACCOUNT_SKILL.md",
      },
    });
  } catch (error) {
    const parsed = parseError(error);
    return new Response(
      `# Error\n\nFailed to generate USER_WITH_ACCOUNT_SKILL.md skill manifest.\n\n\`\`\`\n${parsed.message}\n\`\`\``,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }
}
