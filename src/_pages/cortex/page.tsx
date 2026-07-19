/**
 * Cortex Page
 * Standalone page for browsing and managing the user's cortex (persistent AI memory).
 */

export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { CortexPageClient } from "./page-client";

interface CortexPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface CortexPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: CortexPageProps): Promise<CortexPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, user };
}

export function TanstackPage({ locale, user }: CortexPageData): JSX.Element {
  return <CortexPageClient locale={locale} user={user} />;
}

export default async function CortexPage({
  params,
}: CortexPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
