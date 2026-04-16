/**
 * Public Creator Profile Page
 * Link-tree style page showing a creator's public skills and profile.
 * URL: /[locale]/creator/[userId]
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  CreatorProfilePage,
  type CreatorLeadMagnetConfig,
  type CreatorPageData,
} from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; userId: string }>;
}

/** Resolve userId param - accepts UUID or creatorSlug. Returns null if not found. */
async function resolveUserId(param: string): Promise<string | null> {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(param)) {
    return param;
  }
  const { eq, or, sql } = await import("drizzle-orm");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");
  // Match by creatorSlug, or fall back to publicName converted to slug format
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(
      or(
        eq(users.creatorSlug, param),
        eq(sql`lower(replace(${users.publicName}, ' ', '-'))`, param),
      ),
    )
    .limit(1);
  return result[0]?.id ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, userId: rawParam } = await params;
  const userId = await resolveUserId(rawParam);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  if (!userId) {
    return { title: `Creator Not Found - ${appName}` };
  }

  const { eq } = await import("drizzle-orm");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");

  const results = await db.select().from(users).where(eq(users.id, userId));
  const user = results[0];
  const publicName = user?.publicName ?? appName;

  return {
    title: `${publicName} - Creator Profile`,
    description: `${publicName} builds AI skills on ${appName}. Explore their work and start a conversation.`,
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<CreatorPageData> {
  const { locale, userId: rawParam } = await params;
  const resolvedId = await resolveUserId(rawParam);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  if (!resolvedId) {
    return {
      locale,
      userId: rawParam,
      creator: null,
      skills: [],
      appName,
      leadMagnetConfig: null,
    };
  }

  const userId = resolvedId;
  const { and, count, eq } = await import("drizzle-orm");
  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");
  const { SkillOwnershipType } =
    await import("@/app/api/[locale]/agent/chat/skills/enum");
  const { referralCodes } = await import("@/app/api/[locale]/referral/db");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");

  const [userResults, skillRows] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)),
    db
      .select({
        id: customSkills.id,
        name: customSkills.name,
        tagline: customSkills.tagline,
        description: customSkills.description,
        icon: customSkills.icon,
        category: customSkills.category,
      })
      .from(customSkills)
      .where(
        and(
          eq(customSkills.userId, userId),
          eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
        ),
      ),
  ]);

  if (userResults.length === 0) {
    return {
      locale,
      userId,
      creator: null,
      skills: skillRows,
      appName,
      leadMagnetConfig: null,
    };
  }

  const user = userResults[0];
  const { leadMagnetConfigs } =
    await import("@/app/api/[locale]/lead-magnet/db");
  const [skillCountResult, referralResult, configRows] = await Promise.all([
    db
      .select({ count: count() })
      .from(customSkills)
      .where(eq(customSkills.userId, userId)),
    db
      .select({ code: referralCodes.code })
      .from(referralCodes)
      .where(eq(referralCodes.ownerUserId, userId))
      .limit(1),
    db
      .select({
        headline: leadMagnetConfigs.headline,
        buttonText: leadMagnetConfigs.buttonText,
        isActive: leadMagnetConfigs.isActive,
      })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1),
  ]);

  const creator = {
    userId,
    publicName: user.publicName,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    websiteUrl: user.websiteUrl ?? null,
    twitterUrl: user.twitterUrl ?? null,
    youtubeUrl: user.youtubeUrl ?? null,
    instagramUrl: user.instagramUrl ?? null,
    tiktokUrl: user.tiktokUrl ?? null,
    githubUrl: user.githubUrl ?? null,
    discordUrl: user.discordUrl ?? null,
    creatorAccentColor: user.creatorAccentColor ?? null,
    creatorHeaderImageUrl: user.creatorHeaderImageUrl ?? null,
    skillCount: skillCountResult[0]?.count ?? 0,
    referralCode: referralResult[0]?.code ?? null,
  };

  const cfg = configRows[0];
  const leadMagnetConfig: CreatorLeadMagnetConfig | null = cfg?.isActive
    ? { headline: cfg.headline, buttonText: cfg.buttonText }
    : null;

  return {
    locale,
    userId,
    creator,
    skills: skillRows,
    appName,
    leadMagnetConfig,
  };
}

export function TanstackPage(data: CreatorPageData): JSX.Element {
  return <CreatorProfilePage {...data} />;
}

export default async function CreatorPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params: params });
  return <CreatorProfilePage {...data} />;
}
