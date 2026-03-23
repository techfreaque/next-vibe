/**
 * USER_WITH_ACCOUNT_AI_RUN.md - AI Run Guide (Authenticated Tier)
 * GET /api/[locale]/system/unified-interface/ai/skills/USER_WITH_ACCOUNT_AI_RUN.md
 *
 * Focused guide for using POST /agent/ai-stream/run with account-required tools.
 * All requests require a Bearer JWT token. No tool listing - see USER_WITH_ACCOUNT_SKILL.md
 * for the HTTP endpoint reference.
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { generateTierAiRunMarkdown } from "../markdown-generator";

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
    const markdown = await generateTierAiRunMarkdown(
      "user-with-account",
      locale ?? defaultLocale,
    );

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=60`,
        "X-Skill-Tier": "user-with-account-ai-run",
        "X-Skill-File": "USER_WITH_ACCOUNT_AI_RUN.md",
      },
    });
  } catch (error) {
    const parsed = parseError(error);
    return new Response(
      `# Error\n\nFailed to generate USER_WITH_ACCOUNT_AI_RUN.md.\n\n\`\`\`\n${parsed.message}\n\`\`\``,
      {
        status: 500,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }
}
