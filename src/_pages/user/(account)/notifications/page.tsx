/**
 * Notifications - full list behind the bell's "View all".
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { translations as configTranslations } from "@/env/i18n/en";

import { scopedTranslation as pageT } from "./i18n";
import { NotificationsPageClient } from "./page-client";

interface NotificationsPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface NotificationsPageData {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
}

export async function generateMetadata({
  params,
}: NotificationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  return {
    title: t("metaTitle", { appName: configTranslations.appName }),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

export async function tanstackLoader({
  params,
}: NotificationsPageProps): Promise<NotificationsPageData> {
  const { locale } = await params;

  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !user.isPublic && !!user.id;

  return { locale, isAuthenticated, user, platform: Platform.NEXT_PAGE };
}

export function TanstackPage({
  locale,
  isAuthenticated,
  user,
  platform,
}: NotificationsPageData): JSX.Element {
  return (
    <NotificationsPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      user={user}
      platform={platform}
    />
  );
}

export default async function NotificationsPage({
  params,
}: NotificationsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
