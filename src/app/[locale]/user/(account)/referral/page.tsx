/**
 * Referral Dashboard Page
 * Comprehensive referral management with earnings and payout info
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { translations as configTranslations } from "@/config/i18n/en";
import type { CountryLanguage } from "@/i18n/core/config";

import { getReferralParams, scopedTranslation as pageT } from "./i18n";
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
  const logger = createEndpointLogger(false, Date.now(), locale);
  const minimalUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !minimalUser.isPublic && !!minimalUser.id;
  return { locale, isAuthenticated, user: minimalUser };
}

export function TanstackPage({
  locale,
  isAuthenticated,
  user,
}: ReferralPageData): JSX.Element {
  return (
    <ReferralPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      user={user}
    />
  );
}

export default async function ReferralPage({
  params,
}: ReferralPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
