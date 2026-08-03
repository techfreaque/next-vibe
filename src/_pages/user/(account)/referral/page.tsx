/**
 * Referral Dashboard Page
 * Comprehensive referral management with earnings and payout info
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
import { getReferralParams } from "./i18n/utils";
import { ReferralPageClient } from "./page-client";

interface ReferralPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ReferralPageData {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
}

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);

  const referralParams = getReferralParams(locale);
  return {
    title: t("title", { appName: configTranslations.appName }),
    description: t("description", {
      appName: configTranslations.appName,
      directPct: referralParams.directPct,
    }),
  };
}

export async function tanstackLoader({
  params,
}: ReferralPageProps): Promise<ReferralPageData> {
  const { locale } = await params;

  // Check if user is authenticated (but don't redirect)
  const logger = createEndpointLogger(false, locale);
  const minimalUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !minimalUser.isPublic && !!minimalUser.id;
  return {
    locale,
    isAuthenticated,
    user: minimalUser,
    platform: Platform.NEXT_PAGE,
  };
}

export function TanstackPage({
  locale,
  isAuthenticated,
  user,
  platform,
}: ReferralPageData): JSX.Element {
  return (
    <ReferralPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      user={user}
      platform={platform}
    />
  );
}

export default async function ReferralPage({
  params,
}: ReferralPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
