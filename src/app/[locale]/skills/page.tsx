/**
 * AI Skills Page
 * Standalone page for browsing AI skills.
 * Same content as the popover, but as a full page with back navigation.
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { SkillsPageClient } from "./page-client";

interface SkillsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SkillsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: SkillsPageProps): Promise<SkillsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, user };
}

export function TanstackPage({ locale, user }: SkillsPageData): JSX.Element {
  return <SkillsPageClient locale={locale} user={user} />;
}

export default async function SkillsPage({
  params,
}: SkillsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
