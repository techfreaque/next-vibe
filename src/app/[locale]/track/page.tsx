export const dynamic = "force-dynamic";

import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { JSX } from "react";

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
  const logger = createEndpointLogger(false, locale);
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
