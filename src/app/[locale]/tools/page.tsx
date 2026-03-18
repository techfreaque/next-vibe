/**
 * AI Tools Page
 * Standalone page for managing AI tool configuration.
 * Same content as the modal, but as a full page with back navigation.
 */

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { ToolsPageClient } from "./page-client";

interface ToolsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface ToolsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: ToolsPageProps): Promise<ToolsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, user };
}

export function TanstackPage({ locale, user }: ToolsPageData): JSX.Element {
  return <ToolsPageClient locale={locale} user={user} />;
}

export default async function ToolsPage({
  params,
}: ToolsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
