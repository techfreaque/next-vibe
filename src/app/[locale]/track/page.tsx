import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import TrackPageClient from "./page-client";

interface TrackPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface TrackPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * Tracking Page - Records click engagement and handles referral codes
 */
export async function tanstackLoader({
  params,
}: TrackPageProps): Promise<TrackPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  return { locale, user };
}

export function TanstackPage({ locale, user }: TrackPageData): JSX.Element {
  return <TrackPageClient locale={locale} user={user} />;
}

export default async function TrackPage({
  params,
}: TrackPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
