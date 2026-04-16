export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { translations as configTranslations } from "@/config/i18n/en";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";
import { SettingsPageClient } from "./page-client";

interface SettingsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface SettingsPageData {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
}

export async function generateMetadata({
  params,
}: SettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  return {
    title: `${t("title")} - ${configTranslations.appName}`,
    description: t("description"),
  };
}

export async function tanstackLoader({
  params,
}: SettingsPageProps): Promise<SettingsPageData> {
  const { locale } = await params;

  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !user.isPublic && !!user.id;

  return { locale, isAuthenticated, user };
}

export function TanstackPage({
  locale,
  isAuthenticated,
  user,
}: SettingsPageData): JSX.Element {
  return (
    <SettingsPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      user={user}
    />
  );
}

export default async function SettingsPage({
  params,
}: SettingsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
