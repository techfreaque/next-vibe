/**
 * Public Creator Profile Page
 * Link-tree style page showing a creator's public skills and profile.
 * URL: /[locale]/creator/[userId]
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { notFound } from "next-vibe/ui/lib/not-found";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
import { scopedTranslation } from "@/user/public/creator/[userId]/i18n";
import { CreatorProfileRepository } from "@/user/public/creator/[userId]/repository";

import { type CreatorPageData, CreatorProfilePage } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; userId: string }>;
}

interface CreatorIdentity {
  id: string;
  publicName: string;
  creatorSlug: string | null;
}

/** Resolve the published slug and title for profile metadata. */
async function resolveCreatorIdentity(
  param: string,
): Promise<CreatorIdentity | null> {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(param)) {
    const { eq, or, sql } = await import("drizzle-orm");
    const { db } = await import("next-vibe/database");
    const { users } = await import("next-vibe/identity/user/db");
    const result = await db
      .select({
        id: users.id,
        publicName: users.publicName,
        creatorSlug: users.creatorSlug,
      })
      .from(users)
      .where(
        or(
          eq(users.creatorSlug, param),
          eq(sql`lower(replace(${users.publicName}, ' ', '-'))`, param),
        ),
      )
      .limit(1);
    return result[0] ?? null;
  }
  const { eq } = await import("drizzle-orm");
  const { db } = await import("next-vibe/database");
  const { users } = await import("next-vibe/identity/user/db");
  const result = await db
    .select({
      id: users.id,
      publicName: users.publicName,
      creatorSlug: users.creatorSlug,
    })
    .from(users)
    .where(eq(users.id, param))
    .limit(1);
  return result[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, userId: rawParam } = await params;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t } = scopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const creator = await resolveCreatorIdentity(rawParam);

  if (!creator) {
    notFound();
  }

  const { id, publicName, creatorSlug } = creator;
  return metadataGenerator(locale, {
    path: `creator/${encodeURIComponent(creatorSlug ?? id)}`,
    title: t("meta.title", { publicName }),
    description: t("meta.description", { publicName, appName }),
    category: t("category"),
    imageAlt: t("category"),
    keywords: [t("category")],
  });
}

export async function tanstackLoader({
  params,
}: Props): Promise<CreatorPageData> {
  const { locale, userId } = await params;
  const logger = createEndpointLogger(false, locale);
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

  if (
    !response.success &&
    response.errorType === ErrorResponseTypes.NOT_FOUND
  ) {
    notFound();
  }

  return {
    locale,
    creatorId: userId,
    viewer,
    platform: Platform.NEXT_PAGE,
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
