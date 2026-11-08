export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { scopedTranslation } from "@/user/public/verify-email/i18n";

import { VerifyEmailPageClient } from "../page-client";

interface PageProps {
  params: Promise<{
    locale: CountryLanguage;
    token: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return {
    title: t("widget.heroTitle"),
    description: t("widget.heroDescription"),
    // Personal one-time link - keep it out of search indexes
    robots: { index: false, follow: false },
  };
}

export interface VerifyEmailPageData {
  locale: CountryLanguage;
  token: string;
  authUser: JwtPayloadType;
  platform: Platform;
}

export async function tanstackLoader({
  params,
}: PageProps): Promise<VerifyEmailPageData> {
  const { locale, token } = await params;

  const logger = createEndpointLogger(false, locale);
  const authUser = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return {
    locale,
    token: decodeURIComponent(token),
    authUser,
    platform: Platform.NEXT_PAGE,
  };
}

export function TanstackPage({
  locale,
  token,
  authUser,
  platform,
}: VerifyEmailPageData): JSX.Element {
  return (
    <VerifyEmailPageClient
      locale={locale}
      user={authUser}
      token={token}
      platform={platform}
    />
  );
}

export default async function VerifyEmailPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
