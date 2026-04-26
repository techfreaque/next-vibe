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

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { CreatorProfileRepository } from "@/app/api/[locale]/user/public/creator/[userId]/repository";
import { scopedTranslation } from "@/app/api/[locale]/user/public/creator/[userId]/i18n";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { CreatorProfilePage, type CreatorPageData } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; userId: string }>;
}

/** Resolve userId param for metadata - accepts UUID or creatorSlug. */
async function resolveUserName(param: string): Promise<string | null> {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(param)) {
    const { eq, or, sql } = await import("drizzle-orm");
    const { db } = await import("@/app/api/[locale]/system/db");
    const { users } = await import("@/app/api/[locale]/user/db");
    const result = await db
      .select({ publicName: users.publicName })
      .from(users)
      .where(
        or(
          eq(users.creatorSlug, param),
          eq(sql`lower(replace(${users.publicName}, ' ', '-'))`, param),
        ),
      )
      .limit(1);
    return result[0]?.publicName ?? null;
  }
  const { eq } = await import("drizzle-orm");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");
  const result = await db
    .select({ publicName: users.publicName })
    .from(users)
    .where(eq(users.id, param))
    .limit(1);
  return result[0]?.publicName ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, userId: rawParam } = await params;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const publicName = await resolveUserName(rawParam);

  if (!publicName) {
    return { title: `Creator Not Found - ${appName}` };
  }

  return {
    title: `${publicName} - Creator Profile`,
    description: `${publicName} builds AI skills on ${appName}. Explore their work and start a conversation.`,
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<CreatorPageData> {
  const { locale, userId } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const viewer: JwtPayloadType = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  const { t } = scopedTranslation.scopedT(locale);
  const response = await CreatorProfileRepository.getCreatorProfile(
    { userId },
    locale,
    logger,
    t,
    viewer,
  );

  return {
    locale,
    creatorId: userId,
    viewer,
    initialData: response.success ? response.data : undefined,
  };
}

export function TanstackPage(data: CreatorPageData): JSX.Element {
  return <CreatorProfilePage {...data} />;
}

export default async function CreatorPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <CreatorProfilePage {...data} />;
}
