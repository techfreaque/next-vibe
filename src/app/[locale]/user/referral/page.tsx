/**
 * Referral Dashboard Page
 * Comprehensive referral management with earnings and payout info
 */

import type { Metadata } from "next";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ReferralPageClient } from "./page-client";

interface ReferralPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: ReferralPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.user.referral.title", {
      appName: t("config.appName"),
    }),
    description: t("app.user.referral.description"),
  };
}

export default async function ReferralPage({
  params,
}: ReferralPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Check if user is authenticated (but don't redirect)
  const logger = createEndpointLogger(false, Date.now(), locale);
  const minimalUser = await AuthRepository.getAuthMinimalUser<[]>(
    [],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !minimalUser.isPublic && !!minimalUser.id;
  return (
    <ReferralPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      user={minimalUser}
      logger={logger}
    />
  );
}
