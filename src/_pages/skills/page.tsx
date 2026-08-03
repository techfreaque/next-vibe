/**
 * AI Skills Page
 * Standalone page for browsing AI skills.
 * Same content as the popover, but as a full page with back navigation.
 */

export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { SkillsPageClient } from "./page-client";

interface SkillsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SkillsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: SkillsPageProps): Promise<SkillsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, user, platform: Platform.NEXT_PAGE };
}

export function TanstackPage({
  locale,
  user,
  platform,
}: SkillsPageData): JSX.Element {
  return <SkillsPageClient locale={locale} user={user} platform={platform} />;
}

export default async function SkillsPage({
  params,
}: SkillsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
